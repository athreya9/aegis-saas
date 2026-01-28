"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, ShieldAlert, Zap, Clock, TrendingUp, TrendingDown, Target, AlertTriangle, BarChart3, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock Data Removed - Fetched from Backend (Port 4100)
// Type definition matches Backend Contract
interface Signal {
    signal_id: string;
    instrument: 'NIFTY' | 'BANKNIFTY' | 'SENSEX';
    symbol: string;
    direction: 'BUY' | 'SELL';
    entry_price: number;
    stop_loss: number;
    targets: { t1: number, t2: number, t3: number };
    confidence_pct: number;
    outcome_status: string;
    timestamp_ist: string;
    meta?: any;
}

type InstrumentType = 'NIFTY' | 'BANKNIFTY' | 'SENSEX';

export function SignalsTerminal() {
    const [searchQuery, setSearchQuery] = useState('');
    const [signals, setSignals] = useState<Signal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch Signals from Backend
    useEffect(() => {
        const fetchSignals = async () => {
            try {
                const res = await fetch('http://91.98.226.5:4100/api/v1/signals/recent');
                if (!res.ok) throw new Error('Failed to fetch signals');
                const data = await res.json();

                // Map API response to Component State 
                // Note: API returns snake_case numbers, frontend uses them directly now
                // Transforming flattened structure if needed, but current mock matches structure
                setSignals(data.data as Signal[]);
                setLoading(false);
            } catch (err) {
                console.error("Signal Fetch Error:", err);
                setError("Unable to connect to Signal Intelligence Feed.");
                setLoading(false);
            }
        };

        fetchSignals();
        // Poll every 30 seconds
        const interval = setInterval(fetchSignals, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredSignals = useMemo(() => {
        return signals.filter(signal =>
            signal.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            signal.instrument.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a, b) => b.timestamp_ist.localeCompare(a.timestamp_ist)); // Newest first
    }, [searchQuery, signals]);

    // Calculate Stats for Widget
    const stats = useMemo(() => {
        const total = signals.length;
        const t1 = signals.filter(s => s.outcome_status.includes('Target')).length;
        const sl = signals.filter(s => s.outcome_status.includes('Stop Loss')).length;
        const closed = t1 + sl;
        const successRate = closed > 0 ? Math.round((t1 / closed) * 100) : 0;
        return { total, t1, sl, successRate };
    }, [signals]);

    const getSignalsByInstrument = (inst: InstrumentType) => {
        return filteredSignals.filter(s => s.instrument === inst);
    };

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
                Initializing Secure Feed...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[400px] flex-col gap-4 items-center justify-center text-zinc-500">
                <ShieldAlert className="w-8 h-8 text-rose-900/50" />
                <div className="text-center">
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Connection Lost</p>
                    <p className="text-[10px] text-zinc-600 mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-140px)]">

            {/* Daily Performance Summary Widget */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#050505] border border-white/10 rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3 md:border-r border-white/5 pr-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">Today's Signals</p>
                        <p className="text-xl font-mono text-white font-black tracking-tight">{stats.total}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 md:border-r border-white/5 pr-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">Target Hit</p>
                        <p className="text-xl font-mono text-emerald-500 font-black tracking-tight">{stats.t1}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 md:border-r border-white/5 pr-4">
                    <div className="p-2 bg-rose-500/10 rounded-lg">
                        <XCircle className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">SL Hit</p>
                        <p className="text-xl font-mono text-rose-500 font-black tracking-tight">{stats.sl}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">Success Rate</p>
                        <p className="text-xl font-mono text-blue-500 font-black tracking-tight">{stats.successRate}%</p>
                    </div>
                </div>
            </div>

            {/* Disclaimer Banner */}
            <div className="bg-amber-950/30 border border-amber-500/20 rounded-lg p-3 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-500/90 leading-relaxed font-medium">
                    Signals are technical market observations. They may be incorrect.
                    Trading involves risk, and losses are possible. No guarantees are provided.
                </p>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-6 text-[10px] uppercase font-bold text-zinc-500 border-zinc-800 bg-zinc-900/50">
                        Today's Signals — Reset Daily
                    </Badge>
                </div>
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                    <input
                        type="text"
                        placeholder="Filter by Symbol..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-8 bg-[#0a0a0a] border border-white/10 rounded-md pl-9 pr-4 text-xs text-white placeholder:text-zinc-700 outline-none focus:border-white/20 transition-all font-mono"
                    />
                </div>
            </div>

            {/* Terminal Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
                {(['NIFTY', 'BANKNIFTY', 'SENSEX'] as InstrumentType[]).map((inst) => (
                    <div key={inst} className="flex flex-col bg-[#050505] border border-white/5 rounded-xl overflow-hidden shadow-inner shadow-black">
                        {/* Column Header */}
                        <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-zinc-500" />
                                <span className="text-xs font-black text-white uppercase tracking-widest">{inst}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-zinc-500 font-mono font-bold">LIVE</span>
                            </div>
                        </div>

                        {/* Signal Feed */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                            {getSignalsByInstrument(inst).length > 0 ? (
                                getSignalsByInstrument(inst).map((signal, idx) => (
                                    <SignalCard key={signal.signal_id} signal={signal} isLatest={idx === 0} />
                                ))
                            ) : (
                                <div className="h-32 flex flex-col items-center justify-center text-zinc-700 gap-2">
                                    <Zap className="w-6 h-6 opacity-20" />
                                    <span className="text-[10px] uppercase tracking-widest font-mono">No Signals</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SignalCard({ signal, isLatest }: { signal: Signal, isLatest: boolean }) {
    const isBuy = signal.direction === 'BUY';
    const isLoss = signal.outcome_status.includes('Stop Loss');
    const isTarget = signal.outcome_status.includes('Target');
    const isActive = signal.outcome_status === 'OPEN';

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Basic feedback: could be a toast, but keeping it simple for now
    };

    return (
        <div className={cn(
            "relative p-5 rounded-xl border bg-[#0a0a0a] transition-all duration-500 group hover:border-white/20",
            isLatest ? "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-white/[0.05]"
        )}>
            {isLatest && (
                <div className="absolute top-0 right-0 w-full h-full rounded-xl animate-pulse-subtle pointer-events-none border border-emerald-500/20" />
            )}

            {/* Header: Time & Confidence */}
            <div className="flex items-center justify-between mb-4 border-b border-white/[0.05] pb-2">
                <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-[11px] font-mono text-zinc-400 font-bold tracking-tight">{signal.timestamp_ist}</span>
                </div>
                <Badge variant="outline" className="h-5 px-2 text-[10px] font-mono border-zinc-800 text-zinc-400 bg-zinc-900/50">
                    {signal.confidence_pct}% CONF
                </Badge>
            </div>

            {/* Symbol & Direction - LARGE & CLEAR */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 group/copy cursor-pointer" onClick={() => copyToClipboard(signal.symbol)}>
                        <span className="text-xl font-black text-white tracking-tighter uppercase">{signal.symbol}</span>
                        <Zap size={14} className="text-zinc-700 group-hover/copy:text-white transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        {isBuy ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-rose-500" />}
                        <span className={cn(
                            "text-[12px] font-black uppercase tracking-[0.1em]",
                            isBuy ? "text-emerald-500" : "text-rose-500"
                        )}>
                            {signal.direction}
                        </span>
                    </div>
                </div>
                <div className="text-right group/copy cursor-pointer" onClick={() => copyToClipboard(signal.entry_price.toString())}>
                    <span className="text-[11px] text-zinc-500 block uppercase tracking-wider font-bold mb-1">Entry Price</span>
                    <span className="text-2xl font-mono text-white font-black tracking-tighter">{signal.entry_price}</span>
                </div>
            </div>

            {/* Primary Levels Grid - HIGH CONTRAST */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div
                    className="p-4 rounded-xl bg-rose-500/[0.03] border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer group/copy"
                    onClick={() => copyToClipboard(signal.stop_loss.toString())}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-rose-500/80 block uppercase tracking-wider font-bold">Stop Loss</span>
                        <Zap size={12} className="text-rose-900/40 group-hover/copy:text-rose-500" />
                    </div>
                    <span className="text-xl font-mono text-rose-400 font-black tracking-tighter">{signal.stop_loss}</span>
                </div>
                <div
                    className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer group/copy"
                    onClick={() => copyToClipboard(signal.targets.t1.toString())}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-emerald-500/80 block uppercase tracking-wider font-bold">Target 1</span>
                        <Zap size={12} className="text-emerald-900/40 group-hover/copy:text-emerald-500" />
                    </div>
                    <span className="text-xl font-mono text-emerald-400 font-black tracking-tighter">{signal.targets.t1}</span>
                </div>
            </div>

            {/* Secondary Targets - FLEXIBLE & SCANNABLE */}
            <div className="flex flex-col gap-2">
                <div
                    className="flex items-center justify-between text-[12px] font-mono text-zinc-400 bg-white/[0.02] p-3 rounded-lg border border-white/5 hover:border-white/10 transition-all cursor-pointer group/copy"
                    onClick={() => copyToClipboard(signal.targets.t2.toString())}
                >
                    <div className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-zinc-600" />
                        <span className="font-black">TARGET 2</span>
                    </div>
                    <span className="text-white font-black">{signal.targets.t2}</span>
                </div>
                <div
                    className="flex items-center justify-between text-[12px] font-mono text-zinc-400 bg-white/[0.02] p-3 rounded-lg border border-white/5 hover:border-white/10 transition-all cursor-pointer group/copy"
                    onClick={() => copyToClipboard(signal.targets.t3.toString())}
                >
                    <div className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-zinc-600" />
                        <span className="font-black">TARGET 3</span>
                    </div>
                    <span className="text-white font-black">{signal.targets.t3}</span>
                </div>
            </div>

            {/* Explicit Outcome Status */}
            {!isActive && (
                <div className={cn(
                    "mt-4 flex items-center justify-center gap-3 py-3 rounded-xl border text-[11px] font-black uppercase tracking-widest",
                    isTarget ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                )}>
                    {isTarget ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {signal.outcome_status}
                </div>
            )}
        </div>
    );
}

function Activity(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
