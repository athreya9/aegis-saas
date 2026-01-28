import os
import asyncio
import logging
from datetime import datetime
from telethon import TelegramClient, events
from parser import parse_signal

# CONFIGURATION
# Primary configuration for VPS environment
BASE_DIR = "/opt/aegis-saas/telegram"
SESSION_PATH = os.path.join(BASE_DIR, "session.session")

# Fallback for local development/testing
if not os.path.exists(BASE_DIR):
    logger = logging.getLogger(__name__)
    logger.warning(f"VPS directory {BASE_DIR} not found. Falling back to local directory.")
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    SESSION_PATH = os.path.join(BASE_DIR, "aegis_session") # Use existing session name

# Telegram API Credentials (Provided)
API_ID = 33096444
API_HASH = "a15b675d594842d128711e8391c1b6a1"
TARGET_CHANNEL = "Options_Banknifty_Share_Market"

# Backend API Configuration
API_ENDPOINT = "http://91.98.226.5:4100/api/v1/signals/ingest"
BOT_SECRET = "AEGIS_BOT_SECRET_V1"

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(BASE_DIR, "bot.log")),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

client = TelegramClient(SESSION_PATH, API_ID, API_HASH)

async def forward_signal(payload):
    import requests
    headers = {
        "x-api-key": BOT_SECRET,
        "x-source": "TELEGRAM",
        "Content-Type": "application/json"
    }
    try:
        # Use simple POST for now as per previous implementation
        # In production, consider using aiohttp for async compatibility
        res = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=5)
        if res.status_code == 200:
            logger.info(f"✅ ACCEPTED: {payload['symbol']} {payload['side']}")
        else:
            logger.warning(f"⚠️ REJECTED: {res.json().get('reason', 'Unknown error')}")
    except Exception as e:
        logger.error(f"❌ NETWORK ERROR: {e}")

@client.on(events.NewMessage(chats=TARGET_CHANNEL))
async def handler(event):
    text = event.raw_text
    logger.info(f"New message received: {text[:50]}...")
    
    signal = parse_signal(text)
    if signal:
        payload = {
            **signal,
            "id": f"TLG-{event.id}",
            "source": f"TELEGRAM:@{TARGET_CHANNEL}",
            "metadata": {"original_text": text}
        }
        await forward_signal(payload)
    else:
        logger.debug("Message ignored (non-signal)")

async def main():
    logger.info(f"🚀 Aegis Telethon Listener starting for @{TARGET_CHANNEL}...")
    logger.info(f"Using session at: {SESSION_PATH}")
    
    try:
        # Check if session exists to avoid interactive login prompts
        if not os.path.exists(SESSION_PATH if SESSION_PATH.endswith('.session') else f"{SESSION_PATH}.session"):
            logger.error("❌ Session file not found. Please provide credentials for manual login if required.")
            # In VPS mode, we should NOT attempt interactive login unless explicitly intended
            # For now, we wait for a session to be placed there.
            return

        await client.start()
        logger.info("📡 Connection established. Listening for signals...")
        await client.run_until_disconnected()
    except Exception as e:
        logger.error(f"Failed to start client: {e}")

if __name__ == "__main__":
    asyncio.run(main())
