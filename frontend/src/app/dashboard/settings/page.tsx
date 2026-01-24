"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Bell, User, Key, CreditCard } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "security", label: "Security", icon: Lock },
        { id: "api", label: "Broker API", icon: Key },
        { id: "billing", label: "Billing", icon: CreditCard },
        { id: "notifications", label: "Alerts", icon: Bell },
    ];

    return (
        <div className="container mx-auto max-w-5xl px-6 py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? "bg-white/5 text-white border border-white/10"
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Main Content */}
                <main className="flex-1 space-y-6">
                    {activeTab === "profile" && (
                        <Card className="bg-[#0a0a0a] border-[#222]">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Profile Settings</CardTitle>
                                <CardDescription className="text-zinc-500">Update your account information and public identity.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Display Name</Label>
                                    <Input defaultValue={user?.name} className="bg-black border-[#222]" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Email Address</Label>
                                    <Input defaultValue={user?.email} disabled className="bg-black border-[#222] opacity-50 cursor-not-allowed" />
                                </div>
                                <Button className="bg-white text-black hover:bg-zinc-200">Save Changes</Button>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "security" && (
                        <Card className="bg-[#0a0a0a] border-[#222]">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Security & Authentication</CardTitle>
                                <CardDescription className="text-zinc-500">Manage your password and two-factor authentication.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Current Password</Label>
                                    <Input type="password" placeholder="••••••••" className="bg-black border-[#222]" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="bg-black border-[#222]" />
                                </div>
                                <div className="pt-4 border-t border-[#222] flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                                        <p className="text-xs text-zinc-500">Add an extra layer of security to your account.</p>
                                    </div>
                                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5">Recommended</Badge>
                                </div>
                                <Button className="bg-white text-black hover:bg-zinc-200">Update Security</Button>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "api" && (
                        <Card className="bg-[#0a0a0a] border-[#222]">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Broker API Connectivity</CardTitle>
                                <CardDescription className="text-zinc-500">Configure your broker API keys for automated execution.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
                                    <Shield className="w-5 h-5 text-indigo-500 shrink-0" />
                                    <p className="text-xs text-indigo-100/80 leading-relaxed">
                                        API keys are encrypted using AES-256 at the hardware level. Aegis never stores your broker login credentials.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">API Key</Label>
                                        <Input value="**************************" readOnly className="bg-black border-[#222]" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">API Secret</Label>
                                        <Input value="**************************" readOnly className="bg-black border-[#222]" />
                                    </div>
                                </div>
                                <Button variant="outline" className="border-[#222] text-white hover:bg-white/5">Regenerate Keys</Button>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "billing" && (
                        <Card className="bg-[#0a0a0a] border-[#222]">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Subscription & Billing</CardTitle>
                                <CardDescription className="text-zinc-500">Manage your automation plan and payment methods.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-5 h-5 text-emerald-500" />
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase tracking-tighter">Institutional Plan</p>
                                            <p className="text-[10px] text-zinc-500">Active until Jan 25, 2026</p>
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" size="sm" className="h-8 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">
                                        <Link href="/payment?plan=managed&email=demo@aegis.local">Renew Plan</Link>
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-mono uppercase text-zinc-600 tracking-widest">Recent Invoices</p>
                                    <div className="divide-y divide-[#222]">
                                        {[
                                            { date: "Dec 25, 2025", amount: "₹4,999", status: "Paid" },
                                            { date: "Nov 25, 2025", amount: "₹4,999", status: "Paid" },
                                        ].map((inv, i) => (
                                            <div key={i} className="py-3 flex justify-between items-center text-xs">
                                                <span className="text-zinc-400">{inv.date}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-mono text-white">{inv.amount}</span>
                                                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 px-2 py-0 text-[9px] uppercase">{inv.status}</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>
        </div>
    );
}
