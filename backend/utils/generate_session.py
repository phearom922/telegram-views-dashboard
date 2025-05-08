# from dotenv import load_dotenv
# from telethon.sync import TelegramClient
# from telethon.sessions import StringSession
# import os

# load_dotenv()

# api_id = int(os.getenv("TELEGRAM_API_ID"))
# api_hash = os.getenv("TELEGRAM_API_HASH")

# with TelegramClient(StringSession(), api_id, api_hash) as client:
#     print("📱 กรุณาล็อกอินด้วยเบอร์โทรศัพท์ของคุณ")
#     print("✅ SESSION_STRING ของคุณ:")
#     print(client.session.save())




from telethon.sync import TelegramClient
from telethon.sessions import StringSession

api_id = int(input("Enter your API ID: "))
api_hash = input("Enter your API Hash:")
phone = input("Enter your phone number (with country code):")

client = TelegramClient(StringSession(), api_id, api_hash)
client.start(phone)
print(client.session.save())


