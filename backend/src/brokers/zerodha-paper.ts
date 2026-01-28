import { IReadOnlyBroker, BrokerProfile, BrokerMargins } from './read-only-interface';

export class ZerodhaPaperAdapter implements IReadOnlyBroker {
    public brokerName = "Zerodha (Paper)";
    private connected: boolean = true; // Auto-connect for SaaS preview
    private sessionExpiry: number = Date.now() + (24 * 60 * 60 * 1000); // 24H
    private readonly userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    async validateCredentials(credentials: any): Promise<boolean> {
        return true; // Mock success
    }

    async checkTokenStatus(): Promise<{ valid: boolean; expiresAt?: Date }> {
        const valid = this.connected && Date.now() < this.sessionExpiry;
        return {
            valid,
            expiresAt: valid ? new Date(this.sessionExpiry) : undefined
        };
    }

    async fetchProfile(): Promise<BrokerProfile> {
        return {
            userId: this.userId,
            userName: "Institutional Trader",
            email: "trader@aegis.system",
            broker: "ZERODHA"
        };
    }

    async fetchMargins(): Promise<BrokerMargins> {
        return {
            enabled: true,
            net: 1000000,
            available: 850000
        };
    }

    async fetchInstruments(): Promise<any[]> {
        return [];
    }

    async disconnect(): Promise<void> {
        this.connected = false;
        console.log(`[Zerodha Paper:${this.userId}] Disconnected.`);
    }
}
