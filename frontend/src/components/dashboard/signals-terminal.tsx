"use client";

import React, { useState, useMemo } from 'react';
import { Search, ShieldAlert, Zap, Clock, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock Data for "Today's Signals"
const MOCK_SIGNALS = [
    { id: '1', instrument: 'NIFTY', symbol: 'NIFTY 25JAN 21500 CE', direction: 'BUY', entry: '142.20', sl: '125.00', t1: '160.00', t2: '185.00', t3: '210.00', confidence: 92, timestamp: '09:25 IST', status: 'active' },
    { id: '2', instrument: 'BANKNIFTY', symbol: 'BANKNIFTY 25JAN 46000 PE', direction: 'SELL', entry: '320.50', sl: '360.00', t1: '280.00', t2: '240.00', t3: '200.00', confidence: 88, timestamp: '09:45 IST', status: 'target-hit' },
    { id: '3', instrument: 'NIFTY', symbol: 'NIFTY 25JAN 21400 PE', direction: 'SELL', entry: '85.50', sl: '105.00', t1: '65.00', t2: '45.00', t3: '20.00', confidence: 75, timestamp: '10:15 IST', status: 'sl-hit' },
    { id: '4', instrument: 'SENSEX', symbol: 'SENSEX 25JAN 72000 CE', direction: 'BUY', entry: '450.00', sl: '410.00', t1: '490.00', t2: '550.00', t3: '620.00', confidence: 95, timestamp: '11:30 IST', status: 'active' },
    { id: '5', instrument: 'BANKNIFTY', symbol: 'BANKNIFTY 25JAN 46200 CE', direction: 'BUY', entry: '210.00', sl: '180.00', t1: '250.00', t2: '300.00', t3: '380.00', confidence: 82, timestamp: '12:10 IST', status: 'active' },
    { id: '6', instrument: 'SENSEX', symbol: 'SENSEX 25JAN 71500 PE', direction: 'SELL', entry: '310.00', sl: '350.00', t1: '270.00', t2: '220.00', t3: '150.00', confidence: 78, timestamp: '13:45 IST', status: 'active' },
];

type InstrumentType = 'NIFTY' | 'BANKNIFTY' | 'SENSEX';

export function SignalsTerminal() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSignals = useMemo(() => {
        return MOCK_SIGNALS.filter(signal =>
            signal.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            signal.instrument.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a, b) => b.timestamp.localeCompare(a.timestamp)); // Newest first
    }, [searchQuery]);

    const getSignalsByInstrument = (inst: InstrumentType) => {
        return filteredSignals.filter(s => s.instrument === inst);
    };

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-140px)]">

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
                                    <SignalCard key={signal.id} signal={signal} isLatest={idx === 0} />
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

function SignalCard({ signal, isLatest }: { signal: any, isLatest: boolean }) {
    const isBuy = signal.direction === 'BUY';

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
                    <span className="text-[10px] font-mono text-zinc-500">{signal.timestamp}</span>
                </div>
                <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-mono border-zinc-800 text-zinc-500">
                    {signal.confidence}% CONF
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
                    <span className="text-sm font-mono text-white font-medium">{signal.entry}</span>
                </div>
            </div>

            {/* Levels Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 rounded bg-rose-500/[0.03] border border-rose-500/10">
                    <span className="text-[8px] text-rose-500/70 block uppercase tracking-widest mb-1">Stop Loss</span>
                    <span className="text-xs font-mono text-rose-400">{signal.sl}</span>
                </div>
                <div className="p-2 rounded bg-emerald-500/[0.03] border border-emerald-500/10">
                    <span className="text-[8px] text-emerald-500/70 block uppercase tracking-widest mb-1">Target 1</span>
                    <span className="text-xs font-mono text-emerald-400">{signal.t1}</span>
                </div>
            </div>

            {/* Extended Targets (Compact) */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 bg-white/[0.02] p-1.5 rounded border border-white/[0.02]">
                <Target className="w-3 h-3 text-zinc-700" />
                <div className="flex gap-3">
                    <span>T2: <span className="text-zinc-400">{signal.t2}</span></span>
                    <span className="text-zinc-700">•</span>
                    <span>T3: <span className="text-zinc-400">{signal.t3}</span></span>
                </div>
            </div>

            {/* Status Footer */}
            {signal.status !== 'active' && (
                <div className={cn(
                    "mt-3 text-[9px] font-black uppercase tracking-widest text-center py-1 rounded border",
                    signal.status === 'target-hit' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                )}>
                    {signal.status.replace('-', ' ')}
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
