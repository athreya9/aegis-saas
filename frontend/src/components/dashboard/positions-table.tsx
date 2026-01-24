"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const positions = [
    { symbol: "NIFTY26120CE", qty: 50, avg: 142.20, ltp: 168.45, pnl: 1312, side: "BUY" },
    { symbol: "BANKNIFTY48000PE", qty: 15, avg: 312.45, ltp: 298.10, pnl: -215, side: "SELL" },
    { symbol: "RELIANCE24JANFUT", qty: 250, avg: 2840.00, ltp: 2855.20, pnl: 3800, side: "BUY" },
]

export function OpenPositionsTable() {
    return (
        <div className="vercel-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[#111] flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight">Open Positions</h3>
                <Badge variant="outline" className="border-[#222] text-[10px] font-bold">LIVE FEED</Badge>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-[#111] bg-white/[0.01]">
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Symbol</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Side</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Qty</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">LTP</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">P&L</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111]">
                        {positions.map((pos, i) => (
                            <tr key={i} className="group hover:bg-white/[0.01] transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-[13px] font-bold text-white">{pos.symbol}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[10px] font-black uppercase",
                                        pos.side === "BUY" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                    )}>
                                        {pos.side}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-[13px] font-mono text-muted-foreground">{pos.qty}</td>
                                <td className="px-6 py-4 text-right text-[13px] font-mono text-white">₹{pos.ltp.toFixed(2)}</td>
                                <td className={cn(
                                    "px-6 py-4 text-right text-[13px] font-black font-mono",
                                    pos.pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {pos.pnl >= 0 ? "+" : ""}₹{pos.pnl.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
