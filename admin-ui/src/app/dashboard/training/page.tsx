"use client";

import { useEffect, useState } from "react";
import { Download, Database, HardDrive, Lock } from "lucide-react";

export default function TrainingPage() {
    const [stats, setStats] = useState({ total_records: 0, pending: 0, labeled: 0 });
    const [downloading, setDownloading] = useState(false);

    // Fetch Stats from Backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Pointing to SaaS Backend (Port 4100)
                const res = await fetch('http://91.98.226.5:4100/api/v1/admin/training/stats', {
                    headers: { 'x-user-role': 'ADMIN' }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setStats({
                        total_records: data.stats.total,
                        pending: data.stats.accepted,
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
        setTimeout(() => {
            alert("Secure CSV Export initiated.");
            setDownloading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    AI Training Datasets
                    <span className="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">BETA</span>
                </h1>
                <p className="text-zinc-400">Manage immutable training logs for future model development.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-6">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-zinc-400">Total Records</h3>
                        <Database className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{stats.total_records}</div>
                        <p className="text-xs text-zinc-500">From verified signals</p>
                    </div>
                </div>
                <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-6">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-zinc-400">Storage Usage</h3>
                        <HardDrive className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">~42 KB</div>
                        <p className="text-xs text-zinc-500">Local JSONL (Compressed)</p>
                    </div>
                </div>
                <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-6">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-zinc-400">Governance</h3>
                        <Lock className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-amber-500">LOCKED</div>
                        <p className="text-xs text-zinc-500">Immutable Write-Only Mode</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">Export Controls</h3>
                </div>
                <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-zinc-200">Daily Training Log (JSONL)</h4>
                            <p className="text-sm text-zinc-500">Raw signal events including metadata and validation scores.</p>
                        </div>
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            {downloading ? 'Preparing...' : (
                                <span className="flex items-center gap-2">
                                    <Download size={16} /> Export CSV
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
