"use client";

import { Navbar } from "@/components/layout/navbar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Key, Shield, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";

export default function BrokerIntegrationPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <Navbar />

            <main className="pt-32 pb-20 container mx-auto px-6 max-w-5xl">

                {/* Header */}
                <div className="mb-16">
                    <Badge variant="outline" className="mb-4 border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                        Documentation
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Connect Your Broker to Aegis</h1>
                    <p className="text-xl text-zinc-400 max-w-2xl">
                        Aegis connects to your existing brokerage account via API. You retain custody of your funds at all times.
                    </p>
                </div>

                {/* Integration Steps */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                <Key className="text-indigo-500" />
                                1. Generate API Keys
                            </h2>
                            <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                                You need to log in to your broker's developer portal and create a new App to get your <code className="bg-[#111] px-1 py-0.5 rounded text-white">API Key</code> and <code className="bg-[#111] px-1 py-0.5 rounded text-white">API Secret</code>.
                            </p>

                            <div className="space-y-4">
                                {/* Zerodha Card */}
                                <Card className="bg-[#111] border-[#222]">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-500/10 rounded flex items-center justify-center text-blue-500 font-bold">K</div>
                                            <div>
                                                <h4 className="font-medium text-white">Zerodha (Kite Connect)</h4>
                                                <p className="text-xs text-zinc-500">Cost: ₹2000/mo (paid to Zerodha)</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" asChild className="text-xs border-[#333] hover:bg-[#222]">
                                            <Link href="https://kite.trade/" target="_blank">Get API Key</Link>
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Angel One Card */}
                                <Card className="bg-[#111] border-[#222]">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-orange-500/10 rounded flex items-center justify-center text-orange-500 font-bold">A</div>
                                            <div>
                                                <h4 className="font-medium text-white">Angel One (SmartAPI)</h4>
                                                <p className="text-xs text-zinc-500">Cost: Free</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" asChild className="text-xs border-[#333] hover:bg-[#222]">
                                            <Link href="https://smartapi.angelbroking.com/" target="_blank">Get API Key</Link>
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Upstox Card */}
                                <Card className="bg-[#111] border-[#222]">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-purple-500/10 rounded flex items-center justify-center text-purple-500 font-bold">U</div>
                                            <div>
                                                <h4 className="font-medium text-white">Upstox API</h4>
                                                <p className="text-xs text-zinc-500">Cost: Free</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" asChild className="text-xs border-[#333] hover:bg-[#222]">
                                            <Link href="https://upstox.com/developer/api-documentation/" target="_blank">Get API Key</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                <Shield className="text-emerald-500" />
                                2. Configure Aegis
                            </h2>
                            <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                                <h3 className="text-lg font-medium text-white mb-4">Secure Credentials Vault</h3>
                                <p className="text-sm text-zinc-400 mb-6">
                                    Once logged into the Aegis Dashboard, navigate to <span className="text-white">Settings &rarr; Broker API</span>.
                                </p>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-zinc-500 uppercase">Broker</label>
                                        <div className="h-9 w-full bg-[#111] border border-[#333] rounded px-3 flex items-center text-sm text-white">Zerodha (Kite)</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-zinc-500 uppercase">API Key</label>
                                        <div className="h-9 w-full bg-[#111] border border-[#333] rounded px-3 flex items-center text-sm text-zinc-500 font-mono">abcdef123456...</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-zinc-500 uppercase">API Secret</label>
                                        <div className="h-9 w-full bg-[#111] border border-[#333] rounded px-3 flex items-center text-sm text-zinc-500 font-mono">••••••••••••••••</div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-2 text-xs text-emerald-500">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Credentials stored in encrypted vault (AES-256).</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* FAQ / Common Issues */}
                <div className="border-t border-white/10 pt-16">
                    <h2 className="text-2xl font-semibold mb-8">Common Questions</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-medium text-white mb-2">How often do I need to re-authenticate?</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Most brokers (like Zerodha) require a daily login. Aegis provides a "1-Click Login" on your dashboard every morning to refresh the session.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium text-white mb-2">Can I intervene manually?</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Yes. Since you are using your own broker, you can always open your broker's app to close positions manually if needed. Aegis will sync the status.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium text-white mb-2">Is my capital safe?</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Aegis never touches your funds. We only send execution signals. Your capital remains safe in your registered bank-linked brokerage account.
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
