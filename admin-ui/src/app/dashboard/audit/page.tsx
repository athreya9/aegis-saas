import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AuditPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Audit Log</h1>
                <p className="text-zinc-400">Immutable record of all admin actions and system events.</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-0">
                    <div className="h-[600px] overflow-y-auto custom-scrollbar">
                        <div className="divide-y divide-zinc-800">
                            {[
                                { action: "USER_APPROVED", target: "demo@aegis.com", admin: "admin@aegis.com", time: "2026-01-22 14:02:11", ip: "10.0.0.5" },
                                { action: "PLAN_UPDATED", target: "sarah@fund.io", admin: "admin@aegis.com", time: "2026-01-22 13:45:00", ip: "10.0.0.5" },
                                { action: "SYSTEM_ALERT", target: "Market Data Latency", admin: "SYSTEM", time: "2026-01-22 12:30:22", ip: "Internal", warn: true },
                                { action: "LOGIN_SUCCESS", target: "admin@aegis.com", admin: "-", time: "2026-01-22 09:00:01", ip: "192.168.1.1" },
                                { action: "USER_CREATED", target: "new_user@test.com", admin: "-", time: "2026-01-21 23:11:05", ip: "45.33.22.11" },
                                { action: "PAYMENT_RECEIVED", target: "Tx_99283AA", admin: "Stripe Webhook", time: "2026-01-21 23:12:00", ip: "Webhook" },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={`font-mono text-[10px] ${log.warn ? 'text-red-400 border-red-500/20' : 'text-zinc-400 border-zinc-700'}`}>
                                                {log.action}
                                            </Badge>
                                            <span className="text-sm text-zinc-300 font-medium">{log.target}</span>
                                        </div>
                                        <div className="text-xs text-zinc-500">
                                            by <span className="text-zinc-400">{log.admin}</span> via {log.ip}
                                        </div>
                                    </div>
                                    <div className="text-xs font-mono text-zinc-600">
                                        {log.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
