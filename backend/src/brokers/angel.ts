import { IReadOnlyBroker, BrokerProfile, BrokerMargins } from './read-only-interface';

export class AngelAdapter implements IReadOnlyBroker {
    readonly brokerName = 'ANGEL_ONE';
    private apiKey?: string;
    private userId?: string;

    async validateCredentials(credentials: { apiKey: string; userId: string }): Promise<boolean> {
        if (!credentials.apiKey || !credentials.userId) return false;
        this.apiKey = credentials.apiKey;
        this.userId = credentials.userId;
        return true;
    }

    async checkTokenStatus(): Promise<{ valid: boolean; expiresAt?: Date }> {
        if (!this.apiKey) return { valid: false };
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 12);
        return { valid: true, expiresAt: expiry };
    }

    async fetchProfile(): Promise<BrokerProfile> {
        return {
            userId: this.userId || 'A1001',
            userName: 'Audit User (Angel)',
            email: 'audit@angel.local',
            broker: 'ANGEL_ONE'
        };
    }

    async fetchMargins(): Promise<BrokerMargins> {
        return {
            enabled: true,
            net: 180000.00,
            available: 175000.00
        };
    }

    async fetchInstruments(): Promise<any[]> {
        return [{ symbol: 'SBIN', name: 'STATE BANK OF INDIA' }];
    }

    async disconnect(): Promise<void> {
        this.apiKey = undefined;
        this.userId = undefined;
    }
}
