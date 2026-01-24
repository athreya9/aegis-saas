"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Server, Globe, Shield, Cloud } from "lucide-react";

export default function InfrastructurePage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto px-6 py-8 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                        <Server className="text-primary w-8 h-8" />
                        Infrastructure Cloud
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium font-mono uppercase tracking-widest italic leading-loose">Isolated Aegis-v3 perimeter • Proximity: Mumbai Core</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#050505] border-white/5 p-8 flex flex-col items-center text-center space-y-4">
                    <Globe className="w-12 h-12 text-zinc-800" />
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Reach</h3>
                    <p className="text-xs text-zinc-400 font-medium">Auto-scaling edge nodes across 12 institutional regions.</p>
                </Card>
                <Card className="bg-[#050505] border-white/5 p-8 flex flex-col items-center text-center space-y-4">
                    <Shield className="w-12 h-12 text-emerald-500" />
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Isolation Hardened</h3>
                    <p className="text-xs text-zinc-400 font-medium">Physical separation of order routing and private key storage.</p>
                </Card>
                <Card className="bg-[#050505] border-white/5 p-8 flex flex-col items-center text-center space-y-4">
                    <Cloud className="w-12 h-12 text-primary" />
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cloud Uptime</h3>
                    <p className="text-xs text-zinc-400 font-medium">99.999% SLA backed by multi-provider failover logic.</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#050505] border-white/5 p-6">
                    <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Cluster Node Health</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Node_Mumbai_01", cpu: "12%", status: "OPTIMAL" },
                            { name: "Node_London_Edge", cpu: "4%", status: "STANDBY" },
                            { name: "Node_Tokyo_Prox", cpu: "0.1%", status: "WARM" },
                        ].map((node, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white uppercase tracking-tight">{node.name}</span>
                                    <span className="text-[8px] font-mono text-zinc-600 font-black italic">{node.cpu} UTILIZATION</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1 h-1 rounded-full ${node.status === 'OPTIMAL' ? 'bg-emerald-500 pulsate' : 'bg-blue-500'}`} />
                                    <span className="text-[9px] font-black text-zinc-300 font-mono italic">{node.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="bg-[#050505] border-white/5 p-6 flex flex-col justify-center items-center text-center">
                    <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Instance Security Profile</h3>
                    <div className="p-8 rounded-full border border-dashed border-white/10 relative">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Shield className="text-emerald-500 w-8 h-8" />
                        </div>
                        <div className="absolute top-0 -right-2 px-2 py-0.5 rounded bg-emerald-500 text-black text-[8px] font-black uppercase font-black">Secure</div>
                    </div>
                    <p className="mt-6 text-[10px] text-zinc-600 uppercase font-black tracking-widest italic italic">Hardened by Aegis Sentry-v1 Protocol</p>
                </Card>
            </div>
        </div>
    );
}
