"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { AccuracyCard } from "@/components/dashboard/accuracy-card";
import { MessageSquare, ArrowRight, Activity, Percent } from "lucide-react";
import tooltips from "@/config/tooltips.json";

interface Signal {
    id: string;
    source: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    entry_price: number;
    stop_loss: number;
    targets: number[];
    confidence: number;
    score_breakdown?: {
        parsing: number;
        logic: number;
        latency: number;
        history: number;
    };
    timestamp_ist: string;
}

export default function SignalsPage() {
    const [signals, setSignals] = useState<Signal[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSignals = async () => {
        try {
            const res = await fetch('http://91.98.226.5:4100/api/v1/signals/recent');
            const data = await res.json();
            if (data.status === 'success') {
                setSignals(data.data);
            }
        } catch (e) {
            console.error("Failed to fetch signals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSignals();
        const interval = setInterval(fetchSignals, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Signal Feed</h1>
                <p className="text-muted-foreground">Real-time market opportunities from subscribed channels.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <AccuracyCard />
                </div>

                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {signals.map((signal) => (
                        <Card key={signal.id} className="bg-[#0A0A0A] border-zinc-800 overflow-hidden group hover:border-zinc-700 transition-all">
                            <CardHeader className="pb-3 border-b border-zinc-900 bg-zinc-950/50">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 bg-indigo-500/10 text-[10px] uppercase tracking-wider">
                                                {signal.source.split(':')[0]}
                                            </Badge>
                                            <span className="text-xs text-zinc-500 font-mono">
                                                {new Date(signal.timestamp_ist).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                                            {signal.symbol}
                                            <span className={`text-xs px-2 py-0.5 rounded font-black uppercase ${signal.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
                                                }`}>
                                                {signal.side}
                                            </span>
                                        </CardTitle>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-widest cursor-help">
                                            Confidence
                                            <HelpTooltip text={signal.score_breakdown ? `Parsing: ${signal.score_breakdown.parsing}% | Logic: ${signal.score_breakdown.logic}% | Latency: ${signal.score_breakdown.latency}% | Historical: ${signal.score_breakdown.history}%` : "AI Score"} />
                                        </div>
                                        <div className={`flex items-center gap-1 font-mono font-bold text-lg ${signal.confidence >= 80 ? 'text-emerald-500' :
                                            signal.confidence >= 60 ? 'text-amber-500' : 'text-red-500'
                                            }`}>
                                            <Activity size={14} />
                                            {signal.confidence}%
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Entry Zone</label>
                                        <p className="text-2xl font-mono font-bold text-white">₹{signal.entry_price}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Stop Loss</label>
                                        <p className="text-xl font-mono font-medium text-rose-500">₹{signal.stop_loss}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Targets</label>
                                    <div className="flex gap-2">
                                        {signal.targets.map((t, i) => (
                                            <Badge key={i} variant="secondary" className="bg-zinc-900 text-zinc-300 font-mono">
                                                ₹{t}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Button className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 font-mono text-xs uppercase tracking-widest disabled:opacity-50" disabled={true}>
                                    Execute (Read-Only)
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    {signals.length === 0 && (
                        <div className="col-span-full py-20 text-center space-y-4 border-2 border-dashed border-zinc-800 rounded-xl">
                            <div className="mx-auto w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center">
                                <MessageSquare className="text-zinc-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-zinc-300">Listening for Signals</h3>
                                <p className="text-zinc-500 text-sm">Waiting for incoming telegram broadcasts...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
