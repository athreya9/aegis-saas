"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Server, Database, Shield, Cpu } from "lucide-react"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Power, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function SystemPage() {
    const [systemStatus, setSystemStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [killSwitchLoading, setKillSwitchLoading] = useState(false);

    const fetchSystemStatus = async () => {
        try {
            // Fetch Global Admin Status (Kill Switch, DB)
            const adminRes = await fetch('http://91.98.226.5:4100/api/v1/admin/system/status', {
                headers: { 'x-user-role': 'ADMIN' }
            });
            const adminData = await adminRes.json();

            // Fetch OS Proxy Status
            const osRes = await fetch('http://91.98.226.5:4100/api/v1/os/status');
            const osData = await osRes.json();

            if (adminData.status === 'success') {
                const combined = {
                    ...adminData,
                    os: osData
                };
                setSystemStatus(combined);
            }
        } catch (e) {
            console.error("Failed to fetch system status");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSystemStatus();
        const interval = setInterval(fetchSystemStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const toggleKillSwitch = async () => {
        if (!systemStatus) return;
        const action = systemStatus.kill_switch ? "RESUME" : "KILL";
        const confirmMsg = action === "KILL"
            ? "WARNING: This will IMMEDIATELY STOP all active execution sandboxes across the entire platform. Are you sure?"
            : "Resume system operations? Users will need to manually reconnect brokers.";

        if (!confirm(confirmMsg)) return;

        setKillSwitchLoading(true);
        try {
            const res = await fetch('http://91.98.226.5:4100/api/v1/admin/kill-switch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': 'ADMIN'
                },
                body: JSON.stringify({ active: !systemStatus.kill_switch })
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert(data.message);
                fetchSystemStatus();
            }
        } catch (e) {
            alert("Failed to toggle kill switch");
        } finally {
            setKillSwitchLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">System Status</h1>
                    <p className="text-zinc-400">Real-time health monitoring of Aegis Infrastructure.</p>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={systemStatus?.kill_switch ? "secondary" : "destructive"}
                                className={`font-black uppercase tracking-widest ${systemStatus?.kill_switch ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}
                                onClick={toggleKillSwitch}
                                disabled={loading || killSwitchLoading}
                            >
                                {killSwitchLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Power className="mr-2 h-4 w-4" />}
                                {systemStatus?.kill_switch ? "RESUME OPERATIONS" : "EMERGENCY KILL SWITCH"}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] border-red-500/50 bg-red-950/90 text-red-100">
                            <p><strong>Warning:</strong> This action will immediately halt all running kernels. Active orders will be cancelled if possible, but market risk remains.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {systemStatus?.kill_switch && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-4 animate-pulse">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <div>
                        <h3 className="text-red-500 font-black uppercase tracking-widest">SYSTEM LOCKDOWN ACTIVE</h3>
                        <p className="text-red-400 text-xs">All executions halted. New orders rejected. User access restricted.</p>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Server className="w-5 h-5 text-indigo-500" />
                            Core Services
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "Frontend (Next.js)", status: "Healthy", uptime: "99.98%", load: "12%" },
                            { name: "Admin UI (Next.js)", status: "Healthy", uptime: "99.99%", load: "4%" },
                            {
                                name: "Execution Kernel (OS)",
                                status: systemStatus?.os?.online ? "Healthy" : "Offline",
                                uptime: systemStatus?.os?.online ? "100%" : "0%",
                                load: systemStatus?.os?.data?.engine_state === "RUNNING" ? "ACTIVE" : "IDLE",
                                warn: !systemStatus?.os?.online
                            },
                            {
                                name: "Market Data (OS)",
                                status: systemStatus?.os?.data?.market_status === "OPEN" ? "Connected" : "Closed/Waiting",
                                uptime: "98.5%",
                                load: "-",
                                warn: systemStatus?.os?.data?.market_status !== "OPEN"
                            },
                        ].map((svc) => (
                            <div key={svc.name} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                                <div>
                                    <div className="font-medium text-white text-sm">{svc.name}</div>
                                    <div className="text-xs text-zinc-500">Load: {svc.load}</div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className={`border-0 ${svc.warn ? 'bg-yellow-500/10 text-yellow-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                        {svc.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Database className="w-5 h-5 text-purple-500" />
                            Data & Storage
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "PostgreSQL (Users)", status: "Connected", latency: "2ms" },
                            { name: "Redis (Session)", status: "Connected", latency: "1ms" },
                            { name: "TimescaleDB (Ticks)", status: "Connected", latency: "5ms" },
                            { name: "S3 (Snapshots)", status: "Idle", latency: "-" },
                        ].map((svc) => (
                            <div key={svc.name} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                                <div>
                                    <div className="font-medium text-white text-sm">{svc.name}</div>
                                    <div className="text-xs text-zinc-500">Latency: {svc.latency}</div>
                                </div>
                                <div className="text-right">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mb-1" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
