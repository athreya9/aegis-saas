import { ZerodhaPaperAdapter } from '../brokers/zerodha-paper';
import { IReadOnlyBroker } from '../brokers/read-only-interface';

export type RiskProfile = 'CONSERVATIVE' | 'BALANCED' | 'ACTIVE';

export class Sandbox {
    public readonly userId: string;
    private _planType: string = 'SIGNALS';
    private _autoTradingEnabled: boolean = false;
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
    public async enableAutoTrading(executionMode: string = 'SANDBOX'): Promise<boolean> {
        // 1. Pre-Flight Check
        const { ready } = await this.validatePreFlight();
        if (!ready) {
            console.log(`[Sandbox ${this.userId}] Pre-Flight Failed. Cannot enable.`);
            return false;
        }

        // 2. Risk Check
        if (this._dailyStats.lossIncurred >= this._dailyStats.riskCap) {
            console.log(`[Sandbox ${this.userId}] Risk Limit Breach. Cannot enable.`);
            return false;
        }

        // 3. Execution Gate
        if (executionMode === 'LIVE' && (!this.broker.brokerName.includes('Paper') || this.broker.brokerName === 'NONE')) {
            // Real broker requires LIVE mode
            // In Read-Only phase, we allow "Enabling" but logic remains stripped.
            console.log(`[Sandbox ${this.userId}] LIVE EXECUTION ENABLED via ${this.broker.brokerName}`);
        } else {
            console.log(`[Sandbox ${this.userId}] SANDBOX EXECUTION ENABLED.`);
        }

        this._autoTradingEnabled = true;
        return true;
    }

    public disableAutoTrading(): void {
        this._autoTradingEnabled = false;
        console.log(`[Sandbox ${this.userId}] Auto-Trading DISABLED.`);
    }

    public panicStop(): void {
        this.disableAutoTrading();
        console.warn(`[Sandbox ${this.userId}] PANIC STOP TRIGGERED. HALTING ALL.`);
    }

    public setRiskProfile(profile: RiskProfile): void {
        if (this._autoTradingEnabled) {
            throw new Error("Cannot change Risk Profile while Auto-Trading is active.");
        }
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
        const { valid, expiresAt } = await this.broker.checkTokenStatus();
        if (!valid && this._autoTradingEnabled) {
            console.warn(`[Sandbox ${this.userId}] Session Expired during Poll. Disabling Auto-Trading.`);
            this.disableAutoTrading();
        }

        return {
            userId: this.userId,
            planType: this._planType,
            autoTrading: this._autoTradingEnabled,
            riskProfile: this._riskProfile,
            brokerConnected: valid,
            sessionExpiresAt: valid ? expiresAt : null,
            stats: { ...this._dailyStats }
        };
    }
    // Synchronous status for manager
    public getStatusSync() {
        return {
            userId: this.userId,
            autoTrading: this._autoTradingEnabled
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

    public static async forceStop(userId: string) {
        if (this.sandboxes.has(userId)) {
            const sandbox = this.sandboxes.get(userId)!;
            sandbox.panicStop();
        }
    }

    public static async stopAll() {
        console.warn("[SandboxManager] GLOBAL KILL SWITCH TRIGGERED");
        for (const sandbox of this.sandboxes.values()) {
            sandbox.panicStop();
        }
    }

    public static getActiveCount(): number {
        let count = 0;
        for (const sandbox of this.sandboxes.values()) {
            if (sandbox.getStatusSync().autoTrading) count++;
        }
        return count;
    }
}
