export interface PlanConfig {
    maxDailyRisk: number;
    maxTradesPerDay: number;
    allowAutoTrading: boolean;
    features: string[];
}

export const PLANS: Record<string, PlanConfig> = {
    'SIGNALS': {
        maxDailyRisk: 0,
        maxTradesPerDay: 0,
        allowAutoTrading: false,
        features: ['DASHBOARD', 'SIGNALS_VIEW', 'MANUAL_ALERTS']
    },
    'AUTOMATION': {
        maxDailyRisk: 5000, // ₹5k
        maxTradesPerDay: 20,
        allowAutoTrading: true,
        features: ['DASHBOARD', 'SIGNALS_VIEW', 'AUTO_TRADING', 'RISK_CONTROLS']
    },
    'ENTERPRISE': {
        maxDailyRisk: 50000, // ₹50k
        maxTradesPerDay: 100,
        allowAutoTrading: true,
        features: ['DASHBOARD', 'SIGNALS_VIEW', 'AUTO_TRADING', 'RISK_CONTROLS', 'PRIORITY_EXECUTION']
    }
};

export const FEATURE_FLAGS = {
    ENABLE_LIVE_TRADING: false, // Global Kill Switch for Live
    ENABLE_NEW_DASHBOARD: true,
    MAINTENANCE_MODE: false
};

export class SystemConfig {
    public static getPlanConfig(planType: string): PlanConfig {
        const plan = planType.toUpperCase();
        return PLANS[plan] || PLANS['SIGNALS'];
    }

    public static getFeatureFlags() {
        return FEATURE_FLAGS;
    }

    public static validateRiskLimit(planType: string, riskAmount: number): boolean {
        const config = this.getPlanConfig(planType);
        return riskAmount <= config.maxDailyRisk;
    }
}
