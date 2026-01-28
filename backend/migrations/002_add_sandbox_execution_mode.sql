-- Migration: Add execution_mode to sandbox_state
-- Up
ALTER TABLE sandbox_state ADD COLUMN IF NOT EXISTS execution_mode VARCHAR(20) DEFAULT 'SANDBOX';

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sandbox_state' AND column_name = 'execution_mode';
