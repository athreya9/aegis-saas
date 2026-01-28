"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Activity, Users, Shield, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const fakeUsers = [
        { id: "USR-7732", name: "Vikram S.", plan: "Managed Automation", broker: "Zerodha", apiStatus: "Active", joined: "2 mins ago" },
        { id: "USR-8821", name: "Rahul D.", plan: "Self-Serve", broker: "Angel One", apiStatus: "Expired", joined: "1 hr ago" },
        { id: "USR-9904", name: "Ankit M.", plan: "Managed Automation", broker: "Zerodha", apiStatus: "Active", joined: "3 hrs ago" },
        { id: "USR-1120", name: "Priya K.", plan: "Self-Serve", broker: "Upstox", apiStatus: "Active", joined: "5 hrs ago" },
        { id: "USR-3321", name: "Amit B.", plan: "Self-Serve", broker: "Interactive Brokers", apiStatus: "Pending", joined: "1 day ago" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white tracking-tight">System Overview</h1>
                <div className="flex items-center gap-2">
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 animate-pulse">
                        <AlertTriangle className="h-3 w-3 mr-1" /> 2 Subscriptions Expiring Today
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="vercel-card bg-[#0a0a0a] border-[#222]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[12px] font-black tracking-wider text-zinc-500 uppercase">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-white" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white tracking-tighter">12</div>
                        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight">+12% from last week</p>
                    </CardContent>
                </Card>
                <Card className="vercel-card bg-[#0a0a0a] border-[#222]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[12px] font-black tracking-wider text-zinc-500 uppercase">Active APIs</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white tracking-tighter">8</div>
                        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight">Connected & Authorized</p>
                    </CardContent>
                </Card>
                <Card className="vercel-card bg-[#0a0a0a] border-[#222]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[12px] font-black tracking-wider text-zinc-500 uppercase">Recurring Rev</CardTitle>
                        <TrendingUp className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white tracking-tighter">₹42.5k</div>
                        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight">Monthly Run Rate</p>
                    </CardContent>
                </Card>
                <Card className="vercel-card bg-[#0a0a0a] border-[#222]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[12px] font-black tracking-wider text-zinc-500 uppercase">API Health</CardTitle>
                        <Activity className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white tracking-tighter">99.8%</div>
                        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight">Broker Connectivity</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 vercel-card bg-[#0a0a0a] border-[#222]">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Signups</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {fakeUsers.map((user, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-[#222] pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-black text-white uppercase tracking-tight leading-none">{user.name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[11px] text-zinc-500 font-mono font-bold tracking-tight">{user.id}</p>
                                            <span className="text-xs text-zinc-600">•</span>
                                            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-tight">{user.broker}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider mb-1 inline-block ${user.plan.includes("Managed") ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-white/5 text-zinc-500 border border-white/5"
                                            }`}>
                                            {user.plan}
                                        </div>
                                        <div className="flex items-center justify-end gap-1.5 mt-1">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.apiStatus === "Active" ? "bg-emerald-500" :
                                                user.apiStatus === "Pending" ? "bg-orange-500" : "bg-red-500"
                                                }`} />
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{user.apiStatus} API</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 vercel-card bg-[#0a0a0a] border-[#222]">
                    <CardHeader>
                        <CardTitle className="text-white">Broker Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Zerodha", count: 8, pct: "65%" },
                                { name: "Angel One", count: 2, pct: "15%" },
                                { name: "Interactive Brokers", count: 1, pct: "10%" },
                                { name: "Upstox", count: 1, pct: "10%" },
                            ].map((broker) => (
                                <div key={broker.name} className="flex items-center">
                                    <div className="w-full space-y-1">
                                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tight">
                                            <span className="text-zinc-400">{broker.name}</span>
                                            <span className="text-zinc-500 font-mono">{broker.count} users</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden">
                                            <div className="h-full bg-white/20" style={{ width: broker.pct }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
