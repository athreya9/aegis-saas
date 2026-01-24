"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    XCircle
} from "lucide-react";

export default function PositionsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Active Positions</h1>
                    <p className="text-muted-foreground">Manage and monitor your live market exposure.</p>
                </div>
                <Button variant="destructive" className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" /> Panic Exit All
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Instrument</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Side</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Qty</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Entry Price</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">LTP</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">P&L</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {[
                                { symbol: "NIFTY 25JAN 21500 CE", side: "BUY", qty: 50, entry: "124.50", ltp: "142.20", pnl: "+$885.00", status: "profit" },
                                { symbol: "BANKNIFTY 25JAN 45000 PE", side: "SELL", qty: 25, entry: "310.20", ltp: "305.10", pnl: "+$127.50", status: "profit" },
                                { symbol: "RELIANCE", side: "BUY", qty: 100, entry: "2,740.00", ltp: "2,735.00", pnl: "-$500.00", status: "loss" },
                            ].map((pos, i) => (
                                <tr key={i} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-medium">{pos.symbol}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={pos.side === "BUY" ? "success" : "destructive"} className="px-2 py-0">
                                            {pos.side}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">{pos.qty}</td>
                                    <td className="px-6 py-4">{pos.entry}</td>
                                    <td className="px-6 py-4 font-mono">{pos.ltp}</td>
                                    <td className={cn(
                                        "px-6 py-4 font-bold flex items-center gap-1",
                                        pos.status === "profit" ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        {pos.status === "profit" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                        {pos.pnl}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
