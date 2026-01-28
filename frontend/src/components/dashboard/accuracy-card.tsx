"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

export function AccuracyCard() {
    return (
        <Card className="bg-[#0A0A0A] border-zinc-800">
            <CardHeader className="pb-2 border-b border-zinc-900 bg-zinc-950/30">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-indigo-500" />
                        Signal Accuracy (30 Days)
                    </CardTitle>
                    <Badge variant="outline" className="border-zinc-800 text-[10px] text-zinc-600">ROLLING WINDOW</Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">

                {/* External Accuracy */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-zinc-400 flex items-center gap-1">
                            External Sources (Telegram)
                            <HelpTooltip text="Raw hit rate of external channels before Aegis validation." />
                        </span>
                        <span className="text-amber-500">68%</span>
                    </div>
                    <Progress value={68} className="h-1.5" indicatorClassName="bg-amber-500" />
                </div>

                {/* Aegis Validated Accuracy */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-zinc-400 flex items-center gap-1">
                            Aegis Validated (Core)
                            <HelpTooltip text="Hit rate of signals that passed all safety checks." />
                        </span>
                        <span className="text-emerald-500">82%</span>
                    </div>
                    <Progress value={82} className="h-1.5" indicatorClassName="bg-emerald-500" />
                </div>

                {/* Comparative Metric */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-center">
                        <p className="text-[10px] uppercase text-zinc-500 font-bold">Avg Gain</p>
                        <p className="text-lg font-mono font-bold text-emerald-400">+45 pts</p>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-center">
                        <p className="text-[10px] uppercase text-zinc-500 font-bold">SL Freq</p>
                        <p className="text-lg font-mono font-bold text-rose-400">15%</p>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded">
                    <AlertTriangle className="h-4 w-4 text-amber-500/80 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-500/70 leading-relaxed font-medium">
                        Past performance is not indicative of future results. External signals are verified inputs, not financial advice.
                    </p>
                </div>

            </CardContent>
        </Card>
    );
}
