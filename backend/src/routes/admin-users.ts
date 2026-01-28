import { Router, Request, Response } from 'express';
import { db } from '../db';
import { SandboxManager } from '../core/sandbox';

const router = Router();

// Middleware to verify Admin Authority
const verifyAdmin = (req: Request, res: Response, next: any) => {
    const role = req.headers['x-user-role'];
    if (role !== 'ADMIN') {
        return res.status(403).json({ error: "ADMIN_AUTHORITY_REQUIRED" });
    }
    next();
};

// GET /api/v1/admin/users
router.get('/', verifyAdmin, async (req: Request, res: Response) => {
    try {
        // Fetch users with their broker and sandbox status
        const result = await db.query(`
            SELECT 
                u.user_id, 
                u.email, 
                u.status, 
                u.tier, 
                u.created_at,
                u.risk_quota_max_capital,
                ub.broker_name, 
                ub.status as broker_status,
                s.execution_mode,
                s.auto_trading_enabled as sandbox_active
            FROM users u
            LEFT JOIN user_brokers ub ON u.user_id = ub.user_id
            LEFT JOIN sandbox_state s ON u.user_id = s.user_id
            ORDER BY u.created_at DESC
        `);

        res.json({
            status: "success",
            data: result.rows
        });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

// POST /api/v1/admin/users/:id/status
router.post('/:id/status', verifyAdmin, async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { status } = req.body; // ACTIVE, PAUSED, BLOCKED

        if (!['ACTIVE', 'PAUSED', 'BLOCKED'].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        await db.query('UPDATE users SET status = $1 WHERE user_id = $2', [status, id]);

        // If blocking or pausing, we might want to kill sandbox too
        if (status !== 'ACTIVE') {
            await SandboxManager.forceStop(id);
        }

        res.json({ status: "success", message: `User ${id} status updated to ${status}` });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

// POST /api/v1/admin/users/:id/kill
router.post('/:id/kill', verifyAdmin, async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await SandboxManager.forceStop(id);
        res.json({ status: "success", message: `Execution killed for user ${id}` });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});


// POST /api/v1/admin/users/:id/plan
router.post('/:id/plan', verifyAdmin, async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { tier } = req.body;

        // Import dynamically to avoid circular issues if any (though Config is safe)
        const { UserTier } = require('../config/user-tier');
        const { SubscriptionManager } = require('../core/subscription-manager');

        if (!Object.values(UserTier).includes(tier)) {
            return res.status(400).json({ error: `Invalid Tier. Must be one of: ${Object.values(UserTier).join(', ')}` });
        }

        const newStatus = await SubscriptionManager.changePlan(id, tier);

        res.json({
            status: "success",
            message: `User ${id} upgraded to ${tier}`,
            data: newStatus
        });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

export default router;
