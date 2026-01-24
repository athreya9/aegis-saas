"use client";

import { useAuth } from "@/context/auth-context";
import { Bell, Command, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 border-b border-[#111] bg-black flex items-center px-6 justify-between sticky top-0 z-40">
            {/* Left: Breadcrumbs / Context */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="hover:text-white transition-colors cursor-pointer">aegis-admin</span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-white font-medium">Overview</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-8 w-64 bg-[#0a0a0a] border border-[#222] rounded-md pl-9 pr-4 text-sm text-white placeholder:text-[#444] focus:border-white focus:ring-0 transition-colors"
                    />
                    <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-[#222] bg-[#111] text-[10px] text-[#666] flex items-center gap-0.5 font-mono">
                        <Command className="w-2.5 h-2.5" /> K
                    </kbd>
                </div>

                <div className="flex items-center gap-2 border-l border-[#111] pl-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#666] hover:text-white" title="Notifications">
                        <Bell className="w-4 h-4" />
                    </Button>

                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white ml-2 border border-white/10">
                        {user?.name?.[0].toUpperCase() || "A"}
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => logout && logout()} className="h-8 w-8 text-[#666] hover:text-red-400 ml-1" title="Log Out">
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
