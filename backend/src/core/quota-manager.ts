import { UserTier, TIERS } from '../config/tiers';

export interface UsageStats {
    userId: string;
    date: string; // YYYY-MM-DD
    liveTradesCount: number;
    riskUsed: number;
}

// In-memory store for demo. In production, this would be Redis/DB.
const USAGE_STORE: Record<string, UsageStats> = {};

export class QuotaManager {
    static getTodayDate(): string {
        return new Date().toISOString().split('T')[0];
    }

    static getUsage(userId: string): UsageStats {
        const today = this.getTodayDate();
        const key = `${userId}:${today}`;

        if (!USAGE_STORE[key]) {
            USAGE_STORE[key] = {
                userId,
                date: today,
                liveTradesCount: 0,
                riskUsed: 0
            };
        }
        return USAGE_STORE[key];
    }

    static canPlaceLiveTrade(userId: string, tier: UserTier): { allowed: boolean; reason?: string } {
        const limits = TIERS[tier];
        const usage = this.getUsage(userId);

        if (limits.maxLiveTradesPerDay === 0) {
            return { allowed: false, reason: `Live trading is disabled on ${tier} plan.` };
        }

        if (usage.liveTradesCount >= limits.maxLiveTradesPerDay) {
            return { allowed: false, reason: `Daily trade limit reached (${usage.liveTradesCount}/${limits.maxLiveTradesPerDay}). Upgrade to increase limit.` };
        }

        return { allowed: true };
    }

    static canDataStream(tier: UserTier): { delay: number } {
        return { delay: TIERS[tier].dataDelaySeconds };
    }

    static incrementTradeCount(userId: string) {
        const usage = this.getUsage(userId);
        usage.liveTradesCount++;
    }
}
