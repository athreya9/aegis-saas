"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Activity,
    GitBranch,
    Globe,
    MoreHorizontal,
    Search,
    Settings,
    Filter,
    ArrowUpRight,
    Clock,
    Github,
    Shield
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

import { MarketScanner } from "@/components/dashboard/market-scanner"
import { RiskHeatmap } from "@/components/dashboard/risk-heatmap"
import { SystemHealthCard } from "@/components/dashboard/system-health"
import { HeroMetricsBar } from "@/components/dashboard/hero-metrics-bar"
import { BrokerStatusCard } from "@/components/broker/broker-status-card"
import { BrokerConnectModal } from "@/components/broker/broker-connect-modal"
import { RiskControlCard } from "@/components/dashboard/risk-control-card"
import { RiskDisclaimer } from "@/components/dashboard/risk-disclaimer"
import React, { useState, useEffect } from "react"

export default function DashboardPage() {
    const { user } = useAuth();
    const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
    const [brokerStatus, setBrokerStatus] = useState<any>(null);
    const [executionMode, setExecutionMode] = useState<'SANDBOX' | 'REQUESTED' | 'LIVE'>('SANDBOX');

    // Fetch Broker Status
    const fetchStatus = async () => {
        try {
            const res = await fetch('http://91.98.226.5:4100/api/v1/broker/status');
            const data = await res.json();
            if (data.status === 'success') {
                setBrokerStatus(data.data);
                if (data.data.executionMode) {
                    setExecutionMode(data.data.executionMode);
                }
            }
        } catch (e) {
            console.error("Broker Status Fetch Fail");
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleConnect = async (brokerId: string, credentials: Record<string, string>) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100';
            const res = await fetch(`${baseUrl}/api/v1/broker/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user?.id || 'default_user'
                },
                body: JSON.stringify({
                    brokerName: brokerId,
                    credentials
                })
            });

            if (res.ok) {
                fetchStatus();
            } else {
                throw new Error("Connection failed");
            }
        } catch (e) {
            console.error("Connect Failed", e);
            throw e;
        }
    };
    return (
        <div className="">
            <div className="container mx-auto max-w-7xl px-6 py-8 space-y-8">

                {/* Subscription Warning */}
                {user?.status !== "ACTIVE" && (
                    <div className="">
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                                <div>
                                    <h4 className="text-[12px] font-black text-amber-500 uppercase tracking-tight">Subscription Action Required</h4>
                                    <p className="text-[12px] text-zinc-400 font-medium">
                                        {user?.status === "PENDING_PAYMENT"
                                            ? "Your account is inactive. Complete payment to start trading."
                                            : "Your Institutional plan will expire in 2 days. Renew to avoid edge-execution interruptions."}
                                    </p>
                                </div>
                            </div>
                            <Button asChild variant="outline" className="h-8 text-[10px] font-black uppercase tracking-widest border-amber-500/20 text-amber-500 hover:bg-amber-500/10">
                                <Link href={`/payment?plan=managed&email=${user?.email}`}>Renew Plan</Link>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Top Metrics Bar */}
                <HeroMetricsBar />

                {/* Risk Disclaimer */}
                <RiskDisclaimer />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                                <input
                                    className="w-full h-10 bg-white/[0.02] border border-white/5 rounded-lg pl-10 pr-4 text-sm text-white placeholder:text-zinc-700 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    placeholder="Search active strategies..."
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="h-10 bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.05] font-mono text-[10px] uppercase tracking-widest px-4 rounded-lg">
                                    <Filter className="w-3 h-3 mr-2" />
                                    Filter
                                </Button>
                                <Button className="h-10 bg-primary text-white hover:bg-primary/90 font-black text-[10px] uppercase tracking-widest px-6 rounded-lg shadow-lg shadow-primary/20">
                                    Deploy Strategy
                                </Button>
                            </div>
                        </div>

                        {/* Strategy Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 border border-white/5 rounded-lg bg-[#0a0a0a] text-center">
                                <p className="text-zinc-500 text-sm">No Active Strategies Deployed</p>
                                <Button variant="link" className="text-primary text-xs mt-2">Browse Marketplace</Button>
                            </div>
                        </div>

                        {/* Large Heatmap / Metrics Area */}
                        <div className="h-[450px]">
                            <RiskHeatmap />
                        </div>
                    </div>

                    {/* Sidebar Area - The "Live Control" Column */}
                    <div className="lg:col-span-3 space-y-6">
                        <RiskControlCard />

                        <BrokerStatusCard
                            isConnected={brokerStatus?.brokerConnected}
                            brokerName={brokerStatus?.brokerName}
                            onReconnect={() => setIsBrokerModalOpen(true)}
                        />

                        <div className="h-[400px]">
                            <MarketScanner />
                        </div>

                        <SystemHealthCard />
                    </div>
                </div>

                <div className="mt-8 flex justify-center border-t border-white/5 pt-8">
                    <Button variant="link" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all">
                        Access Full Strategy Ledger <ArrowUpRight className="ml-1 w-3 h-3" />
                    </Button>
                </div>
            </div>

            <BrokerConnectModal
                isOpen={isBrokerModalOpen}
                onClose={() => setIsBrokerModalOpen(false)}
                onConnect={handleConnect}
                executionMode={executionMode}
            />
        </div>
    )
}
