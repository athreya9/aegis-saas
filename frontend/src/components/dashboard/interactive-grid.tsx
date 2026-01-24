"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, MoreVertical, Layers, BarChart3, Fingerprint } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const cards = [
    {
        title: "Portfolio Velocity",
        value: "+$4,240.50",
        description: "Net realized P&L across all connected brokers in the last 24h cycle.",
        trend: "+12.4%",
        positive: true,
        icon: BarChart3,
        tags: ["Live", "Aggressive"]
    },
    {
        title: "Margin Efficiency",
        value: "84.2%",
        description: "Capital utilization index across designated risk-weighted asset classes.",
        trend: "+2.1%",
        positive: true,
        icon: Layers,
        tags: ["Safe"]
    },
    {
        title: "Risk Exposure",
        value: "0.42β",
        description: "Market-relative volatility coefficient for the current active strategy set.",
        trend: "-0.5%",
        positive: false,
        icon: Fingerprint,
        tags: ["Neutral"]
    }
];

export function InteractiveCardGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="group relative"
                >
                    {/* Vercel-style glow effect on hover */}
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />

                    <div className="relative h-full glass rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-colors">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                                    <card.icon className="h-5 w-5 text-primary" />
                                </div>
                                <button className="text-muted-foreground hover:text-foreground transition-colors">
                                    <MoreVertical size={16} />
                                </button>
                            </div>

                            <h3 className="text-sm font-medium text-muted-foreground mb-1">{card.title}</h3>
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-3xl font-bold tracking-tight">{card.value}</span>
                                <span className={cn(
                                    "text-xs font-bold flex items-center",
                                    card.positive ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {card.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {card.trend}
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                {card.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {card.tags.map((tag, j) => (
                                <Badge key={j} variant="secondary" className="bg-white/[0.03] text-[10px] uppercase tracking-wider font-bold h-5 px-2">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
