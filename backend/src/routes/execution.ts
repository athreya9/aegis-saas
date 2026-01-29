import { Router } from 'express';
import { requireRole, requireBrokerConnection, UserRole } from '../middleware/rbac';
import { sandboxManager } from '../core/manager';
import { OSClient } from '../core/os-client';
import { QuotaManager } from '../core/quota-manager';
import { TIERS, UserTier } from '../config/tiers';

const router = Router();
const osClient = OSClient.getInstance();

// Middleware to simulate Context (User ID usually from Auth middleware)
const mockUserMiddleware = (req: any, res: any, next: any) => {
    const userId = req.headers['x-user-id'] as string || 'default_user';
    const planType = req.headers['x-user-plan'] as string || 'CORE';
    // Mock Role for testing if header present, else default
    const role = req.headers['x-user-role'] as UserRole || UserRole.VIEW_ONLY;

    req.user = { id: userId, plan: planType, role };
    next();
};

router.use(mockUserMiddleware);

// POST /api/v1/execution/request
// Secured: Must be TRADER role and have Active Broker
router.post('/request', requireRole(UserRole.TRADER), requireBrokerConnection(), async (req: any, res) => {
    const { strategy, params } = req.body;
    const requestId = req.headers['x-request-id'] || `REQ-${Date.now()}`;
    const userId = req.user.id;
    const tier = (req.user.plan || 'FREE').toUpperCase() as UserTier;

    console.log(`[Execution] Request received from ${userId} (ID: ${requestId})`);

    // 1. Quota Check
    const quota = QuotaManager.canPlaceLiveTrade(userId, TIERS[tier] ? tier : UserTier.FREE);
    if (!quota.allowed) {
        return res.status(403).json({
            status: "error",
            error: "QUOTA_EXCEEDED",
            message: quota.reason
        });
    }

    // 2. Sandbox Validation (Pre-Flight, Risk, etc.)
    const sandbox = sandboxManager.getSandbox(userId);
    const validation = await sandbox.validateExecutionRequest(strategy, params);

    if (!validation.valid) {
        return res.status(400).json({
            status: "error",
            error: "VALIDATION_FAILED",
            message: validation.reason
        });
    }

    // 3. Submit Command to OS
    const result = await osClient.submitCommand(
        "EXECUTION_REQUEST",
        { strategy, params },
        userId,
        requestId as string
    );

    if (result.success) {
        // Optimistically increment trade count (OS might reject later, but we count intent)
        QuotaManager.incrementTradeCount(userId);

        return res.json({
            status: "success",
            message: "Request accepted for execution.",
            requestId
        });
    } else {
        return res.status(502).json({
            status: "error",
            error: "OS_REJECTION",
            message: result.message
        });
    }
});

export default router;
