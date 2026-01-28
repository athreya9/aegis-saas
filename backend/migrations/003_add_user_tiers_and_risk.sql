
-- Add Tier and Risk columns to users table

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS tier VARCHAR(20) DEFAULT 'FREE',
ADD COLUMN IF NOT EXISTS risk_quota_max_capital DECIMAL(15, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS risk_quota_max_risk_per_trade DECIMAL(5, 4) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(20) DEFAULT 'MONTHLY';

-- Backfill tier from plan_type if exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='plan_type') THEN
        UPDATE users SET tier = plan_type WHERE plan_type IN ('FREE', 'BASIC', 'PRO', 'ELITE') AND tier = 'FREE';
    END IF;
END $$;

-- Create Index
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier);
