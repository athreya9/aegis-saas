
import { useState, useEffect } from 'react';

// Types based on verified API response
interface OSMetrics {
    pnl: number;
    drawdown: number;
    trades_today: number;
    risk_state: string;
    margin_available: number;
    margin_utilized: number;
    source?: string;
}

interface OSStatus {
    online: boolean;
    last_updated: number;
    transparency?: {
        lastHeartbeat: number | null;
        lastDecision: string | null;
        lastRejection: string | null;
        confidenceScore: number | null;
        riskUsed: number | null;
        coreStatus: 'LIVE' | 'WAIT_FOR_AUTH' | 'HALTED' | 'CORE OFFLINE';
    };
    data: {
        engine_state: 'RUNNING' | 'STOPPED' | 'ERROR';
        market_status: 'OPEN' | 'CLOSED';
        armed: boolean;
        status?: string; // Legacy support
    };
}

export function useOSData() {
    const [metrics, setMetrics] = useState<OSMetrics | null>(null);
    const [status, setStatus] = useState<OSStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // Parallel fetch
            const [metricsRes, statusRes] = await Promise.all([
                fetch('http://91.98.226.5:4100/api/v1/os/metrics'),
                fetch('http://91.98.226.5:4100/api/v1/os/status')
            ]);

            if (metricsRes.ok) setMetrics(await metricsRes.json());
            if (statusRes.ok) setStatus(await statusRes.json());

        } catch (e) {
            console.error("OS Data Fetch Error", e);
            // Don't clear data immediately on temporary fail to avoid flicker
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000); // Poll every 2s
        return () => clearInterval(interval);
    }, []);

    return { metrics, status, loading };
}
