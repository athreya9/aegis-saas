-- Rollback: Remove status and role from users table
-- Down
ALTER TABLE users DROP COLUMN IF EXISTS status;
ALTER TABLE users DROP COLUMN IF EXISTS role;
