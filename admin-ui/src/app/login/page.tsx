"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Shield } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4 selection:bg-purple-500/30">
            <div className="w-full max-w-sm space-y-6">
                {/* Logo / Header */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2">
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-black mb-0.5" />
                    </div>
                    <h1 className="text-xl font-medium text-white tracking-tight">Access Control</h1>
                    <p className="text-sm text-zinc-400">Authenticate via Aegis SSO</p>

                    {/* Demo Access Note */}
                    <div className="mt-2 w-full p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-center">
                        <p className="text-[10px] text-emerald-400 font-mono mb-1">ADMIN PREVIEW MODE</p>
                        <div className="text-[10px] text-zinc-400">
                            User: <span className="text-white font-bold select-all">admin@aegis.local</span><br />
                            Pass: <span className="text-white font-bold select-all">Admin@123</span>
                        </div>
                    </div>
                </div>

                <Card className="vercel-card border-[#222] bg-[#0a0a0a]">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest pl-1">Email</label>
                                <Input
                                    className="bg-[#111] border-[#333] text-white focus:border-white transition-colors h-10"
                                    type="email"
                                    placeholder="admin@aegis.io"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest pl-1">Password</label>
                                <Input
                                    className="bg-[#111] border-[#333] text-white focus:border-white transition-colors h-10"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button className="w-full h-10 bg-white text-black hover:bg-zinc-200 mt-2 font-medium" disabled={isLoading}>
                                {isLoading ? "Authenticating..." : "Sign In"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-zinc-600">
                    Protected by Aegis Variance Shield. <br />
                    <Link href="/" className="hover:text-zinc-400 transition-colors underline">Return to Platform</Link>
                </p>
            </div>
        </div>
    );
}
