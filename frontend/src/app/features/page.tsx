import { Button } from "@/components/ui/button"
import { Shield, Zap, Lock, Terminal, Activity, TrendingUp, Check } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { DemoPlayer } from "@/components/landing/demo-player"

export const dynamic = "force-static";

export default function FeaturesPage() {
    return (
        <div className="selection:bg-purple-500/30">
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-20 px-6 border-b border-white/5">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 text-white uppercase tracking-tighter">
                        Platform Architecture
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                        Aegis is an institutional-grade risk management runtime for algorithmic execution. Engineered for variance, governed by code.
                    </p>
                </div>
            </section>

            {/* Platform Walkthrough Section */}
            <section className="py-24 px-6 border-b border-white/5 bg-zinc-950/20">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-zinc-500 mb-4">Platform Walkthrough</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            Observe the institutional guardrails and real-time execution monitoring in this end-to-end frontend simulation.
                        </p>
                    </div>
                    <DemoPlayer
                        videoUrl="/demo-walkthrough.webp"
                        title="Aegis Feature Simulation"
                        caption="Institutional Risk Enforcement • Live Terminal Demo"
                    />
                </div>
            </section>

            {/* Core Mechanics */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-medium mb-4">Variance-Weighted Execution</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    Unlike standard boolean (Buy/Sell) systems, Aegis evaluates the market regime (Trend, Chop, Volatility) to determine <em>position sizing</em> dynamically. High conviction setups get full allocation; lower fidelity signals are dampened or rejected.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-medium mb-4">Risk-First Core</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    The execution kernel prioritizes capital preservation. If daily drawdown limits are approached, the system enters a "Halt State", rejecting all new orders and managing only exits. This hard-coded discipline prevents emotional override.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-medium mb-4">Institutional Connectivity</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    Aegis connects directly to exchange gateways via broker APIs (Kite Connect, SmartAPI, TWS). It minimizes latency by running a localized event loop, ensuring your strategy reacts to tick-data in milliseconds.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {[
                                { icon: Shield, title: "Capital Protection", desc: "Hard stops at -2% daily drawdown." },
                                { icon: Zap, title: "Latency Optimized", desc: "<50ms internal processing time." },
                                { icon: Terminal, title: "Headless Runtime", desc: "CLI-based control plane for stability." },
                                { icon: Activity, title: "Regime Detection", desc: "Adapt logic for Trending vs Ranging." },
                                { icon: Lock, title: "Isolated Context", desc: "Sandboxed strategy execution." },
                                { icon: TrendingUp, title: "Volatility Scaling", desc: "Position size adjusts to ATR." },
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-xl border border-white/10 bg-[#0A0A0A] hover:bg-[#111] transition-colors">
                                    <item.icon className="w-6 h-6 text-zinc-400 mb-4" />
                                    <h3 className="font-medium text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Risk Profiles Section */}
            <section className="py-24 px-6 border-b border-white/5">
                <div className="container mx-auto max-w-5xl">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-medium mb-6">Pre-Defined Risk Profiles</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            Aegis eliminates emotional bias by enforcing discipline through pre-defined technical presets. Instead of modifying raw numeric variables, users select a profile that matches their operational mandate. Aegis enforces risk controls automatically based on the selected profile.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Conservative",
                                tag: "Capital Preservation",
                                desc: "Prioritizes low drawdown and extreme filter discipline. Lower trade frequency with strict requirement for high-probability market regimes.",
                                features: ["Hard Drawdown Ceiling", "Primary Trend Alignment", "Low Frequency"]
                            },
                            {
                                title: "Balanced",
                                tag: "Standard Operation",
                                desc: "The baseline Aegis setting. Balanced trade frequency with standard volatility scaling and controlled operational flexibility.",
                                features: ["Moderate Vol Scaling", "Dynamic Regime Shift", "Standard Frequency"]
                            },
                            {
                                title: "Active",
                                tag: "High Engagement",
                                desc: "Designed for high-opportunity environments. Tighter monitoring with increased exposure to volatility-induced signals and faster reaction times.",
                                features: ["Intense Vol Sensitivity", "Rapid Signal Response", "Higher Frequency"]
                            }
                        ].map((profile, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-all group">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">{profile.tag}</div>
                                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{profile.title}</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed mb-8">{profile.desc}</p>
                                <ul className="space-y-3">
                                    {profile.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
                                            <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Section */}

            {/* CTA */}
            <section className="py-32 px-6 text-center">
                <h2 className="text-3xl font-medium mb-8">Deploy your perimeter.</h2>
                <div className="flex justify-center gap-4">
                    <Button asChild size="lg" className="h-12 px-8 bg-white text-black hover:bg-zinc-200 font-medium">
                        <Link href="/signup">Initialize Access</Link>
                    </Button>
                </div>
            </section>
        </div >
    )
}
