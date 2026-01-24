"use client"

import { Activity, Radio, AlertCircle, CheckCircle2, Zap, ShieldAlert, Cpu } from "lucide-react"

const activities = [
    { type: "EXEC", message: "NIFTY 21500 CE Buy • 50 Qty", val: "245.10", time: "Just now", status: "found" },
    { type: "SCAN", message: "Vector divergence on Reliance (1h)", val: "SYNCING", time: "2m ago", status: "active" },
    { type: "RISK", message: "Margin threshold check: PASS (1.2x)", val: "OK", time: "5m ago", status: "done" },
    { type: "REJT", message: "Budget reject: SBIN • Over exposed", val: "BLOCK", time: "12m ago", status: "error" },
    { type: "KERN", message: "Kernel process: HFT-Loop-01", val: "0.12ms", time: "15m ago", status: "active" },
]

export function MarketScanner() {
    return (
        <div className="flex flex-col h-full bg-[#050505]/80 border border-white/5 rounded-xl overflow-hidden backdrop-blur-xl">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                        <Activity size={12} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-white uppercase tracking-wider">Aegis Intelligence Feed</h3>
                        <p className="text-[9px] text-zinc-500 font-medium font-mono">CORE_V4_RUNTIME • STANDBY</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Live Feed</span>
                </div>
            </div>

            {/* Stream */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
                <div className="divide-y divide-white/[0.03]">
                    {activities.map((act, i) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-all cursor-default group">
                            <div className="flex-none flex items-center justify-center">
                                <div className={`w-1.5 h-1.5 rounded-full ${act.status === "active" ? "bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" :
                                        act.status === "found" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                                            act.status === "error" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" :
                                                "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                    }`} />
                            </div>

                            <div className="flex-1 min-w-0 py-0.5">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{act.type}</span>
                                    <span className="text-[9px] text-zinc-700 font-mono italic">{act.time}</span>
                                </div>
                                <p className="text-[11px] font-medium text-zinc-300 truncate tracking-tight group-hover:text-white transition-colors">{act.message}</p>
                            </div>

                            <div className="flex-none text-right">
                                <div className="text-[10px] font-mono font-bold text-white bg-white/[0.05] px-2 py-0.5 rounded border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                    {act.val}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/[0.01] border-t border-white/5">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Latency</span>
                            <span className="text-[9px] font-mono text-emerald-500 font-black">0.42ms</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/5" />
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Memory</span>
                            <span className="text-[9px] font-mono text-zinc-400 font-black">12.4MB</span>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
                        SYS_MOD
                    </button>
                </div>
            </div>
        </div>
    )
}
