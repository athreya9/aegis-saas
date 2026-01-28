"use client"

import { Cpu, Zap, ShieldCheck, Database, Server } from "lucide-react"
import { useOSData } from "@/hooks/use-os-data"

export function SystemHealthCard() {
    const { status } = useOSData();

    const isOnline = status?.online;
    const engineState = status?.data?.engine_state || 'UNKNOWN';
    const marketStatus = status?.data?.market_status || 'CLOSED';

    // Map real state to UI cards
    const stats = [
        {
            label: "Execution Engine",
            value: isOnline ? engineState : "OFFLINE",
            status: engineState === 'RUNNING' ? "optimal" : "warning",
            icon: Zap
        },
        {
            label: "Market Status",
            value: marketStatus,
            status: marketStatus === 'OPEN' ? "optimal" : "neutral",
            icon: ShieldCheck
        },
        {
            label: "SaaS Proxy",
            value: "CONNECTED",
            status: "secure",
            icon: Database
        },
        {
            label: "VPS Connection",
            value: isOnline ? "Active (91.98.226.5)" : "Disconnected",
            status: isOnline ? "healthy" : "critical",
            icon: Server
        },
    ]

    return (
        <div className="vercel-card p-6 flex flex-col h-full bg-[#050505]">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-white tracking-tight">System Health</h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                        {isOnline ? 'LIVE KERNEL' : 'SEARCHING...'}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
                {stats.map((stat, i) => (
                    <div key={i} className="p-4 rounded-lg bg-[#0a0a0a] border border-[#111] hover:border-[#222] transition-colors group">
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon size={14} className="text-muted-foreground group-hover:text-white transition-colors" />
                            <span className={`text-[9px] font-black uppercase ${stat.status === 'optimal' || stat.status === 'secure' || stat.status === 'healthy' ? 'text-emerald-500/40' : 'text-amber-500/40'}`}>
                                {stat.status}
                            </span>
                        </div>
                        <p className="financial-label opacity-60 mb-1">{stat.label}</p>
                        <p className={`text-sm font-black font-mono italic ${stat.value === 'OFFLINE' ? 'text-red-500' : 'text-white'}`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#111] flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.05em]">
                    Last Heartbeat: {status?.last_updated ? new Date(status.last_updated).toLocaleTimeString() : 'N/A'}
                </p>
            </div>
        </div>
    )
}
