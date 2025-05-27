# backend/utils/fetchScheduled.py
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
    db = mongo_client.telegramdb.posts
    print("Using database 'telegramdb', collection 'posts'")

    # ลบข้อมูลเก่าทั้งหมด
    db.delete_many({})
    print("Cleared old data")

    three_months_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=90)
    print(f"Fetching messages from {channel_username} since {three_months_ago}")

    message_count = 0
    messages_to_insert = []
    for message in client.iter_messages(channel_username, limit=100):
        print(f"Found message {message.id} dated {message.date}")
        if message.date < three_months_ago:
            print("Reached three months ago, stopping")
            break
        if message.views is not None:
            message_count += 1
            messages_to_insert.append({
                "message_id": message.id,
                "views": message.views,
                "date": message.date,
                "url": f"{channel_username.strip('@')}/{message.id}"
            })

    if messages_to_insert:
        db.insert_many(messages_to_insert)
        print(f"Inserted {len(messages_to_insert)} messages")
    print(f"Processed {message_count} messages")

    # บันทึกเวลาที่ดึงข้อมูลล่าสุด
    with open("last_fetch.txt", "w") as f:
        f.write(datetime.datetime.now(datetime.timezone.utc).isoformat())
    print("Updated last fetch time")

except Exception as e:
    print(f"Error: {str(e)}")
finally:
    client.disconnect()
    print("Client disconnected")