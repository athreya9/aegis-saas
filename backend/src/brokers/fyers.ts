import { IReadOnlyBroker, BrokerProfile, BrokerMargins } from './read-only-interface';

export class FyersAdapter implements IReadOnlyBroker {
    readonly brokerName = 'FYERS';
    private appId?: string;
    private accessToken?: string;

    async validateCredentials(credentials: { appId: string; accessToken: string }): Promise<boolean> {
        if (!credentials.appId || !credentials.accessToken) return false;
        this.appId = credentials.appId;
        this.accessToken = credentials.accessToken;
        return true;
    }

    async checkTokenStatus(): Promise<{ valid: boolean; expiresAt?: Date }> {
        if (!this.accessToken) return { valid: false };
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 1);
        return { valid: true, expiresAt: expiry };
    }

    async fetchProfile(): Promise<BrokerProfile> {
        return {
            userId: 'FY789',
            userName: 'Audit User (Fyers)',
            email: 'audit@fyers.local',
            broker: 'FYERS'
        };
    }

    async fetchMargins(): Promise<BrokerMargins> {
        return {
            enabled: true,
            net: 320000.00,
            available: 310000.00
        };
    }

    async fetchInstruments(): Promise<any[]> {
        return [{ symbol: 'RELANCE', name: 'RELIANCE INDUSTRIES' }];
    }

    async disconnect(): Promise<void> {
        this.appId = undefined;
        this.accessToken = undefined;
    }
}
