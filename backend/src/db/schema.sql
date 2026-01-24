-- Aegis SaaS Backend Data Schema
-- Phase 1 Design Only (PostgreSQL)

-- Daily Signals (Source of Truth)
CREATE TABLE IF NOT EXISTS signals_daily (
    signal_id UUID PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    instrument VARCHAR(10) NOT NULL CHECK (instrument IN ('NIFTY', 'BANKNIFTY', 'SENSEX')),
    side VARCHAR(4) NOT NULL CHECK (side IN ('BUY', 'SELL')),
    
    -- Price Logic
    entry_price DECIMAL(10,2) NOT NULL,
    stop_loss DECIMAL(10,2) NOT NULL,
    target_1 DECIMAL(10,2) NOT NULL,
    target_2 DECIMAL(10,2) NOT NULL,
    target_3 DECIMAL(10,2) NOT NULL,
    
    confidence_pct INT NOT NULL,
    
    -- Meta
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    timestamp_ist VARCHAR(10) NOT NULL, -- Display Time
    raw_data JSONB NOT NULL, -- Full signal details
    
    -- Status
    outcome_final VARCHAR(10) -- FILLED EOD: T1, T2, SL, EXPIRED
);

-- User Performance (Private)
CREATE TABLE IF NOT EXISTS user_daily_summary (
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    profile_snapshot VARCHAR(20), -- Risk profile used
    signals_taken INT DEFAULT 0,
    pnl_net DECIMAL(10,2),
    drawdown_max DECIMAL(10,2),
    PRIMARY KEY (user_id, date)
);
