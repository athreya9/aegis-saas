"use client";

import React, { useState, useEffect } from 'react';
import { X, ShieldAlert } from 'lucide-react';

export function RiskDisclaimer() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isDismissed = localStorage.getItem('aegis_risk_disclaimer_dismissed');
        if (!isDismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('aegis_risk_disclaimer_dismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg px-4 py-2.5 flex items-center justify-between group transition-all duration-300">
            <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-500/60" />
                <p className="text-[11px] font-medium text-amber-500/80 leading-tight tracking-wide">
                    <span className="font-black uppercase mr-2 tracking-widest opacity-60">Risk Disclosure:</span>
                    Market analysis and technical signals are provided for informational purposes only. Trading involves significant risk of capital loss. Verify all technical entries independently before execution.
                </p>
            </div>
            <button
                onClick={handleDismiss}
                className="p-1 hover:bg-amber-500/10 rounded-md text-amber-500/40 hover:text-amber-500 transition-colors"
                aria-label="Dismiss disclaimer"
            >
                <X size={14} />
            </button>
        </div>
    );
}
