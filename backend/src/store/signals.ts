// In-Memory Mock Data Store for Backend Phase 1

export const DAILY_SIGNALS = [
    {
        signal_id: "550e8400-e29b-41d4-a716-446655440001",
        instrument: "NIFTY",
        symbol: "NIFTY 25JAN 21500 CE",
        side: "BUY",
        entry_price: 142.20,
        stop_loss: 125.00,
        targets: {
            t1: 160.00,
            t2: 185.00,
            t3: 210.00
        },
        confidence_pct: 92,
        outcome_status: "T1",
        timestamp_ist: "09:25:30",
        meta: {
            strategy_version: "v4.2.1-alpha",
            risk_rating: "LOW"
        }
    },
    {
        signal_id: "550e8400-e29b-41d4-a716-446655440002",
        instrument: "BANKNIFTY",
        symbol: "BANKNIFTY 25JAN 46000 PE",
        side: "SELL",
        entry_price: 320.50,
        stop_loss: 360.00,
        targets: {
            t1: 280.00,
            t2: 240.00,
            t3: 200.00
        },
        confidence_pct: 88,
        outcome_status: "T2",
        timestamp_ist: "09:45:15",
        meta: {
            strategy_version: "v4.2.1-alpha",
            risk_rating: "MEDIUM"
        }
    },
    {
        signal_id: "550e8400-e29b-41d4-a716-446655440003",
        instrument: "SENSEX",
        symbol: "SENSEX 25JAN 72000 CE",
        side: "BUY",
        entry_price: 450.00,
        stop_loss: 410.00,
        targets: {
            t1: 490.00,
            t2: 550.00,
            t3: 620.00
        },
        confidence_pct: 95,
        outcome_status: "OPEN",
        timestamp_ist: "11:30:00",
        meta: {
            strategy_version: "v4.2.1-alpha",
            risk_rating: "HIGH"
        }
    }
];

export const HISTORY_SIGNALS = [
    // Empty for Phase 1 or add sample if needed
];
