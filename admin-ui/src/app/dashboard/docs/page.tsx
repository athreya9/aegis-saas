"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Shield, Layout } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Documentation</h1>
                <p className="text-zinc-400">System Blueprints and Operational Manuals.</p>
            </div>

            <Tabs defaultValue="os" className="w-full">
                <TabsList className="bg-zinc-900 border border-zinc-800">
                    <TabsTrigger value="os">Aegis Trading OS Blueprint</TabsTrigger>
                    <TabsTrigger value="saas">Aegis SaaS Architecture</TabsTrigger>
                </TabsList>

                <TabsContent value="os">
                    <Card className="bg-zinc-950 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-indigo-500" />
                                Aegis OS Whitepaper (Executive Summary)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose prose-invert max-w-none">
                            <h3>1. Core Philosophy</h3>
                            <p>Aegis OS is a deterministic execution kernel designed for professional algorithmic trading. It prioritizes capital preservation over profit maximization.</p>

                            <h3>2. Architecture</h3>
                            <ul>
                                <li><strong>Kernel (Port 8080)</strong>: Single-threaded event loop for order management.</li>
                                <li><strong>Plugins</strong>: Isolated modules for Strategy, Risk, and data ingestion.</li>
                                <li><strong>Heartbeat</strong>: 100ms watchdog timer that forces position flattening on stagnation.</li>
                            </ul>

                            <h3>3. Panic Protocol</h3>
                            <p>The OS accepts an "EMERGENCY_STOP" signal on <code>/api/os/panic</code>. This signal overrides all other logic, cancels orders, and halts the event loop.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="saas" className="mt-4 space-y-4">
                    <Card className="bg-[#050505] border-zinc-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-indigo-500" />
                                Investor & Compliance Architecture
                            </CardTitle>
                            <CardDescription>System design proving Regulatory Safety and Isolation.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                                <h3 className="text-sm font-bold text-zinc-300 mb-2">Revenue Model (Live)</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-2 border border-zinc-800 rounded bg-zinc-900">
                                        <div className="text-xs text-zinc-500 uppercase">Free</div>
                                        <div className="font-mono text-lg text-white">₹0</div>
                                        <div className="text-[10px] text-zinc-600">Paper Only</div>
                                    </div>
                                    <div className="p-2 border border-indigo-500/30 rounded bg-indigo-500/10">
                                        <div className="text-xs text-indigo-400 uppercase font-bold">Pro</div>
                                        <div className="font-mono text-lg text-white">₹5k</div>
                                        <div className="text-[10px] text-zinc-400">Live Algo</div>
                                    </div>
                                    <div className="p-2 border border-zinc-800 rounded bg-zinc-900">
                                        <div className="text-xs text-zinc-500 uppercase">Elite</div>
                                        <div className="font-mono text-lg text-white">₹15k</div>
                                        <div className="text-[10px] text-zinc-600">Inst. Speed</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 font-mono text-xs overflow-x-auto text-zinc-400">
                                <p className="mb-2 text-zinc-500 uppercase tracking-widest font-bold">Architecture Diagram Source</p>
                                <pre className="whitespace-pre-wrap text-zinc-500">{`graph TD
  User((User)) -->|HTTPS| CDN
  CDN --> Frontend
  Frontend -->|REST| Backend
  Backend -->|Auth| DB
  Backend -->|Risk| QuotaManager
  Backend -.->|Isolate| CoreOS(The Vault)`}
                                </pre>
                            </div>

                            <Button variant="outline" className="w-full">
                                <FileText className="w-4 h-4 mr-2" />
                                Download Full Investor Whitepaper (PDF)
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
