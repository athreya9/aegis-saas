"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { ArrowRight, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { RiskDisclosureModal } from "@/components/auth/risk-disclosure-modal"
import { AegisLogo } from "@/components/ui/aegis-logo"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [localLoading, setLocalLoading] = useState(false)
    const [showRiskModal, setShowRiskModal] = useState(false)
    const { login, isLoading } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalLoading(true)
        // Simulate validation
        setTimeout(() => {
            setLocalLoading(false)
            setShowRiskModal(true)
        }, 600)
    }

    const handleRiskAccept = async () => {
        setShowRiskModal(false)
        await login(email)
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 relative isolate overflow-hidden">
            {/* Rich Gradient Background for Glass Effect */}
            <div className="absolute inset-0 z-[-1]">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-800/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-800/20 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            {/* Back to Home Navigation */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white rotate-180 transition-colors" />
                    </div>
                    Back to Main
                </Link>
            </div>

            <RiskDisclosureModal
                isOpen={showRiskModal}
                onAccept={handleRiskAccept}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-[90%] max-w-[400px] space-y-8 relative z-10 p-8 rounded-2xl border border-white/15 shadow-[0_0_60px_-15px_rgba(255,255,255,0.1)] backdrop-blur-[20px] backdrop-saturate-[180%] bg-white/[0.08]"
            >
                <div className="text-center space-y-2">
                    <div className="mx-auto flex items-center justify-center mb-6">
                        <AegisLogo size={80} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Welcome to Aegis</h1>
                    <p className="text-[13px] text-muted-foreground font-medium uppercase tracking-widest">Access the Aegis Terminal</p>

                    {/* Demo Access Note */}
                    <div className="mt-4 p-3 rounded bg-blue-500/10 border border-blue-500/20 text-center">
                        <p className="text-[11px] text-blue-300 font-mono mb-1">PREVIEW ACCESS ATTACHED</p>
                        <div className="text-[10px] text-zinc-400">
                            User: <span className="text-white font-bold select-all">demo@aegis.local</span><br />
                            Pass: <span className="text-white font-bold select-all">Demo@123</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest pl-1">E-mail Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-11 bg-black border border-[#222] rounded-lg px-4 focus:border-white transition-colors text-[14px] font-medium placeholder:text-muted-foreground/30"
                            placeholder="user@aegis.app"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest pl-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full h-11 bg-black border border-[#222] rounded-lg px-4 focus:border-white transition-colors text-[14px] font-medium placeholder:text-muted-foreground/30"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        variant="linear"
                        className="w-full h-11 bg-white text-black hover:bg-white/90 font-black text-[14px] uppercase tracking-widest italic"
                        disabled={isLoading || localLoading}
                    >
                        {localLoading || isLoading ? "Verifying Credentials..." : "Standard Sign In"} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-2 px-1">
                        <div className="flex-1 h-[1px] bg-white/[0.05]" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Or</span>
                        <div className="flex-1 h-[1px] bg-white/[0.05]" />
                    </div>

                    <Button
                        variant="outline"
                        className="w-full h-11 border-[#222] hover:bg-white/5 font-black text-[13px] uppercase tracking-widest"
                        type="button"
                    >
                        <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center mr-2">
                            <Lock size={10} className="text-white" />
                        </div>
                        Authorize via SSO
                    </Button>
                </form>

                <p className="text-center text-[12px] text-muted-foreground font-medium">
                    Don&apos;t have access?{" "}
                    <Link href="/signup" className="text-white hover:underline">Request Account</Link>
                </p>
            </motion.div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
        </div>
    )
}
