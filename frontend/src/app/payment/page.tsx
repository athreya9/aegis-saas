"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";


import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, QrCode, Copy, Check, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";

import { Suspense } from "react";

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, login } = useAuth();

    const plan = searchParams.get("plan");
    const [email, setEmail] = useState(searchParams.get("email") || "");

    const [isProcessing, setIsProcessing] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (user && !email) {
            setEmail(user.email);
        }
    }, [user, email]);

    useEffect(() => {
        if (!plan || (!email && !user)) {
            // If no plan, go to pricing
            if (!plan) router.push("/pricing");
            // If no email and no user, we might need a prompt, but for now allow guest to pricing
        }
    }, [plan, email, user, router]);

    const handleCopy = () => {
        navigator.clipboard.writeText("connect1to1@ybl");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        // Mock payment verification delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // MOCK PAYMENT RECORDING
        const paidUsers = JSON.parse(localStorage.getItem("aegis_paid_users") || "[]");
        if (email && !paidUsers.includes(email)) {
            paidUsers.push(email);
            localStorage.setItem("aegis_paid_users", JSON.stringify(paidUsers));
        }

        // --- ALERT TELEMETRY (Mock) ---
        console.log(`[ALERT System] Triggering TELEGRAM notification for: ${email}`);
        console.log(`[ALERT System] Payload: { event: "NEW_PAYMENT", user: "${email}", amount: "${amount}", time: "${new Date().toISOString()}" }`);

        // --- PWA NOTIFICATION (Mock) ---
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Payment Received', { body: 'Your account is now under review.' });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        // Login/Create Account
        await login(email!);
    };

    const amount = plan === "managed" ? "₹4,999" : "₹2,499";
    const planName = plan === "managed" ? "Managed Automation" : "Aegis Core";

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-purple-500/30">
            <Card className="w-full max-w-lg bg-[#0a0a0a] border-[#222] vercel-card">
                <CardHeader className="border-b border-[#222] pb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-white font-medium">
                            <Lock className="w-4 h-4 text-emerald-500" />
                            Secure Checkout
                        </div>
                        <div className="text-xs font-mono text-zinc-500 bg-[#111] px-2 py-1 rounded">
                            UPI / QR
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-bold text-white tracking-tight">{amount}</h2>
                        <p className="text-sm text-zinc-400 mb-1">{planName}</p>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-8">

                    {/* QR Code Section */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-white rounded-xl border-4 border-white shadow-xl shadow-white/5">
                            <div className="relative w-48 h-48">
                                <Image
                                    src="/payment-qr.jpg"
                                    alt="Payment QR Code"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Scan to Pay via PhonePe / GPay / Paytm</p>
                    </div>

                    {/* UPI ID Section */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-mono uppercase text-zinc-500">Manual UPI Transfer</Label>
                            <div className="flex gap-2">
                                <Input
                                    readOnly
                                    value="connect1to1@ybl"
                                    className="bg-[#111] border-[#333] text-white font-mono text-center tracking-widest"
                                />
                                <Button size="icon" variant="outline" className="border-[#333] hover:bg-[#222] shrink-0" onClick={handleCopy}>
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-500" />}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-mono uppercase text-zinc-500">Account Email</Label>
                            <div className="px-3 py-2 bg-[#111] border border-[#333] rounded text-zinc-400 text-sm font-mono truncate">
                                {email}
                            </div>
                        </div>

                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded p-4 flex gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div className="text-xs text-emerald-200/80 leading-relaxed">
                            <strong>Activation Notice:</strong> Your account will be activated immediately after payment confirmation. Please keep the transaction ID handy.
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-0 pb-6 flex flex-col gap-3">
                    <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold text-base"
                    >
                        {isProcessing ? "Verifying Payment..." : "I Have Made the Payment"}
                    </Button>
                    <p className="text-[10px] text-zinc-600 text-center">
                        By proceeding, you agree to our <span className="underline">Terms of Service</span>.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
