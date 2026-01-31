import { Router, Request, Response } from 'express';
import { SandboxManager } from '../core/sandbox';
import { OSClient } from '../core/os-client';

const router = Router();

// Middleware to verify Admin Authority
// Middleware to verify Admin Authority
import { requireRole, UserRole } from '../middleware/rbac';

let GLOBAL_KILL_SWITCH = false;

// admin/kill-switch REMOVED - SaaS is Read-Only Transparency Layer

// GET /api/v1/admin/system/status
router.get('/system/status', requireRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    res.json({
        status: "success",
        kill_switch: GLOBAL_KILL_SWITCH,
        active_sandboxes: 0, // Deprecated metric
        uptime: process.uptime()
    });
});

export default router;
