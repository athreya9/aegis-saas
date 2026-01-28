"use client"

import { CheckCircle2, TrendingUp, Wallet, Layers, AlertCircle } from "lucide-react"
import { useOSData } from "@/hooks/use-os-data"

export function HeroMetricsBar() {
    const { metrics, status, loading } = useOSData();

    // Format currency
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="flex items-center justify-between border border-[#111] bg-[#050505] rounded-xl px-8 py-5 mb-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 noise-overlay opacity-[0.01]" />

            <div className="flex items-center gap-12 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Wallet size={14} className="text-muted-foreground" />
                        <span className="financial-label">Funds Available</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="financial-value text-white">
                            {loading ? "..." : formatCurrency(metrics?.margin_available || 0)}
                        </span>
                    </div>
                </div>

                <div className="w-[1px] h-10 bg-[#111]" />

                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={14} className={metrics?.pnl && metrics.pnl >= 0 ? "text-emerald-500" : "text-red-500"} />
                        <span className="financial-label">Daily P&L</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className={`financial-value tracking-tight ${metrics?.pnl && metrics.pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {loading ? "..." : (metrics?.pnl && metrics.pnl > 0 ? "+" : "") + formatCurrency(metrics?.pnl || 0)}
                        </span>
                        {/* Remove fake percentage for now unless calculated */}
                    </div>
                </div>

                <div className="w-[1px] h-10 bg-[#111]" />

                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Layers size={14} className="text-muted-foreground" />
                        <span className="financial-label">Trades Today</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="financial-value text-white tracking-tight">
                            {loading ? "..." : (metrics?.trades_today || 0).toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </div>

            <div className={`flex items-center gap-3 px-4 py-2 rounded-full relative z-10 border ${status?.online ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'
                }`}>
                {status?.online ? (
                    <>
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span className="text-[12px] font-black tracking-widest text-emerald-500 uppercase">System Optimal</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </>
                ) : (
                    <>
                        <AlertCircle size={14} className="text-red-500" />
                        <span className="text-[12px] font-black tracking-widest text-red-500 uppercase">System Halted</span>
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                    </>
                )}
            </div>
        </div>
    )
}
