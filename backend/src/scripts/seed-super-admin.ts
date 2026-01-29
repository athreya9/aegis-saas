
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load env from one level up
dotenv.config({ path: path.join(__dirname, '../../.env') });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase/Neon usually
});

async function main() {
    try {
        await client.connect();
        console.log("Connected to DB");

        // 1. Ensure 'role' column exists
        console.log("Checking schema...");
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN 
                    ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'VIEW_ONLY'; 
                    RAISE NOTICE 'Added role column';
                END IF;
            END $$;
        `);

        // 2. Check if Super Admin exists
        const email = 'athreya9@gmail.com';
        // Password format: mock_hash_<password> as per current auth implementation
        const passwordPlain = 'Aegis@saas$uper9';
        const passwordHash = `mock_hash_${passwordPlain}`;

        const checkRes = await client.query('SELECT user_id FROM users WHERE email = $1', [email]);

        let userId;
        if (checkRes.rows.length > 0) {
            console.log("Super Admin exists. Updating credentials...");
            userId = checkRes.rows[0].user_id;
            await client.query(`
                UPDATE users 
                SET password_hash = $1, role = 'SUPER_ADMIN', status = 'ACTIVE'
                WHERE user_id = $2
            `, [passwordHash, userId]);
        } else {
            console.log("Creating Super Admin...");
            userId = 'admin-super-001'; // Fixed ID for stability
            await client.query(`
                INSERT INTO users (user_id, email, password_hash, full_name, status, tier, role, created_at)
                VALUES ($1, $2, $3, 'System Administrator', 'ACTIVE', 'ENTERPRISE', 'SUPER_ADMIN', NOW())
            `, [userId, email, passwordHash]);
        }

        // 3. Ensure Broker Credential Entry exists (even if empty) for consistency
        await client.query(`
            INSERT INTO user_brokers (user_id, broker_name, status)
            VALUES ($1, 'MANUAL', 'CONNECTED')
            ON CONFLICT (user_id) DO NOTHING
        `, [userId]);

        console.log("Super Admin Seed Complete.");
        console.log(`User: ${email}`);
        console.log(`Role: SUPER_ADMIN`);

    } catch (e) {
        console.error("Seed Error:", e);
    } finally {
        await client.end();
    }
}

main();
