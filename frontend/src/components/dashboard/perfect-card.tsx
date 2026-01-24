"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PositionCardProps {
    symbol: string;
    side: "BUY" | "SELL";
    qty: number;
    ltp: number;
    pnl: number;
    pnlPercent: number;
}

export function PerfectPositionCard({
    symbol = "NIFTY 25JAN 21500 CE",
    side = "BUY",
    qty = 50,
    ltp = 142.20,
    pnl = 885.00,
    pnlPercent = 14.2
}: Partial<PositionCardProps>) {
    const isProfit = pnl >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="vercel-card relative overflow-hidden p-6 group flex flex-col justify-between h-full bg-[#030303] border-[#1a1a1a] hover:border-[#333] transition-all duration-300"
        >
            {/* Background Noise Layer */}
            <div className="absolute inset-0 noise-overlay opacity-[0.03] pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between mb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[16px] tracking-tight group-hover:text-white transition-colors">{symbol}</h3>
                        <Badge className={cn(
                            "px-1.5 py-0 text-[9px] uppercase font-black rounded-sm border-0",
                            side === "BUY" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                        )}>
                            {side}
                        </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em] flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-emerald-500" /> NSE • {qty} QTY • INSTRUMENT
                    </p>
                </div>
                <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
                    <MoreHorizontal size={16} className="text-muted-foreground/40" />
                </button>
            </div>

            <div className="relative z-10 space-y-6">
                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Price / LTP</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black tracking-tighter italic">₹{ltp.toFixed(2)}</span>
                            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                                <Zap size={10} fill="currentColor" /> LIVE
                            </span>
                        </div>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Unrealized P&L</p>
                        <div className={cn(
                            "text-xl font-black font-mono tracking-tighter flex items-center justify-end gap-1.5",
                            isProfit ? "text-emerald-500" : "text-rose-500"
                        )}>
                            {isProfit ? "+" : ""}₹{pnl.toLocaleString()}
                            <div className={cn(
                                "px-1 py-0.5 rounded text-[10px] items-center",
                                isProfit ? "bg-emerald-500/10" : "bg-rose-500/10"
                            )}>
                                {pnlPercent}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-5 border-t border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-1.5">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-5 w-5 rounded-full border border-[#030303] bg-[#111] flex items-center justify-center">
                                    <span className="text-[8px] font-bold">V{i}</span>
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-bold">Strategy: Apex_Scalp_3.0</span>
                    </div>
                    <Button variant="ghost" className="h-7 text-[10px] font-black uppercase text-white hover:bg-white/5 px-2">
                        Details <ArrowUpRight size={12} className="ml-1" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
