import { ZerodhaPaperAdapter } from '../brokers/zerodha-paper';
import { IReadOnlyBroker } from '../brokers/read-only-interface';

export type RiskProfile = 'CONSERVATIVE' | 'BALANCED' | 'ACTIVE';

export class Sandbox {
    public readonly userId: string;
    private _planType: string = 'SIGNALS';
    private _riskProfile: RiskProfile = 'CONSERVATIVE';
    private _dailyStats = {
        tradesExecuted: 0,
        lossIncurred: 0,
        riskCap: 2000
    };

    // Current Active Broker (Read-Only)
    private broker: IReadOnlyBroker;

    constructor(userId: string) {
        this.userId = userId;
        // Default to Paper Adapter
        this.broker = new ZerodhaPaperAdapter(userId) as any;
    }

    public setBrokerAdapter(adapter: IReadOnlyBroker) {
        this.broker = adapter;
    }

    public getBrokerAdapter(): IReadOnlyBroker {
        return this.broker;
    }

    public setPlanType(plan: string) {
        const upperPlan = plan.toUpperCase();
        const validPlans = ['SIGNALS', 'AUTOMATION', 'MANAGED'];
        if (!validPlans.includes(upperPlan)) {
            console.error(`[Sandbox ${this.userId}] Attempted set invalid plan: ${plan}. Defaulting to SIGNALS.`);
            this._planType = 'SIGNALS';
            return;
        }
        this._planType = upperPlan;
        console.log(`[Sandbox ${this.userId}] Plan set to ${upperPlan}`);
    }

    // Check Session (Read-Only)
    public async validateBrokerSession(): Promise<boolean> {
        const { valid } = await this.broker.checkTokenStatus();
        return valid;
    }

    // Pre-Flight Checklist
    public async validatePreFlight(): Promise<{ ready: boolean; checks: any[]; marketStatus: string }> {
        const brokerValid = await this.validateBrokerSession();

        // Time checks (IST) for Pre-Market Isolation
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(now.getTime() + istOffset);
        const hours = istTime.getUTCHours();
        const minutes = istTime.getUTCMinutes();

        // 09:00 - 09:15 is Pre-Market
        const isPreMarket = hours === 9 && minutes >= 0 && minutes < 15;
        const isMarketOpen = (hours === 9 && minutes >= 15) || (hours > 9 && hours < 15) || (hours === 15 && minutes <= 30);

        // Pre-Market Policy Isolation: 
        // SaaS treats Pre-Market as "Informational" (passed: true), whereas Core blocks it.
        // We add a 'warning' field to communicate this to the UI.

        const checks = [
            { id: 'BROKER_CONNECT', label: 'Broker Connected', passed: this.broker.brokerName !== 'Zerodha (Paper)' || this._planType === 'SIGNALS' },
            { id: 'SESSION_VALID', label: 'Session Valid', passed: brokerValid },
            { id: 'RISK_PROFILE', label: 'Risk Profile Set', passed: this._riskProfile !== undefined },
            { id: 'DAILY_LIMIT', label: 'Daily Loss Limit', passed: this._dailyStats.riskCap > 0 },
            {
                id: 'MARKET_STATUS',
                label: 'Market Status',
                passed: true, // ALWAYS TRUE FOR SAAS (Isolation)
                warning: isPreMarket ? 'Pre-Market Session (Caution)' : (!isMarketOpen ? 'Market Closed' : undefined)
            }
        ];

        return {
            ready: checks.every(c => c.passed),
            checks,
            marketStatus: isPreMarket ? 'PRE_MARKET' : (isMarketOpen ? 'OPEN' : 'CLOSED')
        };
    }

    // State Management
    public async validateExecutionRequest(strategy: string, params: any): Promise<{ valid: boolean; reason?: string }> {
        // 1. Pre-Flight Check
        const { ready, marketStatus } = await this.validatePreFlight();
        if (!ready) {
            return { valid: false, reason: "Pre-Flight Checks Failed. Please resolve alerts." };
        }

        // 2. Market Status Warning (Advisory Only)
        if (marketStatus !== 'OPEN') {
            console.log(`[Sandbox ${this.userId}] Requesting execution during ${marketStatus} (Advisory Accepted)`);
        }

        // 3. Risk Check
        if (this._dailyStats.lossIncurred >= this._dailyStats.riskCap) {
            return { valid: false, reason: `Daily Risk Limit Reached (₹${this._dailyStats.lossIncurred} / ₹${this._dailyStats.riskCap})` };
        }

        return { valid: true };
    }

    public setRiskProfile(profile: RiskProfile): void {
        this._riskProfile = profile;
        // Update Caps based on Sandbox Logic
        switch (profile) {
            case 'CONSERVATIVE': this._dailyStats.riskCap = 2000; break;
            case 'BALANCED': this._dailyStats.riskCap = 5000; break;
            case 'ACTIVE': this._dailyStats.riskCap = 15000; break;
        }
        console.log(`[Sandbox ${this.userId}] Risk Profile set to ${profile}. Cap: ₹${this._dailyStats.riskCap}`);
    }

    // Getters
    public async getStatus() {
        // Just return session validity and profile
        const { valid, expiresAt } = await this.broker.checkTokenStatus();

        return {
            userId: this.userId,
            planType: this._planType,
            riskProfile: this._riskProfile,
            brokerConnected: valid,
            sessionExpiresAt: valid ? expiresAt : null,
            stats: { ...this._dailyStats }
        };
    }
    // Synchronous status for manager
    public getStatusSync() {
        return {
            userId: this.userId
        };
    }
}

export class SandboxManager {
    private static sandboxes: Map<string, Sandbox> = new Map();

    public static get(userId: string): Sandbox {
        if (!this.sandboxes.has(userId)) {
            this.sandboxes.set(userId, new Sandbox(userId));
        }
        return this.sandboxes.get(userId)!;
    }
}
