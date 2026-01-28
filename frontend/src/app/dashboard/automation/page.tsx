"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Zap, Shield, Activity, Power, Lock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import {
    Puzzle,
    Settings2,
    RefreshCcw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import tooltips from "@/config/tooltips.json";

export default function AutomationPage() {
    const [status, setStatus] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [checklistOpen, setChecklistOpen] = useState(false)
    const [preFlightChecks, setPreFlightChecks] = useState<any[]>([])
    const [launchReady, setLaunchReady] = useState(false)

    const fetchStatus = async () => {
        try {
            const res = await fetch('http://91.98.226.5:4100/api/v1/control/status');
            const data = await res.json();
            if (data.status === 'success') {
                setStatus(data.sandbox_state);
            }
        } catch (e) {
            console.error("Failed to fetch status:", e);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000); // Polling for safety
        return () => clearInterval(interval);
    }, []);

    const initiateLaunch = async () => {
        setChecklistOpen(true);
        setPreFlightChecks([]);
        setLaunchReady(false);

        try {
            const res = await fetch('http://91.98.226.5:4100/api/v1/control/pre-flight');
            const data = await res.json();
            if (data.status === 'success') {
                setPreFlightChecks(data.data.checks);
                setLaunchReady(data.data.ready);
            }
        } catch (e) {
            console.error("Pre-flight fetch failed");
        }
    };

    const confirmLaunch = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://91.98.226.5:4100/api/v1/control/auto-trading', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': 'default_user', // Mock context
                    'x-user-plan': 'AUTOMATION'
                },
                body: JSON.stringify({
                    enabled: true,
                    executionMode: status?.executionMode
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setStatus(data.sandbox_state);
                setChecklistOpen(false);
            } else {
                alert(`Launch Aborted: ${data.message}`);
                // Refresh checks to show failure
                initiateLaunch();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handlePanicStop = async () => {
        if (!confirm("ACTIVATE KILL SWITCH? This will instantly halt all trading and revert execution to SANDBOX.")) return;

        setLoading(true);
        try {
            await fetch('http://91.98.226.5:4100/api/v1/control/kill-switch', {
                method: 'POST',
                headers: { 'x-user-id': 'default_user' }
            });
            await fetchStatus();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (checked: boolean) => {
        if (checked) {
            initiateLaunch();
        } else {
            // Normal disable (soft stop)
            setLoading(true);
            try {
                await fetch('http://91.98.226.5:4100/api/v1/control/auto-trading', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-user-id': 'default_user' },
                    body: JSON.stringify({ enabled: false })
                });
                fetchStatus();
            } catch (e) { console.error(e); }
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Strategy Automation</h1>
                    <p className="text-muted-foreground">Configure your execution algorithms and risk parameters.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className={`border-zinc-900 overflow-hidden relative ${status?.autoTrading ? 'bg-emerald-950/10' : 'bg-[#050505]'}`}>
                    {status?.autoTrading && (
                        <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-xl pointer-events-none animate-pulse" />
                    )}

                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400 font-mono uppercase tracking-widest flex items-center gap-2">
                            Master Switch <HelpTooltip text={tooltips["automation.launch.master_switch"]} />
                        </CardTitle>
                        <Power className={`h-4 w-4 ${status?.autoTrading ? "text-emerald-500" : "text-zinc-600"}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-white flex items-center gap-2">
                                    {status?.autoTrading ? "ACTIVE" : "STANDBY"}
                                    {status?.executionMode === 'LIVE' && status?.autoTrading && (
                                        <Badge variant="destructive" className="ml-2 bg-red-600 animate-pulse text-[10px]">LIVE EXECUTION</Badge>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1 font-mono">
                                    {status?.autoTrading
                                        ? " algorithms engaged • monitoring signals"
                                        : "awaiting launch command"}
                                </p>
                            </div>

                            {status?.autoTrading ? (
                                <Button
                                    variant="destructive"
                                    onClick={handlePanicStop}
                                    className="h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-black tracking-widest uppercase border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse flex items-center gap-2"
                                >
                                    PANIC STOP <HelpTooltip text={tooltips["automation.panic_stop"]} />
                                </Button>
                            ) : (
                                <Switch
                                    checked={status?.autoTrading}
                                    onCheckedChange={handleToggle}
                                    className="data-[state=checked]:bg-emerald-600"
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Checklist Dialog */}
                <Dialog open={checklistOpen} onOpenChange={setChecklistOpen}>
                    <DialogContent className="bg-zinc-950 border-zinc-900 text-white sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                                <Activity className="w-5 h-5 text-indigo-500" />
                                Pre-Flight Checklist
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500">
                                Verifying safety parameters before engaging auto-trading systems.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3 py-4">
                            {preFlightChecks.map((check) => (
                                <div key={check.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        {check.passed ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-rose-500" />
                                        )}
                                        <span className={`text-sm font-medium ${check.passed ? 'text-zinc-300' : 'text-zinc-500'} flex items-center gap-1`}>
                                            {check.label}
                                            {check.id === 'BROKER_CONNECT' && <HelpTooltip text={tooltips["automation.checklist.broker"]} />}
                                            {check.id === 'SESSION_VALID' && <HelpTooltip text={tooltips["automation.checklist.session"]} />}
                                            {check.id === 'RISK_PROFILE' && <HelpTooltip text={tooltips["automation.checklist.risk"]} />}
                                            {check.id === 'DAILY_LIMIT' && <HelpTooltip text={tooltips["automation.checklist.limits"]} />}
                                        </span>
                                    </div>
                                    <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${check.passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {check.passed ? "READY" : "FAILED"}
                                    </div>
                                </div>
                            ))}

                            {status?.executionMode === 'LIVE' && (
                                <div className="mt-4 p-3 bg-red-950/20 border border-red-900/30 rounded-lg flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                    <div>
                                        <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Live Execution Warning</h4>
                                        <p className="text-[10px] text-red-400/80 leading-relaxed">
                                            You are about to enable REAL MONEY trading. All orders will be executed on the exchange. Ensure you are monitored.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button variant="ghost" className="text-zinc-500 hover:text-white" onClick={() => setChecklistOpen(false)}>Abort</Button>
                            <Button
                                className={`w-full font-black uppercase tracking-widest ${launchReady ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                                disabled={!launchReady || loading}
                                onClick={confirmLaunch}
                            >
                                {loading ? "Engaging..." : "Initiate Launch"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Puzzle className="h-5 w-5 text-primary" />
                            <CardTitle>Broker Integration</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg border p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center font-bold">K</div>
                                <div>
                                    <p className="font-semibold">Kite (Zerodha)</p>
                                    <p className="text-xs text-muted-foreground">Status: Connected</p>
                                </div>
                            </div>
                            <Badge variant="success">Active</Badge>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Access Token</label>
                            <div className="flex gap-2">
                                <Input type="password" value="************************" readOnly />
                                <Button variant="outline" size="icon">
                                    <RefreshCcw size={16} />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">Configure New Broker</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Settings2 className="h-5 w-5 text-primary" />
                            <CardTitle>Risk Parameters</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: "Daily Max Loss", value: "$500.00" },
                            { label: "Max Position Size", value: "2 Lots" },
                            { label: "Trailing SL Buffer", value: "1.5%" },
                        ].map((param, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                                <span className="text-sm text-muted-foreground">{param.label}</span>
                                <span className="font-mono font-medium">{param.value}</span>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button variant="secondary" className="w-full">Edit Risk Profile</Button>
                    </CardFooter>
                </Card>

                <Card className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            <CardTitle>Active Intelligence Modules</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: "Trend Follower", desc: "Momentum-based trend continuation", status: "Active" },
                                { name: "Sentiment Analyzer", desc: "News & Social media mood filtering", status: "Active" },
                                { name: "Alpha Scalper", desc: "High-frequency mean reversion", status: "Idle" },
                            ].map((module, i) => (
                                <div key={i} className="p-4 rounded-xl border bg-card/50 backdrop-blur-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold">{module.name}</h4>
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            module.status === "Active" ? "bg-emerald-500" : "bg-muted"
                                        )} />
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-4">{module.desc}</p>
                                    <Button variant="ghost" size="sm" className="w-full justify-start px-0 text-primary">
                                        View Logs
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
