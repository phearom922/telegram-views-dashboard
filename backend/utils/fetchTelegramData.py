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

# ตรวจสอบค่า environment variables
if not all([api_id, api_hash, channel_username, mongo_uri, session_str]):
    raise ValueError("Missing environment variables in .env")
client = TelegramClient(StringSession(session_str), api_id, api_hash)



# backend/utils/fetchTelegramData.py
try:
    client.start()
    print("Client started successfully")

    print("Connecting to MongoDB...")
    mongo_client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    print("MongoDB server info:", mongo_client.server_info())
    db = mongo_client.telegramdb.posts
    print("Using database 'telegram', collection 'posts'")

    one_month_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=30)
    print(f"Fetching messages from {channel_username} since {one_month_ago}")

    message_count = 0
    for message in client.iter_messages(channel_username, limit=1000):
        print(f"Found message {message.id} dated {message.date}")
        if message.date < one_month_ago:
            print("Reached one month ago, stopping")
            break
        if message.views is not None:
            message_count += 1
            print(f"Processing message {message.id} with {message.views} views")
            result = db.insert_one({  # เปลี่ยนจาก update_one เป็น insert_one
                "message_id": message.id,
                "views": message.views,
                "date": message.date,
                "url": f"{channel_username.strip('@')}/{message.id}"
            })
            print(f"Insert result: {result.inserted_id}")
    print(f"Processed {message_count} messages")
except Exception as e:
    print(f"Error: {str(e)}")
finally:
    print("Disconnecting client...")
    client.disconnect()
    print("Client disconnected")