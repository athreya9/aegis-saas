"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, ShieldCheck, Lock, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RiskSettingsPage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto px-6 py-8 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                        <ShieldAlert className="text-primary w-8 h-8" />
                        Risk Compliance Shield
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium font-mono uppercase tracking-widest italic">Institutional perimeter management • Variance Hardened</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <span className="block text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-1">Protection Level</span>
                        <div className="flex items-center gap-2 justify-end">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-black text-emerald-500 uppercase tracking-widest">Harden-v3</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Daily Drawdown Limit", val: "2.0%", icon: Shield, status: "Locked" },
                    { label: "Max Position Size", val: "50 QTY", icon: Lock, status: "Active" },
                    { label: "Global Volatility Filter", val: "ATR-2x", icon: ShieldCheck, status: "Active" },
                ].map((risk, i) => (
                    <Card key={i} className="bg-[#050505] border-white/5 p-6 hover:bg-white/[0.01] transition-all cursor-default">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center">
                                <risk.icon size={16} className="text-primary" />
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-800 hover:text-white"><MoreHorizontal className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{risk.label}</span>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-mono font-black">{risk.val}</span>
                                <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest ${risk.status === 'Locked' ? 'border-amber-500/20 text-amber-500' : 'border-emerald-500/20 text-emerald-500'}`}>{risk.status}</Badge>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="bg-[#050505] border-white/5 overflow-hidden">
                <CardHeader className="bg-white/[0.02] border-b border-white/5 py-6">
                    <CardTitle className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-zinc-600" />
                        Institutional Risk Profiles
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Conservative", desc: "Minimal exposure focus. ATR-1x scaling. High cash reserves.", stats: "Max DD: 1%", icon: ShieldCheck, color: "text-emerald-500" },
                            { name: "Balanced", desc: "Core Aegis mandate. Optimal variance weighting. Standard scaling.", stats: "Max DD: 2.5%", icon: Shield, color: "text-primary" },
                            { name: "Active", desc: "Aggressive trending capture. ATR-3x scaling. Dynamic sizing.", stats: "Max DD: 5%", icon: ShieldAlert, color: "text-orange-500" },
                        ].map((profile, i) => (
                            <div key={i} className={`p-6 rounded-xl border ${i === 1 ? 'border-primary/40 bg-primary/[0.02]' : 'border-white/5 bg-white/[0.01]'} space-y-4 hover:border-white/20 transition-all cursor-pointer group`}>
                                <profile.icon className={`w-8 h-8 ${profile.color}`} />
                                <div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-tight">{profile.name}</h4>
                                    <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed font-medium">{profile.desc}</p>
                                </div>
                                <div className="pt-2">
                                    <span className="text-[10px] font-mono font-black text-zinc-600 uppercase font-black">{profile.stats}</span>
                                </div>
                                {i === 1 && <Badge className="bg-primary text-white font-black text-[8px] uppercase tracking-widest px-2 py-0.5">Active Perimeter</Badge>}
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="bg-white/[0.02] border-t border-white/5 py-4 flex justify-center">
                    <p className="text-[9px] text-zinc-600 font-mono italic font-bold">Profile switching is restricted during live market cycles. Node reset required.</p>
                </CardFooter>
            </Card>
        </div>
    );
}
