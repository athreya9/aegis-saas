"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Database, HardDrive, Lock } from "lucide-react";

export default function DatasetPage() {
    const [stats, setStats] = useState({ total_records: 0, pending: 0, labeled: 0 });
    const [downloading, setDownloading] = useState(false);

    // Fetch Stats from Backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://91.98.226.5:4100/api/v1/admin/training/stats', {
                    headers: { 'x-user-role': 'ADMIN' }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setStats({
                        total_records: data.stats.total,
                        pending: data.stats.accepted, // accepted but outcome pending
                        labeled: data.stats.pnl_total
                    });
                }
            } catch (e) {
                console.error("Failed to fetch dataset stats");
            }
        };
        fetchStats();
    }, []);

    const handleDownload = () => {
        setDownloading(true);
        // Simulate download delay
        setTimeout(() => {
            alert("Secure CSV Export initiated. Check server local storage.");
            setDownloading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    AI Training Datasets
                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10">BETA</Badge>
                </h1>
                <p className="text-muted-foreground">Manage immutable training logs for future model development.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#0A0A0A] border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Records</CardTitle>
                        <Database className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.total_records}</div>
                        <p className="text-xs text-zinc-500">+12 from last ingestion</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0A0A0A] border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Storage Usage</CardTitle>
                        <HardDrive className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">42 KB</div>
                        <p className="text-xs text-zinc-500">Local JSONL (Compressed)</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0A0A0A] border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Governance</CardTitle>
                        <Lock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">LOCKED</div>
                        <p className="text-xs text-zinc-500">Immutable Write-Only Mode</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-[#0A0A0A] border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-white">Export Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-zinc-200">Daily Training Log (JSONL)</h4>
                            <p className="text-sm text-zinc-500">Raw signal events including metadata and validation scores.</p>
                        </div>
                        <Button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {downloading ? 'Preparing...' : (
                                <span className="flex items-center gap-2">
                                    <Download size={16} /> Export CSV
                                </span>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
