import os
import asyncio
import logging
import requests
from datetime import datetime, timezone, timedelta
from telethon import TelegramClient, events
from parser import parse_signal

# CONFIGURATION
BASE_DIR = "/opt/aegis-saas/telegram"
SESSION_NAME = "aegis_ingest"
SESSION_PATH = os.path.join(BASE_DIR, SESSION_NAME)

# Telegram API Credentials
API_ID = 33096444
API_HASH = "a15b675d594842d128711e8391c1b6a1"
TARGET_CHANNEL = "Options_Banknifty_Share_Market"

# Backend API
API_ENDPOINT = "http://91.98.226.5:4100/api/v1/signals/ingest"
BOT_SECRET = "AEGIS_BOT_SECRET_V1"

# In-Memory Cache for De-duplication (5 Minutes)
# Format: { "Symbol_Side": datetime }
dedup_cache = {}
DEDUP_WINDOW = timedelta(minutes=5)

# Logging setup
if not os.path.exists(BASE_DIR):
    try:
        os.makedirs(BASE_DIR, exist_ok=True)
    except PermissionError:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        SESSION_PATH = os.path.join(BASE_DIR, SESSION_NAME)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(BASE_DIR, "live_ingest.log")),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

client = TelegramClient(SESSION_PATH, API_ID, API_HASH)

async def forward_signal(payload, is_replay=False):
    headers = {
        "x-api-key": BOT_SECRET,
        "x-source": "TELEGRAM",
        "Content-Type": "application/json"
    }
    
    try:
        res = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=10)
        decision = "ACCEPTED" if res.status_code == 200 else f"REJECTED ({res.status_code})"
        
        # LOG REQUIREMENT: Raw, Parsed, Confidence, Decision
        logger.info(f"--- INGESTION REPORT ---")
        logger.info(f"RAW: {payload['metadata']['original_text'][:100]}...")
        logger.info(f"PARSED: {payload['symbol']} {payload['side']} @ {payload['entry_price']}")
        logger.info(f"CONFIDENCE: {payload.get('confidence', 90)}%")
        logger.info(f"DECISION: {decision}")
        if res.status_code != 200:
            logger.error(f"BACKEND ERROR: {res.text}")
        logger.info(f"------------------------")
        
    except Exception as e:
        logger.error(f"❌ NETWORK ERROR: {e}")

async def process_message(message, is_live=False):
    text = message.text
    if not text:
        return
        
    # 1. LIVE AGE CHECK (< 60 seconds)
    if is_live:
        msg_time = message.date.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        age = (now - msg_time).total_seconds()
        if age > 60:
            logger.warning(f"SKIP: Message too old ({int(age)}s) | Text: {text[:30]}")
            return

    # 2. PARSE SIGNAL
    signal = parse_signal(text)
    if not signal:
        return # Skip non-signal chatter
        
    # 3. LOGIC VALIDATION
    if signal.get("status") == "REJECTED":
        logger.info(f"--- REJECTION REPORT ---")
        logger.info(f"RAW: {text[:100]}...")
        logger.info(f"DECISION: REJECTED ({signal.get('reason')})")
        logger.info(f"------------------------")
        return

    # 4. DE-DUPLICATION (5-Minute Window)
    dedup_key = f"{signal['symbol']}_{signal['side']}"
    now = datetime.now(timezone.utc)
    if dedup_key in dedup_cache:
        last_seen = dedup_cache[dedup_key]
        if now - last_seen < DEDUP_WINDOW:
            logger.info(f"SKIP: Duplicate signal for {dedup_key} within 5 mins")
            return
    
    dedup_cache[dedup_key] = now
    # Clean old cache entries occasionally
    if len(dedup_cache) > 100:
        expired = [k for k, v in dedup_cache.items() if now - v > DEDUP_WINDOW]
        for k in expired: del dedup_cache[k]

    # 5. PREPARE PAYLOAD
    payload = {
        **signal,
        "id": f"TLG-{message.id}",
        "source": "TELEGRAM_EXTERNAL",
        "metadata": {
            "original_text": text,
            "is_replay": not is_live,
            "ingested_at": now.isoformat()
        }
    }
    
    await forward_signal(payload, is_replay=not is_live)

@client.on(events.NewMessage(chats=TARGET_CHANNEL))
async def live_handler(event):
    await process_message(event.message, is_live=True)

async def run_initial_sync():
    # Only sync last 20 messages on startup to avoid massive historical replay
    logger.info(f"📜 Replaying last 20 messages for initial sync...")
    async for message in client.iter_messages(TARGET_CHANNEL, limit=20):
        await process_message(message, is_live=False)

async def main():
    logger.info("🚀 Aegis Telegram LIVE Ingestion starting (PROD MODE)...")
    try:
        await client.start()
        
        # Verify access to channel
        channel = await client.get_entity(TARGET_CHANNEL)
        logger.info(f"Connected to @{TARGET_CHANNEL}: {channel.title}")
        
        # Initial sync
        await run_initial_sync()
        
        # Live Ingestion
        logger.info("📡 LIVE Ingestion Active. Listening for new broadcasts...")
        await client.run_until_disconnected()
    except Exception as e:
        logger.error(f"FATAL ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(main())
