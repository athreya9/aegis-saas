
import fetch from 'node-fetch';
import { redis } from './redis-client';

interface OSState {
    status: any;
    metrics: any;
    positions: any;
    signals: any;
    lastUpdated: number;
    isOnline: boolean;
    // Transparency Metrics (Redis)
    transparency: {
        lastHeartbeat: number | null;
        lastDecision: string | null;
        lastRejection: string | null;
        confidenceScore: number | null;
        riskUsed: number | null;
        coreStatus: 'LIVE' | 'WAIT_FOR_AUTH' | 'HALTED' | 'CORE OFFLINE';
    };
}

export class OSClient {
    private static instance: OSClient;
    private cache: OSState = {
        status: { status: 'UNKNOWN', message: 'Initializing connection to OS...' },
        metrics: {},
        positions: [],
        signals: [],
        lastUpdated: 0,
        isOnline: false,
        transparency: {
            lastHeartbeat: null,
            lastDecision: null,
            lastRejection: null,
            confidenceScore: null,
            riskUsed: null,
            coreStatus: 'CORE OFFLINE'
        }
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
            // 1. Fetch from HTTP API
            const [status, metrics, positions, signals] = await Promise.all([
                this.fetchSafe(`${this.OS_URL}/api/os/status`),
                this.fetchSafe(`${this.OS_URL}/api/os/metrics`),
                this.fetchSafe(`${this.OS_URL}/api/os/positions`),
                this.fetchSafe(`${this.OS_URL}/api/os/signals`)
            ]);

            // 2. Fetch from Redis (Transparency Layer)
            const [heartbeat, decision, rejection, systemState, confidence, risk] = await Promise.all([
                redis.get('aegis:heartbeat'),
                redis.get('last_trade_decision'),
                redis.get('last_rejection_reason'),
                redis.get('aegis:system_state'),
                redis.get('confidence_score'),
                redis.get('risk_used')
            ]);

            const isOnline = !!status;
            const now = Date.now();
            const lastHb = heartbeat ? parseInt(heartbeat) : null;

            // Heartbeat Logic: If older than 5 seconds, CORE OFFLINE
            const isHbStale = lastHb ? (now - lastHb > 5000) : true;

            // Resolve Core Status
            let coreStatus: any = 'CORE OFFLINE';
            if (!isHbStale) {
                coreStatus = systemState || (status?.status === 'ACTIVE' ? 'LIVE' : status?.status) || 'LIVE';
            }

            if (isOnline) {
                this.cache = {
                    status: status || this.cache.status,
                    metrics: metrics || this.cache.metrics,
                    positions: positions || [],
                    signals: signals || [],
                    lastUpdated: now,
                    isOnline: true,
                    transparency: {
                        lastHeartbeat: lastHb,
                        lastDecision: decision,
                        lastRejection: rejection,
                        confidenceScore: confidence ? parseFloat(confidence) : null,
                        riskUsed: risk ? parseFloat(risk) : null,
                        coreStatus: coreStatus as any
                    }
                };
            } else {
                // OS API is Down, but maybe Redis is still pulsing?
                // Per requirements: "If heartbeat stale > 5 seconds -> CORE OFFLINE"
                this.cache.isOnline = false;
                this.cache.status = {
                    status: isHbStale ? 'DOWN' : 'PROXY_ONLY',
                    message: isHbStale ? 'Connection to Aegis OS Core lost.' : 'API Offline, Redis Pulsing.'
                };
                this.cache.transparency = {
                    lastHeartbeat: lastHb,
                    lastDecision: decision,
                    lastRejection: rejection,
                    confidenceScore: confidence ? parseFloat(confidence) : null,
                    riskUsed: risk ? parseFloat(risk) : null,
                    coreStatus: isHbStale ? 'CORE OFFLINE' : coreStatus
                };
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
    public getTransparency() { return this.cache.transparency; }

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
    // --- Command Submission (SaaS -> OS) ---
    public async submitCommand(command: string, payload: any, userId: string, requestId: string): Promise<{ success: boolean; message?: string }> {
        console.log(`[OSClient] Submitting Command: ${command} for ${userId} (ReqID: ${requestId})`);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch(`${this.OS_URL}/api/commands/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-source': 'SAAS_BACKEND',
                    'x-request-id': requestId
                },
                body: JSON.stringify({
                    command: command,
                    data: payload,
                    source: `SAAS:${userId}`,
                    timestamp: Date.now()
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                return { success: true };
            } else {
                const errText = await response.text();
                return { success: false, message: `OS Rejection: ${errText}` };
            }
        } catch (e: any) {
            console.error('[OSClient] Command Submission Failed:', e);
            return { success: false, message: `Connectivity Error: ${e.message}` };
        }
    }
}
