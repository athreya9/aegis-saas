import { Router } from 'express';
import { db } from '../db/pg-client';
import { sandboxManager } from '../core/manager';

const router = Router();

// Middleware to mock user context (for user-facing routes)
const mockUserMiddleware = (req: any, res: any, next: any) => {
    const userId = req.headers['x-user-id'] as string || 'default_user';
    req.user = { id: userId };
    next();
};

// POST /api/v1/execution-mode/request-live (User Action)
router.post('/request-live', mockUserMiddleware, async (req: any, res) => {
    const userId = req.user.id;
    try {
        // 1. Verify Broker Connection
        const sandbox = sandboxManager.getSandbox(userId);
        const status = await sandbox.getStatus();

        if (!status.brokerConnected) {
            return res.status(400).json({ error: 'BROKER_NOT_CONNECTED', message: 'You must connect a valid broker first.' });
        }

        // 2. Update DB Request
        await db.query(
            `UPDATE broker_credentials 
             SET execution_mode = 'REQUESTED', mode_updated_at = CURRENT_TIMESTAMP 
             WHERE user_id = $1 AND execution_mode = 'SANDBOX'`,
            [userId]
        );

        res.json({ status: 'success', message: 'Live mode requested. Pending admin approval.' });
    } catch (e: any) {
        res.status(500).json({ error: 'INTERNAL_ERROR', message: e.message });
    }
});

// POST /api/v1/execution-mode/approve-live/:userId (Admin Action)
router.post('/approve-live/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        await db.query(
            `UPDATE broker_credentials 
             SET execution_mode = 'LIVE', mode_updated_at = CURRENT_TIMESTAMP 
             WHERE user_id = $1`,
            [userId]
        );
        res.json({ status: 'success', message: `User ${userId} promoted to LIVE execution mode.` });
    } catch (e: any) {
        res.status(500).json({ error: 'INTERNAL_ERROR', message: e.message });
    }
});

// POST /api/v1/execution-mode/downgrade-sandbox/:userId (Kill Switch)
router.post('/downgrade-sandbox/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        await db.query(
            `UPDATE broker_credentials 
             SET execution_mode = 'SANDBOX', mode_updated_at = CURRENT_TIMESTAMP 
             WHERE user_id = $1`,
            [userId]
        );

        // Also disable auto-trading in memory to be safe
        // sandbox.disableAutoTrading() - Removed (Stateless Execution)

        res.json({ status: 'success', message: `User ${userId} downgraded to SANDBOX execution mode.` });
    } catch (e: any) {
        res.status(500).json({ error: 'INTERNAL_ERROR', message: e.message });
    }
});

export default router;
