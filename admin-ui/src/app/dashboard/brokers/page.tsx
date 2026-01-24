"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function BrokersPage() {
    const [connections, setConnections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllStatus = async () => {
            try {
                const res = await fetch('http://91.98.226.5:4100/api/v1/control/all-status');
                const data = await res.json();
                if (data.status === 'success') {
                    const mapped = data.data.map((s: any) => ({
                        user: s.userId,
                        broker: s.brokerConnected ? "Zerodha Kite" : "None",
                        status: s.brokerConnected ? "Connected" : "Disconnected",
                        expires: s.sessionExpiresAt ? new Date(s.sessionExpiresAt).toLocaleTimeString() : "-",
                        error: !s.brokerConnected
                    }));
                    setConnections(mapped);
                }
                setLoading(false);
            } catch (e) {
                console.error("Admin Fetch Error:", e);
                setLoading(false);
            }
        };
        fetchAllStatus();
        const interval = setInterval(fetchAllStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    const brokerStats = [
        { name: "Zerodha Kite", status: "Operational", latency: "24ms" },
        { name: "Angel One", status: "Operational", latency: "45ms" },
        { name: "Upstox", status: "Maintenance", latency: "ERR" },
        { name: "Interactive Brokers", status: "Operational", latency: "110ms" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Brokers & API</h1>
                <p className="text-zinc-400">Monitor broker connectivity and user API token status.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {brokerStats.map((broker) => (
                    <Card key={broker.name} className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">{broker.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className={`text-lg font-bold ${broker.status === 'Maintenance' ? 'text-yellow-500' : 'text-emerald-500'}`}>
                                    {broker.status}
                                </span>
                                {broker.status === 'Operational' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">Avg Latency: {broker.latency}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">User Broker Connections</CardTitle>
                    <CardDescription className="text-zinc-400">Live API token status across the user base.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? <div className="text-zinc-500 py-4">Scanning connections...</div> :
                            connections.map((conn, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-zinc-800 last:border-0 pb-4 last:pb-0">
                                    <div>
                                        <p className="font-medium text-white">{conn.user}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Badge variant="secondary" className="text-[10px] h-5 bg-zinc-800 text-zinc-400">{conn.broker}</Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`flex items-center gap-1 justify-end text-sm ${conn.error ? "text-red-400" : conn.status === 'Pending' ? "text-yellow-400" : "text-emerald-400"}`}>
                                            {conn.status}
                                        </div>
                                        <div className="text-xs text-zinc-600">Token Expires: {conn.expires}</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
