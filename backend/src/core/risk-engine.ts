
import { Request, Response, NextFunction } from 'express';
import { SubscriptionManager } from './subscription-manager';
import { UserTier } from '../config/user-tier';

export class RiskEngine {

    /**
     * Middleware to enforce Risk Quotas before execution
     */
    static async validateExecution(req: Request, res: Response, next: NextFunction) {
        const userId = req.headers['x-user-id'] as string;

        // If no user ID (e.g. public route), skip (or block if strict)
        if (!userId) {
            return res.status(401).json({ error: "Risk Engine: User Identification Required" });
        }

        try {
            const status = await SubscriptionManager.getSubscriptionStatus(userId);

            // Check 1: Is user allowed to trade at all?
            if (status.limits.maxTradesPerDay === 0) {
                return res.status(403).json({
                    error: "Risk Engine: Trading not enabled for this Tier (FREE). Upgrade to BASIC/PRO."
                });
            }

            // Check 2: Check Max Capital Usage (Simulated for request body 'amount')
            const requestedAmount = req.body.amount || 0;
            if (requestedAmount > status.risk_quota.max_capital) {
                return res.status(403).json({
                    error: `Risk Engine: Capital limit exceeded. Max: ${status.risk_quota.max_capital}, Requested: ${requestedAmount}`
                });
            }

            // Check 3: Risk Per Trade enforcement can happen here if 'stop_loss' is in body
            // ... logic ...

            next();
        } catch (e: any) {
            console.error('[RiskEngine] Error:', e);
            res.status(500).json({ error: "Risk Engine Validation Failed" });
        }
    }
}
