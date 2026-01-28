
import { db } from '../db';
import { UserTier } from '../config/user-tier';
import { BILLING_CONFIG } from '../config/billing-config';
import { User } from '../types/user';

export class SubscriptionManager {

    /**
     * Get billing details and feature status for a user
     */
    static async getSubscriptionStatus(userId: string) {
        const result = await db.query(
            'SELECT tier, risk_quota_max_capital, risk_quota_max_risk_per_trade FROM users WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) throw new Error('User not found');
        const user = result.rows[0];

        const tier = (user.tier as UserTier) || UserTier.FREE;
        const limits = BILLING_CONFIG.limits[tier];

        return {
            tier,
            limits,
            risk_quota: {
                max_capital: parseFloat(user.risk_quota_max_capital) || 0,
                max_risk_per_trade: parseFloat(user.risk_quota_max_risk_per_trade) || limits.riskQuotaPercent
            },
            features: {
                realTimeData: limits.realTimeData,
                priorityExecution: limits.priorityExecution,
                paperOnly: limits.paperTradingOnly
            }
        };
    }

    /**
     * Upgrade or Change Plan
     * In a real system, this would interface with Stripe.
     * Here we just update the DB status.
     */
    static async changePlan(userId: string, targetTier: UserTier) {
        // Enforce validations if needed (e.g., downgrade restrictions)

        await db.query(
            'UPDATE users SET tier = $1, billing_cycle = $2 WHERE user_id = $3',
            [targetTier, 'MONTHLY', userId]
        );

        return await this.getSubscriptionStatus(userId);
    }

    /**
     * Check if user is allowed to perform action based on Tier
     */
    static async validateActionLimit(userId: string, metric: 'daily_trades' | 'capital_usage', value: number): Promise<boolean> {
        const status = await this.getSubscriptionStatus(userId);

        if (metric === 'daily_trades') {
            if (status.limits.maxTradesPerDay === 0) return false; // Blocked
            // In real impl, check Redis/DB for today's count
            // For now, returning true if tier allows > 0
            return true;
        }

        return true;
    }
}
