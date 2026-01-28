import { Router, Request, Response } from 'express';
import { sandboxManager } from '../core/manager';
import { db } from '../db/pg-client';
import { SystemConfig } from '../core/config';
import { RiskProfile } from '../core/sandbox';
import { QuotaManager } from '../core/quota-manager';
import { TIERS, UserTier } from '../config/tiers';

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

// GET /api/v1/control/config-meta (Public Config)
router.get('/config-meta', (req, res) => {
    res.json({
        status: "success",
        features: SystemConfig.getFeatureFlags(),
        plans: {
            SIGNALS: SystemConfig.getPlanConfig('SIGNALS'),
            AUTOMATION: SystemConfig.getPlanConfig('AUTOMATION'),
            ENTERPRISE: SystemConfig.getPlanConfig('ENTERPRISE')
        }
    });
});

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
    const userIds = sandboxManager.getAllActiveUsers();

    // Fetch DB credentials for all active users
    let dbCredentials: any[] = [];
    try {
        if (userIds.length > 0) {
            const placeholders = userIds.map((_, i) => `$${i + 1}`).join(',');
            const result = await db.query(
                `SELECT user_id, broker_name, last_validated_at, is_disabled, execution_mode FROM broker_credentials WHERE user_id IN (${placeholders})`,
                userIds
            );
            dbCredentials = result.rows;
        }
    } catch (e) {
        console.error("Admin DB Fetch Error:", e);
    }

    const allStatuses = await Promise.all(
        userIds.map(async (id) => {
            const sbStatus = await sandboxManager.getSandbox(id).getStatus();
            const dbCred = dbCredentials.find(c => c.user_id === id);

            // Determine admin-view broker status
            let adminBrokerStatus = 'NOT_CONFIGURED';
            if (dbCred) {
                if (dbCred.is_disabled) {
                    adminBrokerStatus = 'DISABLED';
                } else if (sbStatus.brokerConnected) {
                    adminBrokerStatus = 'CONNECTED';
                } else {
                    // Check if token looks expired (mock logic based on last_validated being old)
                    const lastVal = new Date(dbCred.last_validated_at).getTime();
                    // Assume 24h expiry for generic check if not connected
                    if (Date.now() - lastVal > 24 * 60 * 60 * 1000) {
                        adminBrokerStatus = 'EXPIRED';
                    } else {
                        adminBrokerStatus = 'INVALID';
                    }
                }
            }

            return {
                ...sbStatus,
                brokerName: dbCred?.broker_name || (sbStatus as any).brokerName || '-', // Fallback or DB source
                executionMode: dbCred?.execution_mode || 'SANDBOX',
                adminBrokerStatus: adminBrokerStatus,
                lastValidated: dbCred?.last_validated_at || null
            };
        })
    );

    res.json({
        status: "success",
        data: allStatuses
    });
});

// POST /api/v1/control/auto-trading
router.post('/auto-trading', async (req: any, res) => {
    const { enabled } = req.body;
    const sandbox = sandboxManager.getSandbox(req.user.id);
    const executionMode = (req.body.executionMode || 'SANDBOX').toUpperCase();

    // 1. Quota Check for LIVE Trading
    if (enabled && executionMode === 'LIVE') {
        const userPlan = (req.user.plan || 'FREE').toUpperCase();
        // Map string plan to UserTier enum (fallback to FREE)
        const tier = TIERS[userPlan as keyof typeof TIERS] ? (userPlan as UserTier) : UserTier.FREE;

        const quota = QuotaManager.canPlaceLiveTrade(req.user.id, tier);
        if (!quota.allowed) {
            return res.status(403).json({
                error: "QUOTA_EXCEEDED",
                message: quota.reason,
                tier: userPlan
            });
        }
    }

    if (enabled) {
        // Attempt to Enable Auto-Trading
        const success = await sandbox.enableAutoTrading(executionMode);

        if (!success) {
            // Fetch checks to give specific reason
            const { checks } = await sandbox.validatePreFlight();
            const failed = checks.find(c => !c.passed);

            return res.status(400).json({
                error: "PRE_FLIGHT_FAILED",
                message: failed ? `Check Failed: ${failed.label}` : "Auto-trading activation failed safety checks.",
                checks
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

    console.log(`[Control] Update Risk Profile attempt for ${req.user.id}: ${profile}`);

    try {
        sandbox.setRiskProfile(profile as RiskProfile);
        const status = await sandbox.getStatus();
        console.log(`[Control] Risk Profile updated to ${status.riskProfile}`);
        res.json({
            status: "success",
            data: status
        });
    } catch (e: any) {
        console.error(`[Control] Risk Profile update FAILED: ${e.message}`);
        res.status(400).json({
            error: "OPERATION_FAILED",
            message: e.message
        });
    }
});

// GET /api/v1/control/pre-flight
router.get('/pre-flight', async (req: any, res) => {
    const sandbox = sandboxManager.getSandbox(req.user.id);
    const result = await sandbox.validatePreFlight();
    res.json({
        status: "success",
        data: result
    });
});

// POST /api/v1/control/kill-switch
router.post('/kill-switch', async (req: any, res) => {
    const sandbox = sandboxManager.getSandbox(req.user.id);
    console.warn(`[Control] KILL SWITCH REQUESTED by ${req.user.id}`);

    // 1. Halt Trading Memory
    sandbox.panicStop();

    // 2. Revert Execution Mode in DB
    try {
        await db.query(
            `UPDATE broker_credentials 
             SET execution_mode = 'SANDBOX', mode_updated_at = CURRENT_TIMESTAMP 
             WHERE user_id = $1`,
            [req.user.id]
        );
    } catch (e) {
        console.error("Kill Switch DB Revert Fail:", e);
    }

    res.json({
        status: "success",
        message: "KILL SWITCH ACTIVATED. System Halted."
    });
});

export default router;
