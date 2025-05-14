# backend/utils/fetchTelegramData.py
from dotenv import load_dotenv
import os
import datetime
import pymongo
from telethon.sync import TelegramClient
from telethon.sessions import StringSession

load_dotenv()

api_id = int(os.getenv('TELEGRAM_API_ID'))
api_hash = os.getenv('TELEGRAM_API_HASH')
channel_username = os.getenv('TELEGRAM_CHANNEL')
mongo_uri = os.getenv("MONGO_URI")
session_str = os.getenv("SESSION_STRING")

if not all([api_id, api_hash, channel_username, mongo_uri, session_str]):
    raise ValueError("Missing environment variables in .env")

client = TelegramClient(StringSession(session_str), api_id, api_hash)

try:
    print("Starting Telegram client...")
    client.start()
    print("Client started successfully")

    print("Connecting to MongoDB...")
    mongo_client = pymongo.MongoClient(mongo_uri)
    print("MongoDB server info:", mongo_client.server_info())
    db = mongo_client.telegramdb.posts
    print("Using database 'telegramdb', collection 'posts'")

    # ตรวจสอบ message_id ล่าสุดใน MongoDB
    latest_message = db.find().sort("message_id", -1).limit(1)
    latest_message_id = None
    if db.count_documents({}) > 0:
        latest_message = list(latest_message)[0]
        latest_message_id = latest_message["message_id"]
        print(f"Latest message_id in MongoDB: {latest_message_id}")
    else:
        print("No existing data in MongoDB")

    three_months_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=90)
    print(f"Fetching messages from {channel_username} since {three_months_ago}")

    message_count = 0
    messages_to_insert = []  # เก็บข้อมูลก่อนบันทึกเป็น batch
    for message in client.iter_messages(channel_username, limit=100):
        print(f"Found message {message.id} dated {message.date}")
        
        # หยุดถ้าเจอข้อความที่เก่ากว่า 3 เดือน
        if message.date < three_months_ago:
            print("Reached three months ago, stopping")
            break
        
        # ข้ามถ้า message_id นี้มีอยู่ใน MongoDB แล้ว
        if latest_message_id and message.id <= latest_message_id:
            print(f"Message {message.id} already exists, stopping")
            break

        if message.views is not None:
            message_count += 1
            print(f"Processing message {message.id} with {message.views} views")
            messages_to_insert.append({
                "message_id": message.id,
                "views": message.views,
                "date": message.date,
                "url": f"https://t.me/{channel_username.strip('@')}/{message.id}"
            })

    # บันทึกข้อมูลเป็น batch
    if messages_to_insert:
        result = db.insert_many(messages_to_insert)
    else:
        print("No new messages to insert")
except Exception as e:
    print(f"Error: {str(e)}")
finally:
    print("Disconnecting client...")
    client.disconnect()
    print("Client disconnected")