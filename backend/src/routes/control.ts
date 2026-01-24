import { Router } from 'express';
import { sandboxManager } from '../core/manager';
import { RiskProfile } from '../core/sandbox';

const router = Router();

// Middleware to simulate User Context (since auth is mock for now)
const mockUserMiddleware = (req: any, res: any, next: any) => {
    const userId = req.headers['x-user-id'] as string || 'default_user';
    const planType = req.headers['x-user-plan'] as string || 'CORE';
    req.user = { id: userId, plan: planType };

    // Update Sandbox Context immediately
    const sandbox = sandboxManager.getSandbox(userId);
    sandbox.setPlanType(planType);

    next();
};

router.use(mockUserMiddleware);

// GET /api/v1/control/status
router.get('/status', async (req: any, res) => {
    const sandbox = sandboxManager.getSandbox(req.user.id);
    res.json({
        status: "success",
        data: await sandbox.getStatus()
    });
});

// GET /api/v1/control/all-status (ADMIN ONLY simulation)
router.get('/all-status', async (req: any, res) => {
    // In real system, check for admin role
    const userIds = sandboxManager.getAllActiveUsers();
    const allStatuses = await Promise.all(
        userIds.map(id => sandboxManager.getSandbox(id).getStatus())
    );

    res.json({
        status: "success",
        data: allStatuses
    });
});

// POST /api/v1/control/broker/auth
router.post('/broker/auth', async (req: any, res) => {
    const { apiKey, accessToken } = req.body;
    const sandbox = sandboxManager.getSandbox(req.user.id);

    try {
        const success = await sandbox.connectBroker({ apiKey, accessToken });
        res.json({
            status: success ? "success" : "failed",
            message: success ? "Broker Connected (Paper Mode)" : "Connection Failed",
            sandbox_state: await sandbox.getStatus()
        });
    } catch (e: any) {
        res.status(500).json({ error: "AUTH_ERROR", message: e.message });
    }
});

// POST /api/v1/control/broker/kill-switch
router.post('/broker/kill-switch', async (req: any, res) => {
    const sandbox = sandboxManager.getSandbox(req.user.id);
    sandbox.triggerKillSwitch();
    res.json({
        status: "success",
        message: "Kill Switch Triggered. Session Expired & Auto-Trading Disabled.",
        sandbox_state: await sandbox.getStatus()
    });
});

// POST /api/v1/control/auto-trading
router.post('/auto-trading', async (req: any, res) => {
    const { enabled } = req.body;
    const sandbox = sandboxManager.getSandbox(req.user.id);

    // Mock Plan Check (Blueprint Requirement)
    const userPlan = req.headers['x-user-plan'] || 'CORE';
    if (userPlan === 'SIGNALS_ONLY' || userPlan === 'BASIC') {
        return res.status(403).json({
            error: "PLAN_RESTRICTED",
            message: "Automation not available on this plan"
        });
    }

    if (enabled) {
        // Attempt to Enable Auto-Trading
        const success = await sandbox.enableAutoTrading();
        if (!success) {
            return res.status(400).json({
                error: "OPERATION_FAILED",
                message: "Cannot enable auto-trading. Check Risk Limit or Broker Session."
            });
        }
    } else {
        sandbox.disableAutoTrading();
    }

    const status = await sandbox.getStatus();

    res.json({
        status: "success",
        current_state: status.autoTrading ? "ENABLED" : "DISABLED",
        sandbox_state: status
    });
});

// POST /api/v1/control/risk-profile
router.post('/risk-profile', async (req: any, res) => {
    const { profile } = req.body;
    const sandbox = sandboxManager.getSandbox(req.user.id);

    try {
        sandbox.setRiskProfile(profile as RiskProfile);
        res.json({
            status: "success",
            data: await sandbox.getStatus()
        });
    } catch (e: any) {
        res.status(400).json({
            error: "OPERATION_FAILED",
            message: e.message
        });
    }
});

export default router;
