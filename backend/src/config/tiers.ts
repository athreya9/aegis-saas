export enum UserTier {
    FREE = 'FREE',
    BASIC = 'BASIC',
    PRO = 'PRO',
    ELITE = 'ELITE'
}

export interface TierLimits {
    maxLiveTradesPerDay: number;
    maxRiskPerTrade: number; // Percentage (0.01 = 1%)
    allowedInstruments: string[]; // 'NIFTY', 'BANKNIFTY', 'ALL'
    dataDelaySeconds: number; // 0 for live
    paperTrading: boolean;
    strategiesAllowed: string[]; // 'BASIC', 'ADVANCED', 'ALL'
}

export const TIERS: Record<UserTier, TierLimits> = {
    [UserTier.FREE]: {
        maxLiveTradesPerDay: 0,
        maxRiskPerTrade: 0,
        allowedInstruments: [],
        dataDelaySeconds: 900, // 15 mins
        paperTrading: true,
        strategiesAllowed: []
    },
    [UserTier.BASIC]: {
        maxLiveTradesPerDay: 1,
        maxRiskPerTrade: 0.005, // 0.5%
        allowedInstruments: ['NIFTY'],
        dataDelaySeconds: 0,
        paperTrading: true,
        strategiesAllowed: ['BASIC']
    },
    [UserTier.PRO]: {
        maxLiveTradesPerDay: 10,
        maxRiskPerTrade: 0.01, // 1%
        allowedInstruments: ['ALL'],
        dataDelaySeconds: 0,
        paperTrading: true,
        strategiesAllowed: ['ALL']
    },
    [UserTier.ELITE]: {
        maxLiveTradesPerDay: 50,
        maxRiskPerTrade: 0.02, // 2%
        allowedInstruments: ['ALL'],
        dataDelaySeconds: 0,
        paperTrading: true,
        strategiesAllowed: ['ALL']
    }
};
