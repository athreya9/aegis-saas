import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SubscriptionsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Subscriptions</h1>
                <p className="text-zinc-400">Manage pricing tiers and user subscriptions.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { name: "Starter", price: "₹2,999", users: 142, revenue: "₹4.2L", growth: "+12%" },
                    { name: "Pro", price: "₹7,999", users: 89, revenue: "₹7.1L", growth: "+8%" },
                    { name: "Institutional", price: "Custom", users: 12, revenue: "₹18.5L", growth: "+2%" },
                ].map((plan) => (
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
                        {[
                            { user: "alex@vertex.com", plan: "Pro", event: "Renewed", date: "2 mins ago" },
                            { user: "sarah@fund.io", plan: "Institutional", event: "Upgraded", date: "1 hour ago" },
                            { user: "mike@trader.net", plan: "Starter", event: "Payment Failed", date: "3 hours ago", error: true },
                            { user: "jason@quant.lab", plan: "Pro", event: "Renewed", date: "5 hours ago" },
                        ].map((sub, i) => (
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
