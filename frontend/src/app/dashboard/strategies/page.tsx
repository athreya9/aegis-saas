"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, Play, Settings, Shield, Plus, ArrowUpRight } from "lucide-react";

export default function StrategiesPage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
                        <Layers className="text-primary w-8 h-8" />
                        Strategy Management
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">Design, backtest, and deploy your algorithmic perimeter.</p>
                </div>
                <Button className="bg-primary text-white hover:bg-primary/90 font-black text-xs uppercase tracking-widest px-6 h-12 rounded-lg shadow-xl shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" /> New Strategy
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { name: "Alpha-Nifty-Trend", type: "Trend Following", status: "Active", risk: "Balanced" },
                    { name: "BankNifty-Scalper", type: "Mean Reversion", status: "Stopped", risk: "Active" },
                    { name: "Option-Writing-Theta", type: "Delta Neutral", status: "Active", risk: "Conservative" },
                ].map((strat, i) => (
                    <Card key={i} className="bg-[#050505] border-white/5 hover:border-primary/30 transition-all group overflow-hidden">
                        <CardHeader className="pb-4 border-b border-white/[0.03]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${strat.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                        <CardTitle className="text-sm font-black text-white uppercase tracking-tight">{strat.name}</CardTitle>
                                    </div>
                                    <span className="text-[10px] text-zinc-600 font-mono uppercase font-bold tracking-widest">{strat.type}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="text-zinc-800 hover:text-white -mt-2">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 pb-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Risk Profile</span>
                                    <span className="text-xs font-bold text-zinc-300">{strat.risk}</span>
                                </div>
                                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Win Rate</span>
                                    <span className="text-xs font-bold text-emerald-500 font-mono">68.4%</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-white/[0.01] border-t border-white/[0.03] py-4 flex justify-between">
                            <Button variant="outline" className="text-[10px] font-black border-white/5 text-zinc-500 hover:text-white">Backtest</Button>
                            <Button className={`text-[10px] font-black ${strat.status === 'Active' ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20'} border`}>
                                {strat.status === 'Active' ? 'Stop' : 'Deploy'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
