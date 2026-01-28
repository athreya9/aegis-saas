"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Zap, Shield, Laptop, Activity } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/context/auth-context";
import { PRICING_CONFIG } from "@/config/plans";

export default function PricingPage() {
    const { user } = useAuth();

    // Feature check
    if (!PRICING_CONFIG.LIVE_PRICING_ENABLED) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Pricing Updates in Progress...</p>
            </div>
        );
    }

    return (
        <div className="selection:bg-purple-500/30">
            <Navbar />

            <main className="pt-32 pb-20 container mx-auto px-6">

                {/* Workflow Section */}
                <div className="mb-32 max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-6 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest">
                            Activation Workflow
                        </Badge>
                        <h2 className="text-4xl font-medium tracking-tight mb-4">How Aegis Works</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            Aegis is an execution layer, not a brokerage. You retain custody of your funds at all times.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 relative">
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
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                        Three ways to use Aegis.
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                        Choose signal access, automation, or managed support — based on how hands-on you want to be.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
                    {PRICING_CONFIG.PLANS.map((plan) => (
                        <Card key={plan.id} className={`vercel-card bg-[#0a0a0a] border-[#222] flex flex-col relative overflow-hidden group hover:border-${plan.color}-500/30 transition-all ${plan.status === 'coming_soon' ? 'opacity-70 grayscale-[0.3]' : ''}`}>
                            <div className={`absolute top-0 inset-x-0 h-1 ${plan.color === 'emerald' ? 'bg-emerald-500' :
                                plan.color === 'amber' ? 'bg-amber-500' : 'bg-zinc-700'
                                }`} />
                            <CardHeader className="p-8 pb-4">
                                <Badge variant="outline" className={`w-fit mb-4 border-${plan.color === 'zinc' ? 'zinc-800' : plan.color + '-500/30'} text-${plan.color === 'zinc' ? 'zinc-500' : plan.color + '-400'} bg-${plan.color === 'zinc' ? 'transparent' : plan.color + '-500/10'} text-[11px] font-black uppercase tracking-widest px-3 py-1`}>
                                    {plan.label}
                                </Badge>
                                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">{plan.name}</h3>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl font-black text-white leading-none">{plan.priceDisplay}</span>
                                    {plan.status === 'active' && <span className="text-zinc-500 text-[12px] font-mono uppercase tracking-widest">/ month</span>}
                                </div>
                                {plan.id === 'managed' && (
                                    <p className="text-amber-500/80 text-[11px] font-mono uppercase tracking-wider mb-2">
                                        Available after controlled rollout
                                    </p>
                                )}
                                <p className="text-[13px] text-zinc-400 mt-4 leading-relaxed font-medium">
                                    {plan.description}
                                </p>
                            </CardHeader>
                            <CardContent className="p-8 flex-1 space-y-8">
                                {plan.sections.map((section, sIdx) => (
                                    <div key={sIdx} className="space-y-4">
                                        <h4 className={`text-[12px] font-black uppercase tracking-[0.2em] border-b border-white/5 pb-2 ${section.variant === 'negative' ? 'text-zinc-600' :
                                            section.variant === 'warning' ? 'text-amber-500' : 'text-zinc-400'
                                            }`}>
                                            {section.title}
                                        </h4>
                                        <ul className="space-y-3">
                                            {section.items.map((item, idx) => (
                                                <li key={idx} className={`flex items-start gap-3 text-[13px] ${section.variant === 'negative' ? 'text-zinc-600' :
                                                    section.variant === 'warning' ? 'text-zinc-300 font-semibold' : 'text-zinc-400'
                                                    }`}>
                                                    {section.variant === 'negative' ? (
                                                        <span className="text-zinc-800 shrink-0 mt-0.5">✕</span>
                                                    ) : section.variant === 'info' ? (
                                                        <span className="text-primary/50 shrink-0 mt-0.5">◇</span>
                                                    ) : (
                                                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.color === 'emerald' ? 'text-emerald-500' : 'text-zinc-600'
                                                            }`} />
                                                    )}
                                                    <span className="leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter className="p-8 pt-0">
                                <Button
                                    asChild={plan.status === 'active'}
                                    disabled={plan.status === 'coming_soon'}
                                    className={`w-full h-12 text-[12px] font-black uppercase tracking-widest transition-all ${plan.color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
                                        plan.color === 'amber' ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5' :
                                            'bg-white text-black hover:bg-zinc-200'
                                        }`}
                                >
                                    {plan.status === 'active' ? (
                                        <Link href={user ? `/payment?plan=${plan.id}` : plan.href}>
                                            {plan.cta}
                                        </Link>
                                    ) : (
                                        <span>{plan.cta}</span>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 max-w-4xl mx-auto">
                    <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-10 shadow-2xl">
                        <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-8 flex items-center gap-4">
                            <Shield className="w-4 h-4 text-emerald-500" /> Important Disclosures
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {PRICING_CONFIG.DISCLOSURES.map((disclosure, idx) => (
                                <li key={idx} className="text-[12px] text-zinc-400 flex items-start gap-4 leading-relaxed font-medium">
                                    <span className="text-zinc-700 font-mono font-bold">0{idx + 1}.</span>
                                    {disclosure}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-between items-center gap-6">
                            <div className="flex gap-6">
                                <Link href="/risk-disclosure" className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors underline decoration-zinc-800 underline-offset-8">Risk Disclosure</Link>
                                <Link href="/terms" className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors underline decoration-zinc-800 underline-offset-8">Terms of Service</Link>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-black uppercase tracking-widest bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
                                <Zap size={14} className="text-emerald-500 animate-pulse" /> UPI & QR PAYMENTS SUPPORTED
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
