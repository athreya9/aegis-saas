import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-300 selection:bg-indigo-500/30">
            <Navbar />
            <div className="container mx-auto px-6 pt-24 pb-20 max-w-4xl">
                <div className="flex justify-end mb-4">
                    <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-zinc-400">
                        <Link href="/">
                            <X className="w-6 h-6" />
                        </Link>
                    </Button>
                </div>
                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Data Isolation Architecture</h2>
                        <p>
                            Aegis employs a strict "Zero-Knowledge" architecture regarding your trading strategies.
                            Your execution logic runs in ephemeral containers that are contractually and technically isolated from our core telemetry.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Broker Credentials</h2>
                        <p>
                            API keys and secrets (e.g., Zerodha Kite Connect, Angel One SmartAPI) are <strong className="text-white">never stored</strong> on our persistent servers.
                            They are injected into the execution runtime at session start and wiped from memory upon session termination.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Telemetry & Analytics</h2>
                        <p>
                            We collect system health metrics (latency, error rates, throughput) to maintain the integrity of the Aegis Runtime.
                            We do <strong className="text-white">not</strong> analyze your P&L, alpha factors, or specific trade signals for commercial purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Client-Side Encryption</h2>
                        <p>
                            All sensitive configuration data stored in the browser (localStorage) is meant for your convenience.
                            Aegis is not responsible for the security of your local device. We recommend using Full Disk Encryption on your trading workstation.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
