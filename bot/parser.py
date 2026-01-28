import re
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def parse_signal(text: str):
    """
    Heuristic-based parser for varied Telegram signal formats.
    """
    if not text:
        return None
        
    # Clean text
    text_clean = re.sub(r'[^\w\s\.\-\/\@\(\)]', ' ', text)
    
    # 1. Extract Symbol (e.g., BANKNIFTY 25JAN 45500 CE, NIFTY 22000 PE, SENSEX 83400 CE)
    # Pattern: Look for major words + Optional numbers + CE/PE
    symbol_match = re.search(r'(NIFTY|BANKNIFTY|SENSEX|FINNIFTY|MIDCPNIFTY)\s*(\d*)\s*(CE|PE)', text_clean, re.IGNORECASE)
    if not symbol_match:
        # Fallback for just symbols like 83400 CE
        symbol_match = re.search(r'(\d{5})\s*(CE|PE)', text_clean, re.IGNORECASE)
        
    if not symbol_match:
        return None
        
    symbol = symbol_match.group(0).strip().upper()
    
    # 2. Extract Side (Buy/Sell)
    side = "BUY" # Default to buy as per channel style
    if re.search(r'sell|put', text_clean, re.IGNORECASE):
        side = "SELL"
    elif re.search(r'buy|call', text_clean, re.IGNORECASE):
        side = "BUY"

    # 3. Extract Entry Price
    # Patterns: "@ 350", "buy it (285-295)", "Upto 275", "CMP", "current price"
    entry = None
    # Try range first like (285-295)
    range_match = re.search(r'\((\d+)\s*\-\s*(\d+)\)', text_clean)
    if range_match:
        entry = (float(range_match.group(1)) + float(range_match.group(2))) / 2
    else:
        # Try numbers near "buy", "at", "@", "upto"
        entry_match = re.search(r'(?:buy|at|\@|upto|price|entry)\s*(\d+(?:\.\d+)?)', text_clean, re.IGNORECASE)
        if entry_match:
            entry = float(entry_match.group(1))
        else:
            # Last resort: just find numbers after symbol
            numbers = re.findall(r'(\d+(?:\.\d+)?)', text_clean[symbol_match.end():])
            if numbers:
                entry = float(numbers[0])

    if not entry:
        return None

    # 4. Extract Targets
    # Pattern: "Target" followed by list of numbers
    targets = []
    target_section = re.split(r'target|tgt', text_clean, flags=re.IGNORECASE)
    if len(target_section) > 1:
        # Extract all numbers from the target section until "stop" or "sl"
        target_text = re.split(r'stop|sl|sl hit', target_section[1], flags=re.IGNORECASE)[0]
        targets = [float(t) for t in re.findall(r'(\d+(?:\.\d+)?)', target_text)]
    
    # Filter targets that make sense (targets > entry for BUY)
    if side == "BUY":
        targets = [t for t in targets if t > entry]
    else:
        targets = [t for t in targets if t < entry]

    # 5. Extract Stoploss
    sl = None
    sl_match = re.search(r'(?:sl|stoploss|stop|loss)\s*(\d+(?:\.\d+)?)', text_clean, re.IGNORECASE)
    if sl_match:
        sl = float(sl_match.group(1))
    
    # --- STRICT VALIDATION LAYER ---
    if not targets:
        return {"status": "REJECTED", "reason": "No valid targets found"}
        
    if sl is None:
        # Auto-calculate SL if missing? No, user wants strict.
        return {"status": "REJECTED", "reason": "No stoploss found"}

    if side == "BUY":
        if sl >= entry:
            return {"status": "REJECTED", "reason": f"SL ({sl}) >= Entry ({entry}) for BUY"}
        if entry >= targets[0]:
            return {"status": "REJECTED", "reason": f"Entry ({entry}) >= T1 ({targets[0]}) for BUY"}
    else:
        if sl <= entry:
            return {"status": "REJECTED", "reason": f"SL ({sl}) <= Entry ({entry}) for SELL"}
        if entry <= targets[0]:
            return {"status": "REJECTED", "reason": f"Entry ({entry}) <= T1 ({targets[0]}) for SELL"}

    return {
        "instrument": "NFO",
        "symbol": symbol,
        "side": side,
        "entry_price": entry,
        "stop_loss": sl,
        "targets": targets,
        "confidence": 90,
        "timestamp_ist": datetime.now().isoformat(),
        "status": "PARSED"
    }

if __name__ == "__main__":
    test_cases = [
        "SENSEX 83400 CE Buy it (285-295)‼️ Target 🔼 310 320 330 350 Stoploss 220",
        "Buy 83400 CE✅ Upto 275 Target 310 320 330 350 SL 240",
        "BANKNIFTY 25JAN 45500 CE buy 350 sl 300 tgt 400/450/500",
        "Just news text, ignore"
    ]
    for msg in test_cases:
        res = parse_signal(msg)
        print(f"Msg: {msg[:30]}... | Result: {res}")
