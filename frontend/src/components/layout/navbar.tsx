"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { AegisLogo } from "@/components/ui/aegis-logo";

export function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2">
                    <AegisLogo size={56} withText />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                    <Link href="/features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="/docs/broker-integration" className="hover:text-white transition-colors">Docs</Link>
                </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-black/95 border-b border-white/10 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-2">
                    <Link href="/features" className="text-zinc-400 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Features</Link>
                    <Link href="/pricing" className="text-zinc-400 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                    <Link href="/docs/broker-integration" className="text-zinc-400 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Docs</Link>
                    <div className="h-px bg-white/10 my-2" />
                    {user ? (
                        <>
                            <Link href="/dashboard" className="text-emerald-400 font-bold py-2" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                            <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-red-400 text-left py-2">Spread Exit</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-white py-2" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            <Link href="/signup" className="text-white font-bold py-2" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                        </>
                    )}
                </div>
            )}

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
                {user ? (
                    <>
                        <Button asChild variant="ghost" className="text-zinc-400 hover:text-white">
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                        <Button variant="ghost" className="text-zinc-400 hover:text-red-400" onClick={logout}>
                            Spread Exit
                        </Button>
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                            {user.email[0].toUpperCase()}
                        </div>
                    </>
                ) : (
                    <>
                        <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild className="bg-white text-black hover:bg-zinc-200 font-medium">
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </>
                )}
            </div>
        </nav >
    );
}
