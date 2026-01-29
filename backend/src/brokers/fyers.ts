import fetch from 'node-fetch';
import { IReadOnlyBroker, BrokerProfile, BrokerMargins } from './read-only-interface';

export class FyersAdapter implements IReadOnlyBroker {
    readonly brokerName = 'FYERS';
    private appId?: string;
    private accessToken?: string;

    async validateCredentials(credentials: { appId: string; accessToken: string }): Promise<boolean> {
        if (!credentials.appId || !credentials.accessToken) return false;

        try {
            const response = await fetch('https://api-t1.fyers.in/api/v3/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `${credentials.appId}:${credentials.accessToken}`
                }
            });
            const data: any = await response.json();

            if (data.s === 'ok') {
                this.appId = credentials.appId;
                this.accessToken = credentials.accessToken;
                return true;
            } else {
                console.error("Fyers Validation Failed:", data.message);
                return false;
            }
        } catch (e) {
            console.error("Fyers API Error:", e);
            return false;
        }
    }

    async checkTokenStatus(): Promise<{ valid: boolean; expiresAt?: Date }> {
        if (!this.accessToken) return { valid: false };
        // Assume valid if we have it, real implementation might re-verify
        return { valid: true };
    }

    async fetchProfile(): Promise<BrokerProfile> {
        if (!this.accessToken) throw new Error("Not Connected");

        try {
            const response = await fetch('https://api-t1.fyers.in/api/v3/profile', {
                method: 'GET',
                headers: { 'Authorization': `${this.appId}:${this.accessToken}` }
            });
            const data: any = await response.json();
            if (data.s === 'ok' && data.data) {
                return {
                    userId: data.data.fy_id,
                    userName: data.data.name,
                    email: data.data.email_id,
                    broker: 'FYERS'
                };
            }
        } catch (e) { console.error("Fyers Profile Error", e); }

        return {
            userId: this.appId || 'Unknown',
            userName: 'Fyers User',
            email: '',
            broker: 'FYERS'
        };
    }

    async fetchMargins(): Promise<BrokerMargins> {
        if (!this.accessToken) throw new Error("Not Connected");

        try {
            const response = await fetch('https://api-t1.fyers.in/api/v3/funds', {
                method: 'GET',
                headers: { 'Authorization': `${this.appId}:${this.accessToken}` }
            });
            const data: any = await response.json();
            if (data.s === 'ok' && data.fund_limit) {
                // Fyers returns array, we sum or take equity
                const total = data.fund_limit.find((f: any) => f.title === 'Total Balance') || { equityAmount: 0 };
                const available = data.fund_limit.find((f: any) => f.title === 'Available Balance') || { equityAmount: 0 };

                return {
                    enabled: true,
                    net: total.equityAmount || 0,
                    available: available.equityAmount || 0
                };
            }
        } catch (e) { console.error("Fyers Funds Error", e); }

        return { enabled: true, net: 0, available: 0 };
    }

    async fetchInstruments(): Promise<any[]> {
        return [{ symbol: 'RELIANCE', name: 'Reliance Industries' }];
    }

    async disconnect(): Promise<void> {
        this.appId = undefined;
        this.accessToken = undefined;
    }
}
