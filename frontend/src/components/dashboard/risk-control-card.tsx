"use client"

import { useState, useEffect } from "react"
import { Shield, Zap, Power, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useAuth } from "@/context/auth-context"
import { HelpTooltip } from "../ui/help-tooltip"
import tooltips from "@/config/tooltips.json"

type RiskProfile = 'CONSERVATIVE' | 'BALANCED' | 'ACTIVE';

export function RiskControlCard() {
    const { user } = useAuth();
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchStatus = async () => {
        try {
            const res = await fetch('http://91.98.226.5:4100/api/v1/control/status', {
                headers: { 'x-user-id': 'default_user', 'x-user-plan': 'AUTOMATION' }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setStatus(data.data);
            }
        } catch (e) {
            console.error("Failed to fetch control status");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const toggleAutoTrading = async () => {
        setActionLoading(true);
        try {
            const res = await fetch('http://91.98.226.5:4100/api/v1/control/auto-trading', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-user-id': 'default_user', 'x-user-plan': 'AUTOMATION' },
                body: JSON.stringify({ enabled: !status?.autoTrading })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setStatus(data.sandbox_state);
            } else {
                alert(data.message || "Operation failed");
            }
        } catch (e) {
            console.error("Toggle failed");
        } finally {
            setActionLoading(false);
        }
    };

    const updateProfile = async (profile: RiskProfile) => {
        if (status?.autoTrading) return;
        setActionLoading(true);
        try {
            const res = await fetch('http://91.98.226.5:4100/api/v1/control/risk-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-user-id': 'default_user', 'x-user-plan': 'AUTOMATION' },
                body: JSON.stringify({ profile })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setStatus(data.data);
            }
        } catch (e) {
            console.error("Profile update failed");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <Card className="bg-[#0a0a0a] border-white/5 animate-pulse h-[320px]" />
    );

    const isAutoTrading = status?.autoTrading;

    return (
        <Card className={`bg-[#0a0a0a] border-white/5 overflow-hidden transition-all duration-500 ${isAutoTrading ? 'ring-1 ring-emerald-500/20' : ''}`}>
            <CardHeader className="pb-4 border-b border-white/[0.02]">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Execution Engine</CardTitle>
                    <div className={`w-2 h-2 rounded-full ${isAutoTrading ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">

                {/* Status Indicator */}
                <div className="flex items-center justify-between px-1">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <p className={`text-xl font-black uppercase tracking-tighter ${isAutoTrading ? 'text-white' : 'text-zinc-600'}`}>
                                {isAutoTrading ? 'Live Trading' : 'Execution Halt'}
                            </p>
                            {status?.execution_mode && (
                                <Badge variant="outline" className={`text-[9px] h-5 ${status.execution_mode === 'LIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                    {status.execution_mode}
                                </Badge>
                            )}
                        </div>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                            {isAutoTrading ? 'Managing orders via API' : 'Manual monitoring only'}
                            <HelpTooltip text={status?.execution_mode === 'LIVE'
                                ? "LIVE MODE: Real capital is at risk. Orders are routed to exchange."
                                : "PAPER MODE: Simulations only. No financial risk."}
                            />
                        </p>
                    </div>
                </div>

                {/* Primary Control */}
                <Button
                    onClick={toggleAutoTrading}
                    disabled={actionLoading}
                    className={`w-full h-14 font-black uppercase tracking-widest text-xs transition-all duration-500 ${isAutoTrading
                        ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-white/5'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/10'
                        }`}
                >
                    {actionLoading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        <div className="flex items-center gap-3">
                            <Power size={16} />
                            {isAutoTrading ? 'Disable Auto-Trading' : 'Initialize Execution'}
                        </div>
                    )}
                </Button>

                {/* Risk Profile Selector */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-1">
                            Risk Profile <HelpTooltip text={tooltips["automation.checklist.risk"]} />
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500">Cap: ₹{status?.stats?.riskCap || 0}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {(['CONSERVATIVE', 'BALANCED', 'ACTIVE'] as RiskProfile[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => updateProfile(p)}
                                disabled={isAutoTrading}
                                className={`h-10 text-[9px] font-black uppercase tracking-tighter rounded border transition-all ${status?.riskProfile === p
                                    ? 'bg-zinc-900 border-white/20 text-white'
                                    : 'bg-transparent border-white/5 text-zinc-700 hover:text-zinc-400'
                                    } ${isAutoTrading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            >
                                {p.substring(0, 4)}
                            </button>
                        ))}
                    </div>
                    {isAutoTrading && (
                        <p className="text-[9px] text-zinc-700 font-mono italic flex items-center gap-1">
                            <AlertTriangle size={10} /> Profile locked during session.
                        </p>
                    )}
                </div>

            </CardContent>
            <CardFooter className="bg-white/[0.01] border-t border-white/[0.02] py-4 px-6">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Shield size={12} className="text-zinc-700" />
                        <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest flex items-center gap-1">
                            Risk Guard Active <HelpTooltip text="Real-time risk monitoring is active. Violations trigger immediate halts." />
                        </span>
                    </div>
                    {isAutoTrading && (
                        <div className="flex items-center gap-2 text-[9px] font-mono text-emerald-500/60 uppercase">
                            <Zap size={10} /> Validating Order Flow
                        </div>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
