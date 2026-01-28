"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldX, RefreshCw } from "lucide-react";
import { HelpTooltip } from "../ui/help-tooltip";
import tooltips from "@/config/tooltips.json";

interface BrokerStatusCardProps {
    isConnected: boolean;
    brokerName?: string;
    onReconnect: () => void;
}

export function BrokerStatusCard({ isConnected, brokerName, onReconnect }: BrokerStatusCardProps) {
    return (
        <Card className="bg-zinc-950 border-zinc-900 overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isConnected ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                        {isConnected ? (
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        ) : (
                            <ShieldX className="w-5 h-5 text-rose-500" />
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                            Broker Health <HelpTooltip text={isConnected ? tooltips["dashboard.status.connected"] : tooltips["dashboard.status.disconnected"]} />
                        </p>
                        <h4 className="text-sm font-bold text-white">
                            {isConnected ? `${brokerName} Connected` : 'Broker Disconnected'}
                        </h4>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 text-[9px] uppercase font-black">
                        Read-Only
                    </Badge>
                    <button
                        onClick={onReconnect}
                        className="p-1.5 hover:bg-zinc-900 rounded-md transition-colors text-zinc-500"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
