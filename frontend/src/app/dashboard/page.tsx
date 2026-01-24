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

export default function DashboardPage() {
    const { user } = useAuth();
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
                                    <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-tighter">Subscription Action Required</h4>
                                    <p className="text-[11px] text-zinc-500">
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
                            {[
                                { name: "alpha-nifty-trend", status: "Production", env: "Live", branch: "main", time: "2m ago", commit: "Optimized entry triggers" },
                                { name: "banknifty-scalper-v2", status: "Development", env: "Paper", branch: "dev", time: "1h ago", commit: "Slippage protection v2" },
                                { name: "option-writing-theta", status: "Production", env: "Live", branch: "main", time: "4h ago", commit: "Delta selection" },
                            ].map((strategy, i) => (
                                <Card key={i} className="group bg-[#0a0a0a] border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 hover:text-white cursor-pointer" />
                                    </div>
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-white/[0.03] border border-white/5 group-hover:border-primary/20 transition-colors">
                                                <div className={`w-2 h-2 rounded-full ${strategy.status === 'Production' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xs font-black text-white uppercase tracking-tight">
                                                    {strategy.name}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase">{strategy.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pb-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-[10px]">
                                                <span className="text-zinc-600 font-bold uppercase tracking-widest">Environment</span>
                                                <span className="text-zinc-300 font-mono">{strategy.env}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[10px]">
                                                <span className="text-zinc-600 font-bold uppercase tracking-widest">Runtime</span>
                                                <span className="text-emerald-500 font-mono font-black">STABLE</span>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-0 border-t border-white/[0.03] py-3 bg-white/[0.01] flex items-center justify-between text-[9px] text-zinc-500">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-2.5 h-2.5" />
                                            <span>{strategy.time}</span>
                                        </div>
                                        <div className="font-mono uppercase tracking-tighter opacity-50">{strategy.commit.substring(0, 15)}...</div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        {/* Large Heatmap / Metrics Area */}
                        <div className="h-[450px]">
                            <RiskHeatmap />
                        </div>
                    </div>

                    {/* Sidebar Area - The "Live Control" Column */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="h-[600px]">
                            <MarketScanner />
                        </div>

                        <Card className="bg-[#0a0a0a] border-white/5 overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Risk Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-bold text-[10px] uppercase tracking-widest">
                                        Balanced
                                    </Badge>
                                    <Shield className="w-4 h-4 text-zinc-800" />
                                </div>
                                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                                    Baseline mandate. High-probability trend execution with strict ATR-based volatility scaling.
                                </p>
                            </CardContent>
                            <CardFooter className="bg-primary/[0.02] border-t border-white/5 py-3">
                                <p className="text-[9px] text-zinc-700 font-black uppercase tracking-tighter">
                                    Locked during live session.
                                </p>
                            </CardFooter>
                        </Card>

                        <SystemHealthCard />
                    </div>
                </div>

                <div className="mt-8 flex justify-center border-t border-white/5 pt-8">
                    <Button variant="link" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-all">
                        Access Full Strategy Ledger <ArrowUpRight className="ml-1 w-3 h-3" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
