"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ShieldCheck, Clock, RefreshCw, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentStatusPage() {
    const { user, checkStatus, logout } = useAuth();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(false);

    const handleRefresh = async () => {
        setIsChecking(true);
        // Simulate network check
        await new Promise(resolve => setTimeout(resolve, 1000));
        checkStatus();
        setIsChecking(false);

        // If status became active, redirect
        const saved = localStorage.getItem("aegis_user");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.status === "ACTIVE") {
                router.push("/dashboard");
            }
        }
    };

    // DEBUG: Simulate Approval for Demo Purposes
    const handleSimulateApproval = () => {
        if (!user) return;
        const approvedUsers = JSON.parse(localStorage.getItem("aegis_approved_users") || "[]");
        if (!approvedUsers.includes(user.email)) {
            approvedUsers.push(user.email);
            localStorage.setItem("aegis_approved_users", JSON.stringify(approvedUsers));
            alert(`Simulated Admin Approval for ${user.email}. Click "Check Status" to proceed.`);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-purple-500/30">
            <Card className="w-full max-w-md bg-[#0a0a0a] border-[#222]">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-medium text-white">Payment Under Review</h2>
                    <p className="text-zinc-400 text-sm">Your access is pending administrator verification.</p>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                    <div className="bg-[#111] border border-[#222] rounded-lg p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Account</span>
                            <span className="text-white font-mono">{user?.email}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Status</span>
                            <span className="text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded text-xs">REVIEWING</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Ref ID</span>
                            <span className="text-zinc-600 font-mono">#REQ-{user?.id.substring(0, 6)}</span>
                        </div>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded text-xs text-blue-200/70 leading-relaxed text-center">
                        <ShieldCheck className="w-4 h-4 mx-auto mb-2 text-blue-500" />
                        Admin approval typically takes 15-30 minutes. You will receive an email confirmation once the risk perimeter is established.
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            className="w-full bg-white text-black hover:bg-zinc-200"
                            onClick={handleRefresh}
                            disabled={isChecking}
                        >
                            {isChecking ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                            Check Status
                        </Button>

                        <Button variant="ghost" className="text-zinc-500 hover:text-white" onClick={logout}>
                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </Button>
                    </div>

                    {/* DEMO ONLY CONTROL */}
                    <div className="pt-8 border-t border-white/5 text-center">
                        <p className="text-[10px] text-zinc-700 uppercase tracking-widest mb-2">Demo Control</p>
                        <button
                            onClick={handleSimulateApproval}
                            className="text-[10px] text-zinc-600 hover:text-emerald-500 underline transition-colors"
                        >
                            [Simulate Admin Approval]
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
