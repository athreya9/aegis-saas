from parser import parse_signal
import json

def run_dry_run():
    # Realistic sample messages from @Options_Banknifty_Share_Market style
    # (Based on common patterns for such channels)
    samples = [
        "BANKNIFTY 25JAN 45500 CE buy 350 sl 300 tgt 400/450/500",
        "NIFTY 25JAN 21500 PE buy 120 sl 100 tgt 150/180",
        "CRUDEOIL buy 6500 sl 6450 tgt 6600",
        "Good morning traders! Watch for 45000 level.",
        "BANKNIFTY buy 45000 sl 44800 tgt 45200/45400"
    ]
    
    print("=== Aegis Signal Parser Dry-Run Validation ===\n")
    
    valid_count = 0
    for i, msg in enumerate(samples, 1):
        print(f"Sample {i}: {msg}")
        result = parse_signal(msg)
        if result:
            print(f"✅ Parsed: {json.dumps(result, indent=2)}")
            valid_count += 1
        else:
            print("❌ No signal detected.")
        print("-" * 40)
        
    print(f"\nSummary: {valid_count}/{len(samples)} signals correctly identified.")

if __name__ == "__main__":
    run_dry_run()
