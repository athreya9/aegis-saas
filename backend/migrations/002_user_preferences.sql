CREATE TABLE IF NOT EXISTS user_preferences (
    user_id VARCHAR(255) PRIMARY KEY REFERENCES users(user_id),
    options_enabled BOOLEAN DEFAULT FALSE,
    commodities_enabled BOOLEAN DEFAULT FALSE,
    futures_enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT NOW()
);
