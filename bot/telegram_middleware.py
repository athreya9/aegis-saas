import re
import json
import asyncio
import requests
from datetime import datetime
from telethon import TelegramClient, events

# CONFIG
API_ENDPOINT = "http://91.98.226.5:4100/api/v1/signals/ingest"
BOT_SECRET = "AEGIS_BOT_SECRET_V1"
API_ID = 33096444
API_HASH = "a15b675d594842d128711e8391c1b6a1"
TARGET_CHANNEL = "Options_Banknifty_Share_Market"

# Regex for standard format: SYMBOL buy PRICE sl PRICE tgt PRICE[/PRICE]
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
        if res.status_code == 200:
            print(f"✅ ACCEPTED: {payload['symbol']} {payload['side']}")
        else:
            print(f"⚠️ REJECTED: {res.json().get('reason', 'Unknown error')}")
    except Exception as e:
        print(f"❌ NETWORK ERROR: {e}")

@client.on(events.NewMessage(chats=TARGET_CHANNEL))
async def handler(event):
    text = event.raw_text
    print(f"\n[NEW MSG] {text[:50]}...")
    
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
        print("⏭️ Ignored (Non-signal message)")

async def main():
    print(f"🚀 Aegis Telethon Listener starting for @{TARGET_CHANNEL}...")
    await client.start()
    print("📡 Listening for real-time signals...")
    await client.run_until_disconnected()

if __name__ == "__main__":
    asyncio.run(main())
