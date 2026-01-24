"use client";

import { MarketScanner } from "@/components/dashboard/market-scanner";
import { Badge } from "@/components/ui/badge";
import { Activity, Shield, Cpu, Zap } from "lucide-react";

export default function ScannerPage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded bg-primary/10 border border-primary/20">
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Aegis Intelligence Feed</h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium">Global cross-asset scanning and real-time execution signal stream.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Active Nodes</span>
                        <span className="text-sm font-mono text-emerald-500 font-black">128/128 OK</span>
                    </div>
                    <div className="w-[1px] h-8 bg-zinc-800" />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Global Heat</span>
                        <span className="text-sm font-mono text-white font-black">NORMAL</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 h-[700px]">
                    <MarketScanner />
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Scanner Configuration</h3>
                        <div className="space-y-3">
                            {[
                                { label: "NIFTY 50", status: "Enabled", icon: Zap },
                                { label: "BANKNIFTY", status: "Enabled", icon: Zap },
                                { label: "MCX GOLD", status: "Disabled", icon: Shield },
                                { label: "USD/INR", status: "Enabled", icon: Zap },
                            ].map((cfg, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <cfg.icon className={`w-3.5 h-3.5 ${cfg.status === 'Enabled' ? 'text-primary' : 'text-zinc-700'}`} />
                                        <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white transition-colors">{cfg.label}</span>
                                    </div>
                                    <Badge variant="outline" className={`px-2 py-0 text-[8px] uppercase font-black tracking-widest ${cfg.status === 'Enabled' ? 'border-emerald-500/20 text-emerald-500' : 'border-zinc-800 text-zinc-700'}`}>
                                        {cfg.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 space-y-3 overflow-hidden relative">
                        <Cpu className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/5 -rotate-12" />
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Neural Processing</h3>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium relative z-10">
                            Proprietary vector-divergence logic is currently active. Processing 1.2M ticks/minute with 0.4ms latency.
                        </p>
                        <div className="pt-2 relative z-10">
                            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-primary animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
