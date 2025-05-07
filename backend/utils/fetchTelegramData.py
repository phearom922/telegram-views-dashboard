# fetchTelegramData.py
from dotenv import load_dotenv
import os
import datetime
import pymongo
from telethon.sync import TelegramClient
from telethon.sessions import StringSession

load_dotenv()

api_id = int(os.getenv('TELEGRAM_API_ID'))
api_hash = os.getenv('TELEGRAM_API_HASH')
channel_username = os.getenv('TELEGRAM_CHANNEL')  # เช่น 'SuccessmoreCambodiaOfficial'
backend_api_url = os.getenv('BACKEND_API_URL')  # เช่น http://localhost:5000/api/posts/import
mongo_uri = os.getenv("MONGO_URI")
session_str = os.getenv("SESSION_STRING")

client = TelegramClient(StringSession(session_str), api_id, api_hash)
client.start()
db = pymongo.MongoClient(mongo_uri).telegram.posts

one_month_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=30)

for message in client.iter_messages(channel_username, limit=1000):
    if message.date < one_month_ago:
        break
    if message.views is not None:
        db.update_one(
            {"message_id": message.id},
            {"$set": {
                "message_id": message.id,
                "views": message.views,
                "date": message.date,
                "url": f"https://t.me/{channel_username.strip('@')}/{message.id}"
            }},
            upsert=True
        )
