import re
import json
import asyncio
import requests
from datetime import datetime
from telethon import TelegramClient

# CONFIG
API_ENDPOINT = "http://91.98.226.5:4100/api/v1/signals/ingest"
BOT_SECRET = "AEGIS_BOT_SECRET_V1"
API_ID = 33096444
API_HASH = "a15b675d594842d128711e8391c1b6a1"
TARGET_CHANNEL = "Options_Banknifty_Share_Market"

# Regex for standard format
SIGNAL_PATTERN = r"([A-Z0-9]+)\s+(buy|sell)\s+(\d+)\s+sl\s+(\d+)\s+tgt\s+([\d\/]+)"

client = TelegramClient('aegis_session', API_ID, API_HASH)

def parse_signal(text):
    match = re.search(SIGNAL_PATTERN, text, re.IGNORECASE)
    if match:
        symbol, side, entry, sl, tgts = match.groups()
        return {
            "instrument": "NFO",
            "symbol": symbol.upper(),
            "side": side.upper(),
            "entry_price": float(entry),
            "stop_loss": float(sl),
            "targets": [float(t) for t in tgts.split('/')],
            "confidence": 95,
            "timestamp_ist": datetime.now().isoformat()
        }
    return None

async def forward_signal(payload):
    headers = {
        "x-api-key": BOT_SECRET,
        "x-source": "TELEGRAM",
        "Content-Type": "application/json"
    }
    try:
        res = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=5)
        print(f"   [API] Status: {res.status_code} | Reason: {res.json().get('reason', 'ACCEPTED')}")
    except Exception as e:
        print(f"   [API] Error: {e}")

async def main():
    print(f"📜 Replaying last 10 messages from @{TARGET_CHANNEL}...")
    await client.start()
    
    # Get last 10 messages
    async for message in client.iter_messages(TARGET_CHANNEL, limit=10):
        if not message.text: continue
        
        print(f"\n[RAW MSG] {message.text[:100]}...")
        signal = parse_signal(message.text)
        
        if signal:
            print(f"   [PARSED] {signal['symbol']} {signal['side']} at {signal['entry_price']}")
            payload = {
                **signal,
                "id": f"REPLAY-{message.id}",
                "source": f"TELEGRAM:@{TARGET_CHANNEL}",
                "metadata": {"original_text": message.text, "is_replay": True}
            }
            await forward_signal(payload)
        else:
            print("   [SKIP] Non-signal message")

if __name__ == "__main__":
    asyncio.run(main())
