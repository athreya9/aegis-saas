import { BrokerAdapter, OrderParams, Position } from './interface';
import { v4 as uuidv4 } from 'uuid'; // Standard UUID for mock order IDs

export class ZerodhaPaperAdapter implements BrokerAdapter {
    private connected: boolean = false;
    private sessionExpiry: number = 0;
    private readonly userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    async connect(authData: { apiKey: string, accessToken: string }): Promise<boolean> {
        console.log(`[Zerodha Paper:${this.userId}] Initiating Connection...`);

        // 1. Strict Input Validation (Per Blueprint Phase 4)
        const credentialRegex = /^[a-zA-Z0-9]{32}$/;
        if (!credentialRegex.test(authData.apiKey)) {
            console.error(`[Zerodha Paper:${this.userId}] Auth Failed: Invalid API Key Format (Must be 32 alphanumeric chars)`);
            return false;
        }
        if (!credentialRegex.test(authData.accessToken)) {
            console.error(`[Zerodha Paper:${this.userId}] Auth Failed: Invalid Access Token Format (Must be 32 alphanumeric chars)`);
            return false;
        }

        // 2. Simulate Network Latency (Realistic "Verify Token" & "Fetch Profile")
        console.log(`[Zerodha Paper:${this.userId}] Verifying Authorization Grants...`);
        await new Promise(resolve => setTimeout(resolve, 800)); // 800ms Verify Token

        console.log(`[Zerodha Paper:${this.userId}] Fetching Risk Profile & Margins...`);
        await new Promise(resolve => setTimeout(resolve, 1200)); // 1.2s Profile Fetch

        // 3. Random Failure Simulation (5% Chance of timeout/invalid)
        if (Math.random() > 0.95) {
            console.error(`[Zerodha Paper:${this.userId}] Connection Timeout: Upstream Broker Non-Responsive`);
            return false;
        }

        this.connected = true;
        // Mock Session Valid for 1 Hour
        this.sessionExpiry = Date.now() + (60 * 60 * 1000);
        console.log(`[Zerodha Paper:${this.userId}] Connected Securely. Session Valid until ${new Date(this.sessionExpiry).toLocaleTimeString()}`);
        return true;
    }

    async validateSession(): Promise<boolean> {
        if (!this.connected) return false;
        if (Date.now() > this.sessionExpiry) {
            console.warn(`[Zerodha Paper:${this.userId}] Session EXPIRED.`);
            this.connected = false;
            return false;
        }
        return true;
    }

    public getSessionExpiry(): number {
        return this.sessionExpiry;
    }

    // Force Expire for Testing Kill Switch
    public forceExpireSession() {
        console.warn(`[Zerodha Paper:${this.userId}] ⚠️ FORCE EXPIRING SESSION (KILL SWITCH TEST)`);
        this.sessionExpiry = Date.now() - 1000;
    }

    async placeOrder(params: OrderParams): Promise<string> {
        if (!(await this.validateSession())) {
            throw new Error("Session Invalid or Expired");
        }

        const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;
        console.log(`\n--- [PAPER ORDER] ---`);
        console.log(`User: ${this.userId}`);
        console.log(`ID: ${orderId}`);
        console.log(`Symbol: ${params.symbol}`);
        console.log(`Side: ${params.transaction_type} | Qty: ${params.quantity}`);
        console.log(`Type: ${params.order_type} @ ${params.price || 'MKT'}`);
        console.log(`---------------------\n`);

        return orderId;
    }

    async getPositions(): Promise<Position[]> {
        if (!(await this.validateSession())) return [];
        return [
            // Mock Position
            {
                tradingsymbol: "NIFTY 25JAN 21500 CE",
                quantity: 50,
                average_price: 140.50,
                last_price: 155.00,
                pnl: 725.00,
                product: "MIS"
            }
        ];
    }

    async disconnect(): Promise<void> {
        this.connected = false;
        console.log(`[Zerodha Paper:${this.userId}] Disconnected.`);
    }
}
