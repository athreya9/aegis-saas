import { ZerodhaPaperAdapter } from '../brokers/zerodha-paper';
import { BrokerAdapter } from '../brokers/interface';

export type RiskProfile = 'CONSERVATIVE' | 'BALANCED' | 'ACTIVE';

export class Sandbox {
    public readonly userId: string;
    private _planType: string = 'CORE'; // Tracked in state
    private _autoTradingEnabled: boolean = false;
    private _riskProfile: RiskProfile = 'CONSERVATIVE'; // Default
    private _dailyStats = {
        tradesExecuted: 0,
        lossIncurred: 0,
        riskCap: 2000 // Default Conservative Cap
    };

    // Broker Adapter (Paper Mode)
    private broker: ZerodhaPaperAdapter;

    constructor(userId: string) {
        this.userId = userId;
        this.broker = new ZerodhaPaperAdapter(userId);
    }

    public setPlanType(plan: string) {
        this._planType = plan;
    }

    // Broker Connection
    public async connectBroker(authData: any): Promise<boolean> {
        return await this.broker.connect(authData);
    }

    // State Management
    public async enableAutoTrading(): Promise<boolean> {
        // 1. Risk Check
        if (this._dailyStats.lossIncurred >= this._dailyStats.riskCap) {
            console.log(`[Sandbox ${this.userId}] Risk Limit Breach. Cannot enable.`);
            return false;
        }

        // 2. Broker Session Check
        const isSessionValid = await this.broker.validateSession();
        if (!isSessionValid) {
            console.log(`[Sandbox ${this.userId}] Broker Session Invalid. Cannot enable.`);
            return false;
        }

        this._autoTradingEnabled = true;
        console.log(`[Sandbox ${this.userId}] Auto-Trading ENABLED.`);
        return true;
    }

    public disableAutoTrading(): void {
        this._autoTradingEnabled = false;
        console.log(`[Sandbox ${this.userId}] Auto-Trading DISABLED.`);
    }

    // For testing Kill Switch
    public triggerKillSwitch() {
        this.broker.forceExpireSession();
        this.disableAutoTrading();
        console.warn(`[Sandbox ${this.userId}] KILL SWITCH TRIGGERED.`);
    }

    public setRiskProfile(profile: RiskProfile): void {
        if (this._autoTradingEnabled) {
            throw new Error("Cannot change Risk Profile while Auto-Trading is active.");
        }
        this._riskProfile = profile;
        // Update Caps based on Blueprint
        switch (profile) {
            case 'CONSERVATIVE': this._dailyStats.riskCap = 2000; break;
            case 'BALANCED': this._dailyStats.riskCap = 5000; break;
            case 'ACTIVE': this._dailyStats.riskCap = 15000; break;
        }
        console.log(`[Sandbox ${this.userId}] Risk Profile set to ${profile}. Cap: ₹${this._dailyStats.riskCap}`);
    }

    // Getters
    public async getStatus() {
        // Auto-Check Session Health on Status Poll
        const isSessionValid = await this.broker.validateSession();
        if (!isSessionValid && this._autoTradingEnabled) {
            console.warn(`[Sandbox ${this.userId}] Session Expired during Poll. Disabling Auto-Trading.`);
            this.disableAutoTrading();
        }

        return {
            userId: this.userId,
            planType: this._planType,
            autoTrading: this._autoTradingEnabled,
            riskProfile: this._riskProfile,
            brokerConnected: isSessionValid,
            sessionExpiresAt: isSessionValid ? this.broker.getSessionExpiry() : null,
            stats: { ...this._dailyStats }
        };
    }
}
