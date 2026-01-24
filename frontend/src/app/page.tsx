"use client";

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ChevronRight, Zap, Target, Shield, BarChart3, Star, Command, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Hero3D } from "@/components/landing/hero-3d"
import { useAuth } from "@/context/auth-context"
import { DemoPlayer } from "@/components/landing/demo-player"

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="selection:bg-purple-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* ... (keep background effects) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none fade-in opacity-50" />
        <Hero3D />
        <div className="absolute inset-0 stars-bg pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          {/* ... (keep top badge) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-zinc-400 mb-8 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="flex items-center gap-1"><Star size={10} fill="currentColor" /> New Release</span>
            <div className="w-[1px] h-3 bg-white/10" />
            <span className="text-white flex items-center gap-1">Aegis 2.0 is live <ChevronRight size={12} /></span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 max-w-4xl mx-auto linear-gradient-text pb-2">
            Automate your<br />trading edge.
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Aegis is a modern execution environment for professional traders.
            Automate strategies, manage risk, and scale your operations without the friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Button asChild size="lg" className="h-12 px-8 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-sm transition-all hover:scale-105 active:scale-95">
                <Link href="/dashboard">Return to Dashboard <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="h-12 px-8 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-sm transition-all hover:scale-105 active:scale-95">
                <Link href="/signup">Start Trading <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            )}
            <Button variant="outline" size="lg" className="h-12 px-8 rounded-full border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 font-medium text-sm backdrop-blur-sm">
              Read Manifesto <Command className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Hero Image / Dashboard Preview */}
          <div className="mt-20 relative mx-auto max-w-5xl group perspective-1000">
            <div className="relative rounded-xl border border-white/10 bg-[#0B0C0E] shadow-2xl shadow-purple-900/20 overflow-hidden transform transition-all duration-700 hover:scale-[1.01] hover:border-white/20">
              {/* Browser Tab Bar */}
              <div className="h-10 border-b border-white/5 bg-[#050505] flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#1e1e1e]" />
                  <div className="w-3 h-3 rounded-full bg-[#1e1e1e]" />
                  <div className="w-3 h-3 rounded-full bg-[#1e1e1e]" />
                </div>
              </div>
              {/* Fake UI Content */}
              <div className="aspect-[16/9] w-full bg-black/50 p-8 grid grid-cols-4 gap-6">
                <div className="col-span-1 border border-white/5 rounded-lg bg-white/[0.02] p-4 flex flex-col gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20" />
                  <div className="w-2/3 h-2 rounded-full bg-white/10" />
                  <div className="w-1/2 h-2 rounded-full bg-white/10" />
                  <div className="mt-auto w-full h-8 rounded bg-white/5" />
                </div>
                <div className="col-span-3 grid grid-cols-2 gap-4">
                  <div className="border border-white/5 rounded-lg bg-white/[0.02] p-6">
                    <div className="text-2xl font-bold font-mono text-white mb-2">₹12.40L</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Equity Curve</div>
                  </div>
                  <div className="border border-white/5 rounded-lg bg-white/[0.02] p-6">
                    <div className="text-2xl font-bold font-mono text-emerald-500 mb-2">+42.0%</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">YTD Return</div>
                  </div>
                  <div className="col-span-2 h-40 border border-white/5 rounded-lg bg-white/[0.02] flex items-end p-4 gap-2">
                    {[40, 65, 55, 80, 45, 70, 90, 60, 75, 50, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-sm hover:bg-indigo-500/40 transition-colors" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
              {/* Glow Overlay on Image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>
          </div>

        </div>
      </section>

      {/* Product Demo Section */}
      <section className="py-24 border-y border-white/5 bg-black relative">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full scale-50 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 px-6">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 text-white uppercase tracking-tighter">See Aegis in Action</h2>
            <p className="text-zinc-500 text-lg leading-relaxed">
              Experience the full end-to-end institutional workflow—from discovery and onboarding to the unlocked trading dashboard.
            </p>
          </div>
          <DemoPlayer videoUrl="/demo-walkthrough.webp" />
        </div>
      </section>

      {/* Architecture Grid */}
      <section id="features" className="py-32 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-[url('https://linear.app/_next/static/media/stars.811d4d12.svg')] opacity-20" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-6 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest">
              System Architecture
            </Badge>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
              Engineered for variance.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Aegis is built on a distributed Rust-core executable that bypasses standard OS scheduling for <span className="text-white">deterministic execution</span>. It{`'`}s not just a platform; it{`'`}s a weaponized runtime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Kernel Bypass Networking",
                desc: "Direct-to-NIC memory access ensuring <50μs wire-to-wire latency. No TCP overhead, just raw packet injection.",
                stat: "50μs"
              },
              {
                icon: Shield,
                title: "Memory Safe Enclaves",
                desc: "Stategies run in isolated WASM sandboxes. A crash in one execution logic cannot taint the master order router.",
                stat: "100% Isolation"
              },
              {
                icon: Target,
                title: "Variance-Weighted Entry",
                desc: "Entries are not boolean. They are probabilistically weighted against current volatility regimes and liquidity depth.",
                stat: "Dynamic Sizing"
              },
              {
                icon: BarChart3,
                title: "Telemetry Streaming",
                desc: "Full state replication via massive-throughput WebSocket pipes. Replay any session tick-by-tick for audit.",
                stat: "60Hz Updates"
              },
              {
                icon: Command,
                title: "Headless Execution",
                desc: "Run strategies as background daemons. No UI required. Control everything via gRPC or the CLI.",
                stat: "CLI First"
              },
              {
                icon: Star,
                title: "Institutional Connectivity",
                desc: "Pre-certified FIX connections to major exchanges. DMA access available for qualifying high-volume desks.",
                stat: "FIX 4.4"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative p-8 rounded-3xl border border-white/5 bg-[#080808] hover:bg-[#0c0c0c] transition-all duration-500 hover:border-white/10 overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ArrowRight className="w-5 h-5 text-white -rotate-45" />
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">{feature.desc}</p>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Metric</span>
                  <span className="text-sm font-mono text-emerald-500 font-bold">{feature.stat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code / API Section */}
      <section className="py-24 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-medium mb-6">Trade with code.</h3>
            <p className="text-zinc-400 leading-relaxed mb-8">
              The Aegis SDK provides typed primitives for every market event. Define your strategy in Python or TypeScript and deploy to the edge.
            </p>

            <div className="space-y-4">
              {[
                "Event-driven architecture",
                "Backtest on 10 years of tick data",
                "Local simulation mode",
                "One-command deployment"
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button variant="outline" className="h-12 border-white/10 hover:bg-white text-zinc-300 hover:text-black transition-colors">
                View Documentation
              </Button>
            </div>
          </div>

          <div className="relative rounded-xl border border-white/10 bg-[#000] p-6 font-mono text-sm overflow-hidden shadow-2xl">
            <div className="flex gap-2 mb-4 text-zinc-600">
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
            </div>
            <div className="space-y-2">
              <div className="text-pink-500">import <span className="text-white">aegis</span></div>
              <div className="text-zinc-500">// Initialize sophisticated moving average crossover</div>
              <div>
                <span className="text-purple-400">class</span> <span className="text-yellow-200">AlphaStrategy</span>(<span className="text-blue-400">aegis.Strategy</span>):
              </div>
              <div className="pl-4">
                <span className="text-purple-400">def</span> <span className="text-blue-300">on_tick</span>(<span className="text-orange-300">self</span>, <span className="text-orange-300">tick</span>):
              </div>
              <div className="pl-8 text-zinc-300">
                <span className="text-zinc-500"># Calculate variance-weighted momentum</span>
              </div>
              <div className="pl-8">
                <span className="text-orange-300">momentum</span> = <span className="text-blue-300">self</span>.calc_vwm(<span className="text-orange-300">tick</span>.price)
              </div>
              <div className="pl-8">
                <span className="text-purple-400">if</span> <span className="text-orange-300">momentum</span> &gt; <span className="text-emerald-400">0.85</span>:
              </div>
              <div className="pl-12">
                <span className="text-blue-300">self</span>.order(<span className="text-green-300">"BUY"</span>, leverage=<span className="text-emerald-400">5x</span>)
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>
        </div>
      </section>



    </div>
  )
}
