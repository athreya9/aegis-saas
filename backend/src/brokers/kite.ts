import { IReadOnlyBroker, BrokerProfile, BrokerMargins } from './read-only-interface';

export class KiteAdapter implements IReadOnlyBroker {
    readonly brokerName = 'ZERODHA';
    private apiKey?: string;
    private accessToken?: string;

    async validateCredentials(credentials: { apiKey: string; accessToken: string }): Promise<boolean> {
        // Enforce 32 char alphanumeric validation
        const regex = /^[a-zA-Z0-9]{32}$/;
        if (!regex.test(credentials.apiKey) || !regex.test(credentials.accessToken)) {
            return false;
        }
        this.apiKey = credentials.apiKey;
        this.accessToken = credentials.accessToken;
        return true;
    }

    async checkTokenStatus(): Promise<{ valid: boolean; expiresAt?: Date }> {
        // Mock validation
        if (!this.accessToken) return { valid: false };
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(6, 0, 0, 0); // Kite tokens expire at 6 AM
        return { valid: true, expiresAt: tomorrow };
    }

    async fetchProfile(): Promise<BrokerProfile> {
        return {
            userId: 'KLW123',
            userName: 'Audit User (Kite)',
            email: 'audit@kite.local',
            broker: 'ZERODHA'
        };
    }

    async fetchMargins(): Promise<BrokerMargins> {
        return {
            enabled: true,
            net: 250000.00,
            available: 245000.00
        };
    }

    async fetchInstruments(): Promise<any[]> {
        return [
            { symbol: 'NIFTY', name: 'NIFTY 50' },
            { symbol: 'BANKNIFTY', name: 'NIFTY BANK' }
        ];
    }

    async disconnect(): Promise<void> {
        this.apiKey = undefined;
        this.accessToken = undefined;
    }
}
