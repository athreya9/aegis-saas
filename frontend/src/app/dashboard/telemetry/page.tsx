"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Cpu, Zap, Activity, Info } from "lucide-react";

export default function TelemetryPage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto px-6 py-8 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                        <Cpu className="text-primary w-8 h-8" />
                        Platform Telemetry
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium font-mono uppercase tracking-widest italic">Sub-millisecond process audit • Node Health: Optimistic</p>
                </div>
                <div className="flex items-center gap-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">All Systems Nominal</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Core Latency", val: "0.12ms", icon: Zap, suffix: "AVG" },
                    { label: "Throughput", val: "1.2M", icon: Activity, suffix: "tps" },
                    { label: "Process Load", val: "14.2%", icon: Cpu, suffix: "CPU" },
                    { label: "Memory Pressure", val: "Lo-7%", icon: Info, suffix: "OPT" },
                ].map((stat, i) => (
                    <Card key={i} className="bg-[#050505] border-white/5 hover:border-primary/30 transition-all p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/5 flex items-center justify-center">
                                <stat.icon size={16} className="text-primary" />
                            </div>
                            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{stat.suffix}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</span>
                            <span className="text-2xl font-mono font-black">{stat.val}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/[0.02]">
                            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-primary" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#050505] border-white/5 p-6 space-y-4">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Neural Node Distribution</h3>
                    <div className="h-64 flex items-center justify-center border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                        <span className="text-[10px] text-zinc-700 font-mono uppercase font-bold tracking-tighter">Real-time Node Map [Simulated]</span>
                    </div>
                </Card>
                <Card className="bg-[#050505] border-white/5 p-6 space-y-4">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Execution Latency Drift</h3>
                    <div className="h-64 flex items-center justify-center border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                        <span className="text-[10px] text-zinc-700 font-mono uppercase font-bold tracking-tighter">Latency Spectrum [Simulated]</span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
