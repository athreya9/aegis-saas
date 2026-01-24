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
                const res = await fetch('http://91.98.226.5:4100/api/v1/signals/today');
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
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Today's Signals</p>
                        <p className="text-xl font-mono text-white font-bold">{stats.total}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 md:border-r border-white/5 pr-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Target Hit</p>
                        <p className="text-xl font-mono text-emerald-500 font-bold">{stats.t1}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 md:border-r border-white/5 pr-4">
                    <div className="p-2 bg-rose-500/10 rounded-lg">
                        <XCircle className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">SL Hit</p>
                        <p className="text-xl font-mono text-rose-500 font-bold">{stats.sl}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Success Rate</p>
                        <p className="text-xl font-mono text-blue-500 font-bold">{stats.successRate}%</p>
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
                                <span className="text-[9px] text-zinc-600 font-mono">LIVE</span>
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
    const isActive = signal.outcome_status === 'OPEN'; // Matches Blueprint outcome_status

    return (
        <div className={cn(
            "relative p-4 rounded-lg border bg-[#0a0a0a] transition-all duration-500 group hover:border-white/10",
            isLatest ? "border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]" : "border-white/[0.03]"
        )}>
            {isLatest && (
                <div className="absolute top-0 right-0 w-full h-full rounded-lg animate-pulse-subtle pointer-events-none border border-emerald-500/10" />
            )}

            {/* Header: Time & Confidence */}
            <div className="flex items-center justify-between mb-3 border-b border-white/[0.03] pb-2">
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    <span className="text-[10px] font-mono text-zinc-500">{signal.timestamp_ist}</span>
                </div>
                <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-mono border-zinc-800 text-zinc-500">
                    {signal.confidence_pct}% CONF
                </Badge>
            </div>

            {/* Symbol & Direction */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-white tracking-tight">{signal.symbol}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                        {isBuy ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            isBuy ? "text-emerald-500" : "text-rose-500"
                        )}>
                            {signal.direction}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[9px] text-zinc-600 block uppercase tracking-wider mb-0.5">Entry</span>
                    <span className="text-sm font-mono text-white font-medium">{signal.entry_price}</span>
                </div>
            </div>

            {/* Levels Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 rounded bg-rose-500/[0.03] border border-rose-500/10">
                    <span className="text-[8px] text-rose-500/70 block uppercase tracking-widest mb-1">Stop Loss</span>
                    <span className="text-xs font-mono text-rose-400">{signal.stop_loss}</span>
                </div>
                <div className="p-2 rounded bg-emerald-500/[0.03] border border-emerald-500/10">
                    <span className="text-[8px] text-emerald-500/70 block uppercase tracking-widest mb-1">Target 1</span>
                    <span className="text-xs font-mono text-emerald-400">{signal.targets.t1}</span>
                </div>
            </div>

            {/* Extended Targets (Compact) */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 bg-white/[0.02] p-1.5 rounded border border-white/[0.02]">
                <Target className="w-3 h-3 text-zinc-700" />
                <div className="flex gap-3">
                    <span>T2: <span className="text-zinc-400">{signal.targets.t2}</span></span>
                    <span className="text-zinc-700">•</span>
                    <span>T3: <span className="text-zinc-400">{signal.targets.t3}</span></span>
                </div>
            </div>

            {/* Explicit Outcome Status */}
            {!isActive && (
                <div className={cn(
                    "mt-3 flex items-center justify-center gap-2 py-1.5 rounded border text-[10px] font-black uppercase tracking-widest",
                    isTarget ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                )}>
                    {isTarget ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
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
