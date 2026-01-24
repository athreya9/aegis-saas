"use client"

import { HeroMetricsBar } from "./hero-metrics-bar"
import { SystemHealthCard } from "./system-health"
import { OpenPositionsTable } from "./positions-table"
import { motion } from "framer-motion"

export function DashboardPreview() {
    return (
        <div className="relative w-full max-w-5xl mx-auto mt-20 group">
            {/* Decorative Blur */}
            <div className="absolute -inset-4 bg-white/[0.02] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative vercel-card bg-[#000] border-[#111] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden"
            >
                <div className="p-1.5 border-b border-[#111] bg-[#050505] flex items-center gap-1.5 px-4 h-10">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="px-3 py-0.5 rounded-md bg-[#111] border border-[#222] text-[10px] text-muted-foreground font-medium">
                            aegis.app/dashboard
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 bg-[#000] max-h-[500px] overflow-hidden">
                    <div className="scale-90 origin-top">
                        <HeroMetricsBar />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-60">
                            <SystemHealthCard />
                            <OpenPositionsTable />
                        </div>
                    </div>
                </div>

                {/* Masking overlay for "preview" effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-transparent to-transparent pointer-events-none" />
            </motion.div>
        </div>
    )
}
