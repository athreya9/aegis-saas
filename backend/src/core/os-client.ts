
import fetch from 'node-fetch';

interface OSState {
    status: any;
    metrics: any;
    positions: any;
    signals: any;
    lastUpdated: number;
    isOnline: boolean;
}

export class OSClient {
    private static instance: OSClient;
    private cache: OSState = {
        status: { status: 'UNKNOWN', message: 'Initializing connection to OS...' },
        metrics: {},
        positions: [],
        signals: [],
        lastUpdated: 0,
        isOnline: false
    };

    private readonly OS_URL = 'http://127.0.0.1:8080';
    private readonly POLL_INTERVAL = 2000; // 2 seconds

    private constructor() {
        this.startPolling();
    }

    public static getInstance(): OSClient {
        if (!OSClient.instance) {
            OSClient.instance = new OSClient();
        }
        return OSClient.instance;
    }

    private startPolling() {
        console.log('[OSClient] Starting Polling Service to Aegis OS (Port 8080)...');
        setInterval(() => this.poll(), this.POLL_INTERVAL);
    }

    private async poll() {
        try {
            // Parallel fetch for efficiency
            const [status, metrics, positions, signals] = await Promise.all([
                this.fetchSafe(`${this.OS_URL}/api/os/status`),
                this.fetchSafe(`${this.OS_URL}/api/os/metrics`),
                this.fetchSafe(`${this.OS_URL}/api/os/positions`),
                this.fetchSafe(`${this.OS_URL}/api/os/signals`)
            ]);

            const isOnline = !!status;

            if (isOnline) {
                this.cache = {
                    status: status || this.cache.status, // Keep last known if transient fail? actually fetchSafe returns null on fail
                    metrics: metrics || this.cache.metrics,
                    positions: positions || [],
                    signals: signals || [],
                    lastUpdated: Date.now(),
                    isOnline: true
                };
            } else {
                // OS is Down
                this.cache.isOnline = false;
                this.cache.status = { status: 'DOWN', message: 'Connection to Aegis OS Core lost.' };
                // We keep stale metrics/positions but mark offline? Or clear them?
                // Keeping stale might be safer for "Last Known State" visual
            }

        } catch (e) {
            console.error('[OSClient] Polling loop error:', e);
            this.cache.isOnline = false;
        }
    }

    private async fetchSafe(url: string) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!res.ok) return null;
            return await res.json();
        } catch (e) {
            return null;
        }
    }

    public getStatus() { return this.cache.status; }
    public getMetrics() { return this.cache.metrics; }
    public getPositions() { return this.cache.positions; }
    public getSignals() { return this.cache.signals; }
    public isOnline() { return this.cache.isOnline; }
    public getLastUpdated() { return this.cache.lastUpdated; }

    public async triggerPanic(userId: string, reason: string): Promise<{ success: boolean; message?: string }> {
        console.warn(`[OSClient] EMERGENCY PANIC TRIGGERED by ${userId}. Reason: ${reason}`);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout for critical action

            const response = await fetch(`${this.OS_URL}/api/os/panic`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    initiated_by: userId,
                    reason: reason,
                    source: 'SAAS_ADMIN_KILL_SWITCH'
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                // Force update cache
                this.cache.status = { status: 'EMERGENCY_STOP', message: 'System halted by SaaS Admin' };
                return { success: true };
            } else {
                const errText = await response.text();
                return { success: false, message: `OS Error: ${errText}` };
            }
        } catch (e: any) {
            console.error('[OSClient] Failed to trigger panic:', e);
            // Fallback: If network fail, we still claim success to SaaS Admin so they don't panic more? 
            // No, report truth.
            return { success: false, message: `Network Error: ${e.message}` };
        }
    }

    // --- Telegram Control Proxy ---
    public async getTelegramStatus(): Promise<any> {
        return await this.fetchSafe(`${this.OS_URL}/api/telegram/control/status`) || { status: 'UNKNOWN', enabled: false };
    }

    public async toggleTelegram(enabled: boolean, userId: string, reason: string): Promise<{ success: boolean; message?: string }> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const response = await fetch(`${this.OS_URL}/api/telegram/control`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: enabled ? 'ENABLE' : 'DISABLE',
                    authorized_by: userId,
                    reason: reason
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) return { success: true };
            return { success: false, message: await response.text() };
        } catch (e: any) {
            return { success: false, message: `Connectivity Error: ${e.message}` };
        }
    }

    public async getTelegramChannels(): Promise<any> {
        return await this.fetchSafe(`${this.OS_URL}/api/telegram/channels`) || { channels: [] };
    }
}
