"use client"

import { Cpu, Zap, ShieldCheck, Database } from "lucide-react"

const stats = [
    { label: "Kernel Latency", value: "14ms", status: "optimal", icon: Zap },
    { label: "Memory Load", value: "4.2GB / 16GB", status: "good", icon: Cpu },
    { label: "Security Enclave", value: "Active", status: "secure", icon: ShieldCheck },
    { label: "Data Pipeline", value: "98.2%", status: "healthy", icon: Database },
]

export function SystemHealthCard() {
    return (
        <div className="vercel-card p-6 flex flex-col h-full bg-[#050505]">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-white tracking-tight">System Health</h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">v4.2 PRO</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
                {stats.map((stat, i) => (
                    <div key={i} className="p-4 rounded-lg bg-[#0a0a0a] border border-[#111] hover:border-[#222] transition-colors group">
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon size={14} className="text-muted-foreground group-hover:text-white transition-colors" />
                            <span className="text-[9px] font-black uppercase text-emerald-500/40">Active</span>
                        </div>
                        <p className="financial-label opacity-60 mb-1">{stat.label}</p>
                        <p className="text-lg font-black font-mono italic text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#111] flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.05em]">Uptime: 14d 08h 12m</p>
                <button className="text-[10px] font-black text-white hover:underline uppercase tracking-widest">Full Diagnostics</button>
            </div>
        </div>
    )
}
