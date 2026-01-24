"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RiskDisclosureModal } from "@/components/auth/risk-disclosure-modal"
import { AegisLogo } from "@/components/ui/aegis-logo"

import { Suspense } from "react"

function SignupContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const plan = searchParams.get("plan")

    const [email, setEmail] = useState("")
    const [broker, setBroker] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showRiskModal, setShowRiskModal] = useState(false)

    // Form Submit -> Opens Modal
    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!broker || !email) return

        setIsLoading(true)
        // Simulate minor delay
        setTimeout(() => {
            setIsLoading(false)
            setShowRiskModal(true)
        }, 500)
    }

    // Modal Accepted -> Redirect
    const handleRiskAccept = () => {
        setShowRiskModal(false)
        router.push(`/payment?plan=${plan}&email=${encodeURIComponent(email)}&broker=${encodeURIComponent(broker)}`)
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src="/aegis-bg.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>

            <RiskDisclosureModal
                isOpen={showRiskModal}
                onAccept={handleRiskAccept}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center mb-6">
                        <AegisLogo size={80} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Establish Your Trading Perimeter</h1>
                    <p className="text-sm text-zinc-300 font-medium max-w-[360px] mx-auto leading-relaxed">
                        Secure your Aegis node to access institutional-grade risk management.
                    </p>
                </div>

                {/* Glass Container */}
                <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-[20px] shadow-2xl">
                    <form onSubmit={handleInitialSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase text-zinc-400 tracking-widest pl-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full h-12 bg-black/40 border border-white/10 rounded-lg px-4 focus:border-[#00A3FF] focus:ring-1 focus:ring-[#00A3FF] transition-all text-sm font-medium text-white placeholder:text-zinc-600 outline-none"
                                placeholder="Aegis Trader"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase text-zinc-400 tracking-widest pl-1">Working Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 bg-black/40 border border-white/10 rounded-lg px-4 focus:border-[#00A3FF] focus:ring-1 focus:ring-[#00A3FF] transition-all text-sm font-medium text-white placeholder:text-zinc-600 outline-none"
                                placeholder="trader@firm.com"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase text-zinc-400 tracking-widest pl-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full h-12 bg-black/40 border border-white/10 rounded-lg px-4 focus:border-[#00A3FF] focus:ring-1 focus:ring-[#00A3FF] transition-all text-sm font-medium text-white placeholder:text-zinc-600 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase text-zinc-400 tracking-widest pl-1">Confirm</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full h-12 bg-black/40 border border-white/10 rounded-lg px-4 focus:border-[#00A3FF] focus:ring-1 focus:ring-[#00A3FF] transition-all text-sm font-medium text-white placeholder:text-zinc-600 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase text-zinc-400 tracking-widest pl-1">Brokerage Interface</label>
                            <Select value={broker} onValueChange={setBroker} required>
                                <SelectTrigger className="w-full h-12 bg-black/40 border border-white/10 text-white focus:ring-[#00A3FF] focus:border-[#00A3FF]">
                                    <SelectValue placeholder="Select Institutional/Retail Broker" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                                    <SelectItem value="Zerodha">Zerodha Kite (Retail/API)</SelectItem>
                                    <SelectItem value="Angel One">Angel One SmartAPI</SelectItem>
                                    <SelectItem value="Interactive Brokers">Interactive Brokers (TWS)</SelectItem>
                                    <SelectItem value="Upstox">Upstox Uplink</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            variant="default"
                            className="w-full h-12 bg-[#00A3FF] hover:bg-[#0088D4] text-white font-bold text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(0,163,255,0.2)] mt-4"
                            disabled={isLoading}
                        >
                            {isLoading ? "Securing Session..." : "Initialize Access"}
                            {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10 flex flex-col items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                            Already an Institutional Partner? <span className="text-[#00A3FF]">Login</span>
                        </Link>
                        <Link href="/" className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Return to Terminal Home
                        </Link>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-600 uppercase tracking-wider font-bold">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span>256-bit Encryption</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-600 uppercase tracking-wider font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Secure Node</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <SignupContent />
        </Suspense>
    )
}
