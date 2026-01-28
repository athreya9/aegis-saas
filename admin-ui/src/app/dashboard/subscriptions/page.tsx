"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SubscriptionsPage() {
    const [stats, setStats] = useState<any[]>([]);
    const [recent, setRecent] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://91.98.226.5:4100/api/v1/admin/users', {
                    headers: { 'x-user-role': 'ADMIN' }
                });
                const data = await res.json();

                if (data.status === 'success') {
                    // Aggregate Plan Stats
                    const planCounts = data.data.reduce((acc: any, u: any) => {
                        const plan = u.plan_type || "STARTER";
                        acc[plan] = (acc[plan] || 0) + 1;
                        return acc;
                    }, {});

                    setStats([
                        { name: "Starter", price: "₹2,999", users: planCounts["STARTER"] || 0, revenue: `₹${((planCounts["STARTER"] || 0) * 2.99).toFixed(1)}L`, growth: "-" },
                        { name: "Pro", price: "₹7,999", users: planCounts["PRO"] || 0, revenue: `₹${((planCounts["PRO"] || 0) * 7.99).toFixed(1)}L`, growth: "-" },
                        { name: "Institutional", price: "Custom", users: planCounts["ENTERPRISE"] || 0, revenue: "₹0L", growth: "-" },
                    ]);

                    // Recent Events (Mocked from creation date for now)
                    setRecent(data.data.slice(0, 5).map((u: any) => ({
                        user: u.email,
                        plan: u.plan_type || "STARTER",
                        event: "Active",
                        date: new Date(u.created_at).toLocaleDateString()
                    })));
                }
            } catch (e) {
                console.error("Failed to fetch sub stats");
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Subscriptions</h1>
                <p className="text-zinc-400">Manage pricing tiers and user subscriptions.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((plan) => (
                    <Card key={plan.name} className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-md font-medium text-white">{plan.name}</CardTitle>
                            <Badge variant="outline" className="border-emerald-500/20 text-emerald-500">{plan.price}/mo</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{plan.users} Users</div>
                            <p className="text-xs text-zinc-500 mt-1">
                                Est. Revenue: <span className="text-zinc-300">{plan.revenue}</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Active Subscriptions</CardTitle>
                    <CardDescription className="text-zinc-400">Recent subscription events and expirations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recent.map((sub, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-zinc-800 last:border-0 pb-4 last:pb-0">
                                <div>
                                    <p className="font-medium text-white">{sub.user}</p>
                                    <p className="text-sm text-zinc-500">{sub.plan} Plan</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm ${sub.error ? "text-red-400" : "text-emerald-400"}`}>
                                        {sub.event}
                                    </div>
                                    <div className="text-xs text-zinc-600">{sub.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
