"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Terminal as TerminalIcon, Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const mockLogs = [
    "[09:15:02] INITIALIZING EXECUTION KERNEL v4.2.1",
    "[09:15:05] CONNECTING TO BROKER: KITE-ZERODHA... SUCCESS",
    "[09:15:10] SCANNING NSE:NIFTY50 ENTRIES...",
    "[09:22:45] SIGNAL DETECTED: RELIANCE (VOLATILITY BREAKOUT)",
    "[09:22:48] VALIDATING RISK PARAMETERS... PASSED",
    "[09:22:50] ORDER PLACED: BUY 100 RELIANCE @ 2740.00",
    "[09:22:52] ORDER FILLED: 100/100 @ 2740.15",
    "[09:30:15] HEARTBEAT: KERNEL STATUS=HEALTHY, LATENCY=24ms",
    "[10:05:32] TRAILING SL UPDATED: RELIANCE -> 2732.50",
    "[10:15:00] P&L SNAPSHOT: +$1,240.50 (UNREALIZED)",
];

export default function TerminalPage() {
    const [logs, setLogs] = useState(mockLogs);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        const interval = setInterval(() => {
            const time = new Date().toLocaleTimeString('en-GB');
            const newLog = `[${time}] HEARTBEAT: CPU=12%, MEM=42%, LATENCY=18ms`;
            setLogs(prev => [...prev.slice(-19), newLog]);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full flex flex-col space-y-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Terminal</h1>
                <p className="text-muted-foreground">Low-level execution logs and kernel telemetry.</p>
            </div>

            <Card className="flex-1 bg-black text-emerald-400 font-mono text-sm overflow-hidden border-zinc-800">
                <CardHeader className="border-b border-zinc-800 bg-zinc-900/50 py-3 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TerminalIcon size={16} />
                        <span className="text-xs uppercase font-bold text-zinc-400">aegis_kernel_logs</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span>UPTIME: 04:32:15</span>
                        <Search size={14} className="cursor-pointer hover:text-zinc-300 transition-colors" />
                    </div>
                </CardHeader>
                <CardContent
                    ref={scrollRef}
                    className="p-6 h-[calc(100vh-320px)] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-zinc-800"
                >
                    {logs.map((log, i) => (
                        <div key={i} className="opacity-90 hover:opacity-100 transition-opacity">
                            <span className="text-emerald-600 mr-2">{">"}</span> {log}
                        </div>
                    ))}
                    <div className="animate-pulse inline-block w-2 h-4 bg-emerald-400 ml-1 translate-y-1" />
                </CardContent>
            </Card>
        </div>
    );
}
