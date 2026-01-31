"use client"

import { useOSData } from "@/hooks/use-os-data"
import { Shield, AlertTriangle, CheckCircle, Activity, BrainCircuit } from "lucide-react"

export function TransparencyBar() {
    const { status } = useOSData();
    const transparency = status?.transparency;

    if (!transparency) return null;

    const isOffline = transparency.coreStatus === 'CORE OFFLINE';
    const isWaitAuth = transparency.coreStatus === 'WAIT_FOR_AUTH';

    return (
        <div className={`vercel-card p-4 transition-all duration-500 border-l-4 ${isOffline ? 'border-l-red-500 bg-red-500/5' :
            isWaitAuth ? 'border-l-amber-500 bg-amber-500/5' :
                'border-l-emerald-500 bg-emerald-500/5'
            }`}>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                {/* Status Indicator */}
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isOffline ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {isOffline ? <AlertTriangle size={20} /> : <Shield size={20} />}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Core Authority</p>
                        <h4 className={`text-sm font-bold uppercase ${isOffline ? 'text-red-500' : 'text-white'}`}>
                            {transparency.coreStatus}
                        </h4>
                    </div>
                </div>

                {/* Transparency Metrics */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 px-6 border-x border-white/5">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Last Decision</p>
                        <p className="text-[11px] font-mono font-bold text-white truncate">
                            {transparency.lastDecision || 'SCANNING...'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Rejection Reason</p>
                        <p className="text-[11px] font-mono font-bold text-amber-500 truncate">
                            {transparency.lastRejection || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Confidence</p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden max-w-[60px]">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-1000"
                                    style={{ width: `${(transparency.confidenceScore || 0) * 100}%` }}
                                />
                            </div>
                            <span className="text-[11px] font-mono font-bold text-white">
                                {transparency.confidenceScore ? (transparency.confidenceScore * 100).toFixed(0) : '0'}%
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Risk Aggression</p>
                        <p className="text-[11px] font-mono font-bold text-white">
                            ₹{transparency.riskUsed?.toLocaleString() || '0'}
                        </p>
                    </div>
                </div>

                {/* Heartbeat Badge */}
                <div className="flex items-center gap-3 pl-4">
                    <div className="text-right hidden md:block">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Heartbeat</p>
                        <p className="text-[10px] font-medium text-zinc-400">
                            {transparency.lastHeartbeat ? new Date(transparency.lastHeartbeat).toLocaleTimeString() : 'WAITING...'}
                        </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                </div>
            </div>

            {/* Warning Message if Offline or Wait Auth */}
            {(isOffline || isWaitAuth) && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                    <Activity size={12} className={isOffline ? 'text-red-500' : 'text-amber-500'} />
                    <p className={`text-[10px] font-medium ${isOffline ? 'text-red-400' : 'text-amber-400'}`}>
                        {isOffline
                            ? "CORE SYSTEM OFFLINE - Maintenance in Progress."
                            : "Core OS is waiting for brokerage authentication. Execution is paused."}
                    </p>
                </div>
            )}
        </div>
    )
}
