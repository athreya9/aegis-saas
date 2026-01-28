import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/v1/preferences
router.get('/', async (req: Request, res: Response) => {
    try {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) {
            return res.status(401).json({ error: "User ID required" });
        }

        // Check if preferences exist, if not return default
        const result = await db.query(`
            SELECT options_enabled, commodities_enabled, futures_enabled 
            FROM user_preferences 
            WHERE user_id = $1
        `, [userId]);

        if (result.rows.length === 0) {
            return res.json({
                options_enabled: false,
                commodities_enabled: false,
                futures_enabled: false
            });
        }

        res.json(result.rows[0]);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// POST /api/v1/preferences
router.post('/', async (req: Request, res: Response) => {
    try {
        const userId = req.headers['x-user-id'] as string;
        const { options_enabled, commodities_enabled, futures_enabled } = req.body;

        if (!userId) {
            return res.status(401).json({ error: "User ID required" });
        }

        await db.query(`
            INSERT INTO user_preferences (user_id, options_enabled, commodities_enabled, futures_enabled, updated_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                options_enabled = EXCLUDED.options_enabled,
                commodities_enabled = EXCLUDED.commodities_enabled,
                futures_enabled = EXCLUDED.futures_enabled,
                updated_at = NOW()
        `, [userId, options_enabled || false, commodities_enabled || false, futures_enabled || false]);

        res.json({ status: "success", message: "Preferences updated" });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
