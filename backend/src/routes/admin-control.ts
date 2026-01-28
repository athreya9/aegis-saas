import { Router, Request, Response } from 'express';
import { SandboxManager } from '../core/sandbox';
import { OSClient } from '../core/os-client';

const router = Router();

// Middleware to verify Admin Authority
// Middleware to verify Admin Authority
import { requireRole, UserRole } from '../middleware/rbac';

let GLOBAL_KILL_SWITCH = false;

// POST /api/v1/admin/kill-switch
// Requires SUPER_ADMIN for true system kill
router.post('/kill-switch', requireRole(UserRole.SUPER_ADMIN), async (req: Request, res: Response) => {
    try {
        const { active } = req.body;
        // Ideally get userId from auth middleware (mocking for now since we rely on role header)
        const userId = req.headers['x-user-id'] as string || 'admin_user';

        GLOBAL_KILL_SWITCH = active;

        if (active) {
            // 1. Force stop all SaaS Sandboxes (Metadata level)
            await SandboxManager.stopAll();

            // 2. Trigger OS Panic (Physical level)
            const osResult = await OSClient.getInstance().triggerPanic(userId, "Admin Dashboard Manual Panic");

            if (!osResult.success) {
                // If OS fails, we still keep SaaS kill switch active, but warn user
                res.json({
                    status: "partial_success",
                    kill_switch: true,
                    message: `SaaS halted, but OS Panic failed: ${osResult.message}. MANUAL OS STOP REQUIRED.`
                });
                return;
            }
        }

        res.json({
            status: "success",
            kill_switch: GLOBAL_KILL_SWITCH,
            message: active ? "SYSTEM HALTED. OS & SaaS stopped." : "System resumed. Brokers must be manually reconnected."
        });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

// GET /api/v1/admin/system/status
router.get('/system/status', requireRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    res.json({
        status: "success",
        kill_switch: GLOBAL_KILL_SWITCH,
        active_sandboxes: SandboxManager.getActiveCount(),
        uptime: process.uptime()
    });
});

export default router;
