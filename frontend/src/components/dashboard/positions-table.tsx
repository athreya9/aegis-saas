"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const positions = {
    NIFTY: [
        { symbol: "NIFTY 21500 CE", qty: 50, avg: 142.20, ltp: 168.45, pnl: 1312, side: "BUY" },
        { symbol: "NIFTY 21450 PE", qty: 50, avg: 88.10, ltp: 42.05, pnl: -2302, side: "BUY" },
    ],
    BANKNIFTY: [
        { symbol: "BANKNIFTY 48000 PE", qty: 15, avg: 312.45, ltp: 298.10, pnl: -215, side: "SELL" },
    ],
    SENSEX: [
        { symbol: "SENSEX 72000 CE", qty: 10, avg: 640.00, ltp: 710.20, pnl: 702, side: "BUY" },
    ]
}

type Instrument = keyof typeof positions;

export function OpenPositionsTable() {
    const [activeTab, setActiveTab] = useState<Instrument>("NIFTY");

    return (
        <div className="vercel-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[#111] flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <h3 className="text-sm font-bold text-white tracking-tight">Open Positions</h3>
                    <div className="flex gap-2">
                        {(["NIFTY", "BANKNIFTY", "SENSEX"] as Instrument[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTab === tab
                                        ? "bg-white text-black"
                                        : "bg-[#111] text-zinc-500 hover:text-white"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <Badge variant="outline" className="border-[#222] text-[10px] font-bold">LIVE FEED</Badge>
            </div>
            <div className="overflow-x-auto min-h-[200px]">
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
                        {positions[activeTab].map((pos, i) => (
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
                        {positions[activeTab].length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 text-xs uppercase tracking-widest">
                                    No open positions in {activeTab}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
