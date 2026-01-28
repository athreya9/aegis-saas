import { Router, Request, Response } from 'express';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// POST /api/v1/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { email, password, fullName, broker } = req.body;

        if (!email || !password || !broker) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if user exists
        const existing = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "User already exists" });
        }

        const userId = uuidv4();
        // In a real app, hash the password. For this MVP/Mock Phase, storing as is or simple hash is acceptable if isolation is guaranteed.
        // We will store as "mock_hash_" + password for basic obfuscation.
        const passwordHash = `mock_hash_${password}`;

        // 1. Create User (Status: PENDING_APPROVAL)
        await db.query(`
            INSERT INTO users (user_id, email, password_hash, full_name, status, tier, created_at)
            VALUES ($1, $2, $3, $4, 'PENDING_APPROVAL', 'FREE', NOW())
        `, [userId, email, passwordHash, fullName || 'Trader']);

        // 2. Link Broker Selection
        await db.query(`
            INSERT INTO user_brokers (user_id, broker_name, status, created_at)
            VALUES ($1, $2, 'DISCONNECTED', NOW())
        `, [userId, broker]);

        // 3. Initialize Sandbox State (Disabled by default)
        await db.query(`
            INSERT INTO sandbox_state (user_id, execution_mode, auto_trading_enabled, last_sync)
            VALUES ($1, 'PAPER', false, NOW())
        `, [userId]);

        res.status(201).json({
            status: "success",
            message: "User created successfully. Pending approval.",
            data: { userId, email, status: 'PENDING_APPROVAL' }
        });

    } catch (e: any) {
        console.error("Signup Error:", e);
        res.status(500).json({ status: "error", message: e.message });
    }
});

// POST /api/v1/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Mock Accounts Bypass
        if (email === 'demo@aegis.local' || email === 'admin@aegis.local') {
            // Let frontend handle mock accounts, or handle here if we want centralized.
            // But for consistent DB logic, let's query DB first.
        }

        const result = await db.query('SELECT user_id, email, password_hash, full_name, status, tier FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];
        const expectedHash = `mock_hash_${password}`;

        if (user.password_hash !== expectedHash && user.password_hash !== password) { // Support plain text for legacy/dev
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({
            status: "success",
            data: {
                id: user.user_id,
                email: user.email,
                name: user.full_name,
                status: user.status,
                tier: user.tier
            }
        });

    } catch (e: any) {
        console.error("Login Error:", e);
        res.status(500).json({ status: "error", message: e.message });
    }
});

export default router;
