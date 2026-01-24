"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Zap, Shield, ArrowRight, Laptop, Activity } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/context/auth-context";

export default function PricingPage() {
    const { user } = useAuth();
    return (
        <div className="selection:bg-purple-500/30">
            <Navbar />

            <main className="pt-32 pb-20 container mx-auto px-6">

                {/* How It Works Section */}
                <div className="mb-32 max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-6 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest">
                            Workflow
                        </Badge>
                        <h2 className="text-4xl font-medium tracking-tight mb-4">How Aegis Works</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            Aegis is an execution layer, not a brokerage. You retain custody of your funds at all times.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />

                        {[
                            { icon: Laptop, title: "1. Select Plan", desc: "Choose your automation level: Core or Managed." },
                            { icon: CheckCircle2, title: "2. Verify Identity", desc: "Complete KYC and link your verified broker account." },
                            { icon: Zap, title: "3. Connect API", desc: "Generate keys in your broker terminal and plug them into Aegis." },
                            { icon: Activity, title: "4. Live Execution", desc: "Aegis engine takes over. You monitor performance in real-time." }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-6 bg-black border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-[#111] border border-[#222] flex items-center justify-center mb-4 text-white z-10">
                                    <step.icon size={20} />
                                </div>
                                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing Plans */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                        Simple, transparent pricing.
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        No hidden fees. No profit guarantees. Just pure execution infrastructure.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* PLAN 1: Aegis Core */}
                    <Card className="vercel-card bg-[#0a0a0a] border-[#222] flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 inset-x-0 h-1 bg-zinc-800 group-hover:bg-white transition-colors" />
                        <CardHeader className="p-8 pb-4">
                            <h3 className="text-lg font-medium text-zinc-400 mb-2">Aegis Core</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">₹2,499</span>
                                <span className="text-zinc-500">/month</span>
                            </div>
                            <p className="text-sm text-zinc-500 mt-4 leading-relaxed">
                                Self-Serve Automation. Automated trading using the Aegis risk engine. You connect your own broker APIs and retain full account control.
                            </p>
                        </CardHeader>
                        <CardContent className="p-8 flex-1">
                            <ul className="space-y-4">
                                {[
                                    "Automated execution using Aegis rules",
                                    "User-managed broker API integration",
                                    "Real-time dashboard (P&L, margin, exposure)",
                                    "Full transparency and monitoring",
                                    "No profit guarantees",
                                    "No profit share"
                                ].map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                                        <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="p-8 pt-0">
                            {user ? (
                                <Button asChild className="w-full h-12 bg-[#111] text-white hover:bg-[#222] border border-[#333]">
                                    <Link href="/payment?plan=core&email={user.email}">
                                        Upgrade to Core
                                    </Link>
                                </Button>
                            ) : (
                                <Button asChild className="w-full h-12 bg-[#111] text-white hover:bg-[#222] border border-[#333]">
                                    <Link href="/signup?plan=core">
                                        Start Aegis Core
                                    </Link>
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    {/* PLAN 2: Aegis Managed */}
                    <Card className="vercel-card bg-[#0a0a0a] border-[#222] flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500" />
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-medium text-indigo-400 mb-2">Aegis Managed</h3>
                                <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                                    Assisted Mode
                                </Badge>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">₹4,999</span>
                                <span className="text-zinc-500">/month</span>
                            </div>
                            <p className="text-sm text-zinc-500 mt-4 leading-relaxed">
                                Assisted setup and operational support for Aegis automation, with optional performance-aligned pricing.
                            </p>
                        </CardHeader>
                        <CardContent className="p-8 flex-1">
                            <ul className="space-y-4">
                                {[
                                    "Everything in Aegis Core",
                                    "Assisted onboarding & configuration",
                                    "Ongoing monitoring and support",
                                    "Priority assistance",
                                    "Profit Share: 10% on Net Profits (Capped)",
                                    "No profit → No profit share"
                                ].map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm text-indigo-100/80">
                                        <Shield className="w-5 h-5 text-indigo-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="p-8 pt-0">
                            {user ? (
                                <Button asChild className="w-full h-12 bg-white text-black hover:bg-zinc-200">
                                    <Link href="/payment?plan=managed&email={user.email}">
                                        Request Managed Support
                                    </Link>
                                </Button>
                            ) : (
                                <Button asChild className="w-full h-12 bg-white text-black hover:bg-zinc-200">
                                    <Link href="/signup?plan=managed">
                                        Apply for Managed
                                    </Link>
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div className="mt-16 text-center border-t border-white/5 pt-8 max-w-2xl mx-auto">
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        <strong>Disclosure:</strong> Aegis is an automation platform. Trading involves risk. No profits are guaranteed. All automation follows predefined rules and risk limits.
                        <br /><br />
                        <Link href="/risk-disclosure" className="underline hover:text-white">Risk Disclosure</Link> • <Link href="/terms" className="underline hover:text-white">Terms of Service</Link>
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-600 font-mono">
                        <Zap size={12} /> UPI & QR Payments Supported
                    </div>
                </div>
            </main>
        </div>
    );
}
