"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, CheckCircle2, History } from "lucide-react";

export default function ExecutionsPage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto px-6 py-8 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                        <Activity className="text-primary w-8 h-8" />
                        Order Executions
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium font-mono uppercase tracking-widest">Aegis Core™ Execution Ledger • Real-time audit</p>
                </div>
                <div className="text-right">
                    <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">24h Volume</span>
                    <span className="text-xl font-mono font-black text-white">$1,420,850</span>
                </div>
            </div>

            <Card className="bg-[#050505] border-white/5 overflow-hidden">
                <CardContent className="p-0">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Asset</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Strategy</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Type</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Volume</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {[
                                { time: "19:42:10", asset: "NIFTY CE", strat: "alpha-nifty", type: "BUY", vol: "50", status: "FILLED" },
                                { time: "18:15:22", asset: "REL_IND", strat: "momentum-v1", type: "SELL", vol: "100", status: "FILLED" },
                                { time: "14:30:05", asset: "BANKNF PE", strat: "scalp-theta", type: "BUY", vol: "25", status: "FILLED" },
                                { time: "11:20:44", asset: "GOLD JUN", strat: "metal-arb", type: "BUY", vol: "10", status: "CANCEL" },
                            ].map((exec, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-all cursor-default group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-zinc-700" />
                                            <span className="text-[11px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase font-bold">{exec.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-bold text-[11px] text-zinc-300 uppercase tracking-tight">{exec.asset}</td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className="border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:border-primary/20 group-hover:text-primary transition-all">{exec.strat}</Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${exec.type === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}`}>{exec.type}</span>
                                    </td>
                                    <td className="px-6 py-5 text-[11px] font-mono text-zinc-400 font-black">{exec.vol} QTY</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className={`w-1 h-1 rounded-full ${exec.status === 'FILLED' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{exec.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="flex justify-center p-8 border border-dashed border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-all cursor-pointer group">
                <div className="flex flex-col items-center gap-2">
                    <History className="w-6 h-6 text-zinc-800 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-zinc-300">View Archive Logic</span>
                </div>
            </div>
        </div>
    );
}
