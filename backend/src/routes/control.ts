import { Router, Request, Response } from 'express';
import { sandboxManager } from '../core/manager';
import { db } from '../db/pg-client';
import { SystemConfig } from '../core/config';
import { RiskProfile } from '../core/sandbox';
import { QuotaManager } from '../core/quota-manager';
import { TIERS, UserTier } from '../config/tiers';
import { OSClient } from '../core/os-client';

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

// POST /api/v1/control/kill-switch
router.post('/kill-switch', async (req: any, res) => {
    const { reason } = req.body;
    console.warn(`[Control] KILL SWITCH REQUESTED by ${req.user.id}`);

    // Call OS Client Panic
    const result = await OSClient.getInstance().triggerPanic(
        req.user.id,
        reason || "SAAS_ADMIN_MANUAL_KILL"
    );

    if (result.success) {
        // Update DB to safe mode
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
    } else {
        res.status(500).json({
            status: "error",
            message: "Failed to trigger OS Panic",
            details: result.message
        });
    }
});

export default router;
