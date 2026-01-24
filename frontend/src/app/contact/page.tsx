"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Phone, MapPin, ArrowUpRight, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-white rounded-full" />
                            </div>
                            <span>Aegis</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400 font-medium">
                        <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
                        <Link href="/#manifesto" className="hover:text-white transition-colors">Manifesto</Link>
                        <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                        <Link href="/login" className="hover:text-white transition-colors">Log in</Link>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 container mx-auto px-6 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Left Column: Context */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-zinc-400 mb-8">
                            <span className="flex items-center gap-1">24/7 Global Support</span>
                        </div>
                        <h1 className="text-5xl font-medium tracking-tight mb-8 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                            Talk to us.
                        </h1>
                        <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
                            Deploying institutional strategies requires rigorous support. Our engineering team is ready to assist with integration, FIX certification, and custom kernel modules.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium mb-1">Email Support</h3>
                                    <p className="text-zinc-500 text-sm mb-2">For general inquiries and commercial licenses.</p>
                                    <a href="mailto:support@aegis.io" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 group">
                                        support@aegis.io <ArrowUpRight className="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <MessageSquare className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium mb-1">Live Technical Desk</h3>
                                    <p className="text-zinc-500 text-sm mb-2">Real-time debugging access for Pro Tier clients.</p>
                                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 group">
                                        Open Console <ArrowUpRight className="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium mb-1">Global HQ</h3>
                                    <p className="text-zinc-500 text-sm">
                                        100 Montgomery St, Suite 100<br />
                                        San Francisco, CA 94104
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 pt-8 border-t border-white/5 flex gap-6">
                            <Link href="#" className="text-zinc-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
                            <Link href="#" className="text-zinc-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></Link>
                            <Link href="#" className="text-zinc-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50" />
                        <Card className="relative bg-[#0a0a0a] border border-[#222] p-2">
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">First Name</label>
                                        <Input className="bg-[#111] border-[#333] focus:border-white transition-colors" placeholder="Jane" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Last Name</label>
                                        <Input className="bg-[#111] border-[#333] focus:border-white transition-colors" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Work Email</label>
                                    <Input className="bg-[#111] border-[#333] focus:border-white transition-colors" placeholder="jane@hedgefund.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Topic</label>
                                    <select className="flex h-10 w-full rounded-md border border-[#333] bg-[#111] px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white">
                                        <option>Enterprise Licensing</option>
                                        <option>Technical Support</option>
                                        <option>Partnership Inquiry</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Message</label>
                                    <textarea
                                        className="flex min-h-[150px] w-full rounded-md border border-[#333] bg-[#111] px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors resize-none"
                                        placeholder="Tell us about your execution requirements..."
                                    />
                                </div>

                                <Button className="w-full h-12 bg-white text-black hover:bg-zinc-200 mt-2 font-medium">Send Inquiry</Button>

                                <p className="text-xs text-center text-zinc-600 pt-4">
                                    By submitting this form, you agree to our <Link href="#" className="underline hover:text-zinc-400">Terms of Service</Link> and <Link href="#" className="underline hover:text-zinc-400">Privacy Policy</Link>.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
