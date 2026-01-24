"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Activity, Terminal, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/risk", label: "Risk", icon: Activity },
    { href: "/dashboard/terminal", label: "Trade", icon: Terminal },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-white/5 md:hidden pb-safe">
            <div className="flex items-center justify-around h-16">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors active:scale-95",
                                isActive ? "text-indigo-500" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
