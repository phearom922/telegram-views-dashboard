# fetchTelegramData.py
from telethon.sync import TelegramClient
import requests
from datetime import datetime, timedelta, timezone
import os
import dotenv

dotenv.load_dotenv()

api_id = int(os.getenv('TELEGRAM_API_ID'))
api_hash = os.getenv('TELEGRAM_API_HASH')
channel_username = os.getenv('TELEGRAM_CHANNEL')  # เช่น 'SuccessmoreCambodiaOfficial'
backend_api_url = os.getenv('BACKEND_API_URL')  # เช่น http://localhost:5000/api/posts/import

client = TelegramClient('telegram_session', api_id, api_hash)

def fetch_and_send_posts():
    with client:
        posts = []
        one_month_ago = datetime.now(timezone.utc) - timedelta(days=30)

        for message in client.iter_messages(channel_username, limit=500):
            if message.date < one_month_ago:
                break
            if message.views:
                posts.append({
                    'message_id': message.id,
                    'views': message.views,
                    'date': message.date.isoformat()
                })

        res = requests.post(backend_api_url, json={'posts': posts})
        print("Data sent to backend:", res.status_code, res.text)

if __name__ == "__main__":
    fetch_and_send_posts()
