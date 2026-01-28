
'use client'; // Client Component

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, AlertTriangle, Activity, Lock, Terminal, Settings } from "lucide-react";

export default function TelegramControlPage() {
    // const { config } = useConfig(); // REMOVED dependency
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [logs, setLogs] = useState<any[]>([
        { time: '10:30', symbol: 'NIFTY25000CE', status: 'ACCEPTED', msg: 'Buy Signal' },
        { time: '10:15', symbol: 'BANKNIFTY59000PE', status: 'REJECTED', msg: 'Low Confidence' }
    ]);

    const fetchStatus = async () => {
        try {
            const res = await fetch('http://91.98.226.5:4100/api/v1/admin/telegram/status', {
                headers: { 'x-user-role': 'ADMIN' }
            });
            const data = await res.json();
            setStatus(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleEnable = async () => {
        setActionLoading(true);
        try {
            const res = await fetch('http://91.98.226.5:4100/api/v1/admin/telegram/enable', {
                method: 'POST',
                headers: { 'x-user-role': 'ADMIN' }
            });
            if (res.ok) fetchStatus();
            else alert((await res.json()).message);
        } catch (e) { alert("Network Error"); }
        finally { setActionLoading(false); }
    };

    const handleDisable = async () => {
        if (!confirm("⚠️ This stops all external signal ingestion.\nExisting trades are unaffected.\nThis action is audited.")) return;

        setActionLoading(true);
        try {
            const res = await fetch('http://91.98.226.5:4100/api/v1/admin/telegram/disable', {
                method: 'POST',
                headers: { 'x-user-role': 'ADMIN' }
            });
            if (res.ok) fetchStatus();
            else alert((await res.json()).message);
        } catch (e) { alert("Network Error"); }
        finally { setActionLoading(false); }
    };

    // Last Toggle Info Mock
    const lastToggle = { user: 'admin_123', time: '2 mins ago', action: status?.enabled ? 'ENABLED' : 'DISABLED' };

    return (
        <div className="p-6 space-y-6 bg-black min-h-screen text-gray-100">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-blue-500" />
                        Telegram Signal Control
                    </h1>
                    <p className="text-gray-400">Governance & Safety Panel</p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                        Controlled by Core Trading OS
                    </Badge>
                    <Badge variant={status?.enabled ? "default" : "destructive"}>
                        {status?.enabled ? "BROADCAST ACTIVE" : "BROADCAST DISABLED"}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Status & Actions */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-500" />
                            Live System Status
                        </CardTitle>
                        <CardDescription>Real-time connection to Execution Kernel (Port 8080)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-between items-center bg-black/20 p-4 rounded-lg">
                            <div className="space-y-1">
                                <div className="text-sm text-gray-400">OS Connectivity</div>
                                <div className="font-mono text-green-400 font-bold">{status?.status === 'UNKNOWN' ? '🟡 UNKNOWN' : '✅ CONNECTED'}</div>
                            </div>
                            <div className="space-y-1 text-right">
                                <div className="text-sm text-gray-400">Signals Today</div>
                                <div className="font-mono text-blue-400 font-bold">15</div>
                            </div>
                        </div>

                        <div className="text-xs text-zinc-500 font-mono text-center">
                            State Managed by Kernel Configuration
                        </div>

                        <Alert className="bg-blue-500/10 border-blue-900 text-blue-400">
                            <Lock className="h-4 w-4" />
                            <div className="ml-2">
                                <AlertTitle>Read-Only Mode</AlertTitle>
                                <AlertDescription>
                                    To change broadcast settings, modify the Kernel Runtime Config on the VPS directly. SaaS Admin cannot override Core Safety controls.
                                </AlertDescription>
                            </div>
                        </Alert>
                    </CardContent>
                </Card>

                {/* Configuration */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-purple-500" />
                            Active Channels (Read Only)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {['@TraderAlerts', '@OptionGuru'].map((c, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-zinc-950 rounded border border-zinc-800 opacity-75">
                                    <span className="font-mono text-sm">{c}</span>
                                    <Badge variant="secondary" className="text-xs">Linked via OS</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Signal Logs */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-gray-500" />
                        Audit Trail & Signals
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-black p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto space-y-2">
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-4 border-b border-zinc-900 pb-1">
                                <span className="text-gray-500">{log.time}</span>
                                <span className="text-yellow-400">{log.symbol}</span>
                                <span className={log.status === 'ACCEPTED' ? 'text-green-500' : 'text-red-500'}>
                                    {log.status}
                                </span>
                                <span className="text-gray-400 text-xs">- {log.msg}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
