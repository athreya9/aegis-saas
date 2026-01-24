"use client"

import { CheckCircle2, TrendingUp, Wallet, Layers } from "lucide-react"

export function HeroMetricsBar() {
    return (
        <div className="flex items-center justify-between border border-[#111] bg-[#050505] rounded-xl px-8 py-5 mb-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 noise-overlay opacity-[0.01]" />

            <div className="flex items-center gap-12 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Wallet size={14} className="text-muted-foreground" />
                        <span className="financial-label">Total Equity</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="financial-value text-white">₹12,40,500</span>
                    </div>
                </div>

                <div className="w-[1px] h-10 bg-[#111]" />

                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span className="financial-label">Daily P&L</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="financial-value text-emerald-500">+₹42,240</span>
                        <span className="text-[11px] font-bold text-emerald-500/60 pb-1">3.4%</span>
                    </div>
                </div>

                <div className="w-[1px] h-10 bg-[#111]" />

                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Layers size={14} className="text-muted-foreground" />
                        <span className="financial-label">Active Positions</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="financial-value text-white">08</span>
                        <span className="text-[11px] font-bold text-muted-foreground pb-1">across 2 brokers</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-full relative z-10">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-[11px] font-black tracking-widest text-emerald-500 uppercase">System Optimal</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
        </div>
    )
}
