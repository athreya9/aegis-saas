import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Server, Database, Shield, Cpu } from "lucide-react"

export default function SystemPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">System Status</h1>
                <p className="text-zinc-400">Real-time health monitoring of Aegis Infrastructure.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Server className="w-5 h-5 text-indigo-500" />
                            Core Services
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "Frontend (Next.js)", status: "Healthy", uptime: "99.98%", load: "12%" },
                            { name: "Admin UI (Next.js)", status: "Healthy", uptime: "99.99%", load: "4%" },
                            { name: "Execution Kernel (Rust)", status: "Healthy", uptime: "100%", load: "45%" },
                            { name: "Market Data Feeder", status: "Degraded", uptime: "98.5%", load: "88%", warn: true },
                        ].map((svc) => (
                            <div key={svc.name} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                                <div>
                                    <div className="font-medium text-white text-sm">{svc.name}</div>
                                    <div className="text-xs text-zinc-500">Load: {svc.load}</div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className={`border-0 ${svc.warn ? 'bg-yellow-500/10 text-yellow-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                        {svc.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Database className="w-5 h-5 text-purple-500" />
                            Data & Storage
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "PostgreSQL (Users)", status: "Connected", latency: "2ms" },
                            { name: "Redis (Session)", status: "Connected", latency: "1ms" },
                            { name: "TimescaleDB (Ticks)", status: "Connected", latency: "5ms" },
                            { name: "S3 (Snapshots)", status: "Idle", latency: "-" },
                        ].map((svc) => (
                            <div key={svc.name} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                                <div>
                                    <div className="font-medium text-white text-sm">{svc.name}</div>
                                    <div className="text-xs text-zinc-500">Latency: {svc.latency}</div>
                                </div>
                                <div className="text-right">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mb-1" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
