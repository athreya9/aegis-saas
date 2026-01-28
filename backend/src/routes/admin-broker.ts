import { Router } from 'express';
import { db } from '../db/pg-client';

const router = Router();

// POST /api/v1/admin/broker/force-reauth/:userId
router.post('/force-reauth/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Technically "Force Re-auth" in our read-only context means clearing the last validation
        // or effectively making the token look expired/invalid.
        // For now, we update last_validated_at to far in the past.
        await db.query(
            'UPDATE broker_credentials SET last_validated_at = $1 WHERE user_id = $2',
            [new Date(0), userId]
        );
        res.json({ status: 'success', message: `Force re-auth initiated for user ${userId}` });
    } catch (e: any) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

// POST /api/v1/admin/broker/disable/:userId
router.post('/disable/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        await db.query(
            'UPDATE broker_credentials SET is_disabled = TRUE WHERE user_id = $2',
            [userId]
        );
        res.json({ status: 'success', message: `Broker access disabled for user ${userId}` });
    } catch (e: any) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

// POST /api/v1/admin/broker/enable/:userId (Helper for internal testing)
router.post('/enable/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        await db.query(
            'UPDATE broker_credentials SET is_disabled = FALSE WHERE user_id = $1',
            [userId]
        );
        res.json({ status: 'success', message: `Broker access enabled for user ${userId}` });
    } catch (e: any) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

export default router;
