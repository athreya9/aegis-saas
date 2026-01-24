-- Aegis SaaS Platform - Initial PostgreSQL Schema
-- Fully Isolated from Core Trading System

-- 1. Users table (SaaS Web Users)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'user_123'
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT, -- Mock for now
    plan_type VARCHAR(20) DEFAULT 'CORE', -- CORE, BALANCED, ACTIVE, SIGNALS_ONLY
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Subscriptions
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(user_id),
    plan_name VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL, -- active, expired, cancelled
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    amount DECIMAL(10, 2)
);

-- 3. Signals Daily (Cached Signal History for SaaS Display)
CREATE TABLE signals_daily (
    id SERIAL PRIMARY KEY,
    signal_id UUID UNIQUE NOT NULL,
    instrument VARCHAR(20) NOT NULL,
    symbol VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL, -- BUY/SELL
    entry_price DECIMAL(10, 2),
    stop_loss DECIMAL(10, 2),
    target_1 DECIMAL(10, 2),
    target_2 DECIMAL(10, 2),
    target_3 DECIMAL(10, 2),
    confidence INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. User Daily Summary (SaaS Metrics)
CREATE TABLE user_daily_summary (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(user_id),
    date DATE DEFAULT CURRENT_DATE,
    trades_executed INTEGER DEFAULT 0,
    pnl_incurred DECIMAL(12, 2) DEFAULT 0.00,
    risk_cap_reached BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, date)
);

-- 5. Sandbox State (Persistence for Isolated Actors)
CREATE TABLE sandbox_state (
    user_id VARCHAR(50) PRIMARY KEY REFERENCES users(user_id),
    auto_trading_enabled BOOLEAN DEFAULT FALSE,
    risk_profile VARCHAR(20) DEFAULT 'CONSERVATIVE',
    broker_connected BOOLEAN DEFAULT FALSE,
    session_expires_at TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Audit Logs (SaaS Platform Actions)
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50),
    action VARCHAR(50) NOT NULL, -- LOGIN, ENABLE_AUTO, KILL_SWITCH, etc.
    details JSONB,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
