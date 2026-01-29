import fetch from 'node-fetch';
import { IReadOnlyBroker, BrokerProfile, BrokerMargins } from './read-only-interface';

export class AngelAdapter implements IReadOnlyBroker {
    readonly brokerName = 'ANGEL_ONE';
    private apiKey?: string;
    private userId?: string;
    private jwtToken?: string;
    private feedToken?: string;

    async validateCredentials(credentials: { apiKey: string; userId: string; password?: string; totp?: string }): Promise<boolean> {
        if (!credentials.apiKey || !credentials.userId || !credentials.password || !credentials.totp) return false;

        try {
            const response = await fetch('https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-PrivateKey': credentials.apiKey,
                    'X-User-System-IP': '127.0.0.1',
                    'X-Local-IP': '127.0.0.1',
                    'X-MacAddress': 'macaddr',
                    'Accept': 'application/json',
                    'X-SourceID': 'WEB',
                    'X-ClientLocalIP': '127.0.0.1',
                    'X-ClientPublicIP': '127.0.0.1'
                },
                body: JSON.stringify({
                    clientcode: credentials.userId,
                    password: credentials.password,
                    totp: credentials.totp
                })
            });

            const data: any = await response.json();

            if (data.status === true && data.data && data.data.jwtToken) {
                this.apiKey = credentials.apiKey;
                this.userId = credentials.userId;
                this.jwtToken = data.data.jwtToken;
                this.feedToken = data.data.feedToken;
                return true;
            } else {
                console.error("Angel Login Failed:", data.message || data.errorCode);
                return false;
            }
        } catch (e) {
            console.error("Angel Login Error:", e);
            return false;
        }
    }

    async checkTokenStatus(): Promise<{ valid: boolean; expiresAt?: Date }> {
        // Simple check: if we have a token, assume valid for session (usually 24h)
        if (!this.jwtToken) return { valid: false };
        // Ideally verify /profile call here
        return { valid: true };
    }

    async fetchProfile(): Promise<BrokerProfile> {
        if (!this.jwtToken) throw new Error("Not Connected");

        try {
            const response = await fetch('https://apiconnect.angelbroking.com/rest/secure/angelbroking/user/v1/getProfile', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtToken,
                    'X-PrivateKey': this.apiKey!,
                    'Accept': 'application/json',
                    'X-User-System-IP': '127.0.0.1'
                }
            });
            const data: any = await response.json();
            if (data.status && data.data) {
                return {
                    userId: data.data.clientcode,
                    userName: data.data.name,
                    email: data.data.email,
                    broker: 'ANGEL_ONE'
                };
            }
        } catch (e) { console.error("Angel Profile Error", e); }

        return {
            userId: this.userId || 'Unknown',
            userName: 'Angel User',
            email: '',
            broker: 'ANGEL_ONE'
        };
    }

    async fetchMargins(): Promise<BrokerMargins> {
        if (!this.jwtToken) throw new Error("Not Connected");

        try {
            const response = await fetch('https://apiconnect.angelbroking.com/rest/secure/angelbroking/user/v1/getRMS', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtToken,
                    'X-PrivateKey': this.apiKey!,
                    'Accept': 'application/json',
                    'X-User-System-IP': '127.0.0.1'
                }
            });
            const data: any = await response.json();
            if (data.status && data.data) {
                const net = parseFloat(data.data.net) || 0;
                const available = parseFloat(data.data.availablecash) || 0;
                return {
                    enabled: true,
                    net: net,
                    available: available
                };
            }
        } catch (e) { console.error("Angel RMS Error", e); }

        return { enabled: true, net: 0, available: 0 };
    }

    async fetchInstruments(): Promise<any[]> {
        return [{ symbol: 'SBIN', name: 'State Bank of India' }]; // Mock as Angel instrument dump is huge
    }

    async disconnect(): Promise<void> {
        this.apiKey = undefined;
        this.userId = undefined;
        this.jwtToken = undefined;
    }
}
