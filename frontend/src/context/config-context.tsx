"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SystemConfig {
    features: {
        ENABLE_LIVE_TRADING: boolean;
        ENABLE_NEW_DASHBOARD: boolean;
        MAINTENANCE_MODE: boolean;
    };
    plans: {
        SIGNALS: any;
        AUTOMATION: any;
        ENTERPRISE: any;
    };
}

const ConfigContext = createContext<SystemConfig | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<SystemConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('http://91.98.226.5:4100/api/v1/control/config-meta');
                const data = await res.json();
                if (data.status === 'success') {
                    setConfig({ features: data.features, plans: data.plans });
                }
            } catch (e) {
                console.error("Config fetch failed:", e);
                // Fallback safe defaults if backend offline
                setConfig({
                    features: { ENABLE_LIVE_TRADING: false, ENABLE_NEW_DASHBOARD: true, MAINTENANCE_MODE: true },
                    plans: { SIGNALS: {}, AUTOMATION: {}, ENTERPRISE: {} }
                });
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-full bg-black flex items-center justify-center text-white font-mono text-xs uppercase tracking-widest">
                <span className="animate-pulse">Initializing System Config...</span>
            </div>
        );
    }

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useSystemConfig() {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useSystemConfig must be used within a ConfigProvider");
    }
    return context;
}
