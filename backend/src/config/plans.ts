
export const PLANS = {
    FREE: {
        id: 'FREE',
        maxTradesPerDay: 0, // Paper only
        maxRiskPerTrade: 0, // Not applicable for live
        allowedInstruments: [], // None
        paperTrading: true,
        executionMode: 'PAPER_ONLY'
    },
    BASIC: {
        id: 'BASIC',
        maxTradesPerDay: 5,
        maxRiskPerTrade: 0.0025, // 0.25%
        allowedInstruments: ['NIFTY'],
        paperTrading: true, // Can also paper trade
        executionMode: 'LIVE'
    },
    PRO: {
        id: 'PRO',
        maxTradesPerDay: Infinity,
        maxRiskPerTrade: 0.01, // 1.0%
        allowedInstruments: ['ALL'],
        paperTrading: true,
        executionMode: 'LIVE'
    },
    INSTITUTIONAL: {
        id: 'INSTITUTIONAL',
        maxTradesPerDay: Infinity,
        maxRiskPerTrade: 0.05, // 5.0%
        allowedInstruments: ['ALL'],
        paperTrading: true,
        executionMode: 'LIVE'
    }
} as const;

export type PlanType = keyof typeof PLANS;
