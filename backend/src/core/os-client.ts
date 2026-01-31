
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


    // --- READ-ONLY REMINDER ---
    // SaaS is a Mirror. Control methods (panic, toggle, submit) were removed
    // to adhere to the strict Transparency Layer mandate.
}
