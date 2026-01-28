
export enum UserTier {
    FREE = 'FREE',
    BASIC = 'BASIC',
    PRO = 'PRO',
    ELITE = 'ELITE'
}

export interface TierFeatures {
    maxTradesPerDay: number;
    riskQuotaPercent: number; // 0.01 = 1%
    allowedInstruments: string[]; // ['NIFTY', 'BANKNIFTY', 'ALL']
    realTimeData: boolean;
    priorityExecution: boolean;
    paperTradingOnly: boolean;
}

export const TIER_LIMITS: Record<UserTier, TierFeatures> = {
    [UserTier.FREE]: {
        maxTradesPerDay: 0,
        riskQuotaPercent: 0,
        allowedInstruments: [],
        realTimeData: false, // 15m delay enforced by frontend
        priorityExecution: false,
        paperTradingOnly: true
    },
    [UserTier.BASIC]: {
        maxTradesPerDay: 5,
        riskQuotaPercent: 0.005, // 0.5%
        allowedInstruments: ['NIFTY'],
        realTimeData: true,
        priorityExecution: false,
        paperTradingOnly: false
    },
    [UserTier.PRO]: {
        maxTradesPerDay: 20,
        riskQuotaPercent: 0.02, // 2%
        allowedInstruments: ['ALL'],
        realTimeData: true,
        priorityExecution: true,
        paperTradingOnly: false
    },
    [UserTier.ELITE]: {
        maxTradesPerDay: 100, // Effectively Unlimited
        riskQuotaPercent: 0.05, // 5%
        allowedInstruments: ['ALL'],
        realTimeData: true,
        priorityExecution: true,
        paperTradingOnly: false
    }
};
