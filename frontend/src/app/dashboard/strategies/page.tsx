"use client"

import { useStrategies, Strategy } from "@/hooks/use-strategies"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, TrendingUp, Activity, Lock } from "lucide-react"

export default function StrategiesPage() {
    const { strategies, isLoading, error } = useStrategies()

    if (isLoading) {
        return <div className="p-8 text-zinc-500">Loading Strategies...</div>
    }

    if (error) {
        return <div className="p-8 text-red-500">Error: {error}</div>
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Strategy Marketplace</h1>
                <p className="text-zinc-400"> proven algorithmic strategies. Subscribe to automate execution.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategies.map((strategy) => (
                    <Card key={strategy.id} className="bg-[#0A0A0A] border-zinc-800 flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">
                                    {strategy.risk_profile} RISK
                                </Badge>
                                <Shield className="w-4 h-4 text-zinc-500" />
                            </div>
                            <CardTitle className="text-xl text-white">{strategy.name}</CardTitle>
                            <CardDescription className="text-zinc-500 min-h-[40px]">{strategy.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                                    <p className="text-xs text-zinc-500 mb-1">Win Rate</p>
                                    <p className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        {strategy.win_rate}
                                    </p>
                                </div>
                                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                                    <p className="text-xs text-zinc-500 mb-1">Max Drawdown</p>
                                    <p className="text-lg font-bold text-red-400 flex items-center gap-1">
                                        <Activity className="w-3 h-3" />
                                        {strategy.drawdown}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {strategy.tags.map(tag => (
                                    <span key={tag} className="text-[10px] bg-zinc-900 px-2 py-1 rounded text-zinc-400 border border-zinc-800">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-zinc-800 pt-4">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                                <Lock className="w-3 h-3 mr-2" />
                                Subscribe to View Logic
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
