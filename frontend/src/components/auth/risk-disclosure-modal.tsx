"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, AlertTriangle, CheckCircle2, ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RiskDisclosureModalProps {
    isOpen: boolean
    onAccept: () => void
}

export function RiskDisclosureModal({ isOpen, onAccept }: RiskDisclosureModalProps) {
    const [canAccept, setCanAccept] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
            // Allow acceptance if scrolled to within 50px of the bottom
            if (scrollHeight - scrollTop - clientHeight < 50) {
                setCanAccept(true)
            }
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Deep Blur Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-[25px]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,163,255,0.2)] overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 shrink-0">
                                <Shield className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">Risk Disclosure & Platform Governance</h2>
                                <p className="text-sm text-zinc-400 mt-1">
                                    By proceeding, you acknowledge that Aegis is a provider of technology, not financial advice.
                                </p>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20"
                        >
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                        <h3 className="text-sm font-semibold text-yellow-500 uppercase tracking-wider">No Profit Guarantee</h3>
                                    </div>
                                    <p className="text-sm text-zinc-300 leading-relaxed">
                                        Aegis is a tool for execution and risk management; it does not guarantee financial gain. Past performance of any algorithm or tool is not indicative of future results. Markets are unpredictable and using automation does not eliminate the risk of loss.
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                        <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider">Capital at Risk</h3>
                                    </div>
                                    <p className="text-sm text-zinc-300 leading-relaxed">
                                        Users acknowledge that trading financial instruments involves a substantial risk of loss. You should only trade with capital you can afford to lose. Leverage can work against you as well as for you.
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ScrollText className="w-4 h-4 text-blue-500" />
                                        <h3 className="text-sm font-semibold text-blue-500 uppercase tracking-wider">Liability Shield</h3>
                                    </div>
                                    <p className="text-sm text-zinc-300 leading-relaxed">
                                        Aegis is not responsible for losses incurred due to market volatility, exchange failures, API latency, broker downtime, or user-defined strategy errors. You retain full responsibility for all execution parameters set within the terminal.
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg border border-white/5 bg-white/[0.02]">
                                    <h3 className="text-sm font-semibold text-white mb-2">Technical Acknowledgment</h3>
                                    <p className="text-sm text-zinc-400">
                                        I understand that Aegis operates as a client-side execution interface. My credentials and API keys are stored locally or in session memory and are used solely for routing my orders to my chosen broker.
                                    </p>
                                </div>
                                <div className="h-4"></div> {/* Spacer to ensure scroll triggers */}
                            </div>
                        </div>

                        {/* Footer / Action */}
                        <div className="p-6 border-t border-white/10 bg-white/[0.02] flex flex-col gap-3">
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${canAccept ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-700 bg-zinc-900'}`}>
                                    {canAccept && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {canAccept
                                        ? "Thank you for reviewing the risk disclosure."
                                        : "Please scroll to the bottom of the disclosure to proceed."}
                                </p>
                            </div>

                            <Button
                                onClick={onAccept}
                                disabled={!canAccept}
                                className={`w-full h-12 font-bold tracking-wider uppercase transition-all duration-300 ${canAccept
                                        ? 'bg-[#00A3FF] hover:bg-[#0088D4] text-white shadow-[0_0_20px_rgba(0,163,255,0.4)]'
                                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    }`}
                            >
                                I Understand & Accept
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
