"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    BarChart3,
    Activity,
    ShieldAlert,
    Cpu,
    Settings,
    ArrowLeftRight,
    LayoutDashboard,
    Menu,
    Zap
} from "lucide-react"

const items = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Strategies", icon: Cpu, href: "/dashboard/strategies" },
    { label: "Positions", icon: ArrowLeftRight, href: "/dashboard/positions" },
    { label: "Automation", icon: Zap, href: "/dashboard/automation" },
    { label: "Scanner", icon: Activity, href: "/dashboard/scanner" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 border-r border-white/5 bg-[#0A0A0A] flex-col hidden md:flex h-screen sticky top-0">
            <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center shrink-0">
                    <span className="text-black font-black text-xs">A</span>
                </div>
                <span className="font-bold tracking-tight text-white">Aegis <span className="text-muted-foreground font-normal">SaaS</span></span>
            </div>

            <nav className="flex-1 px-3 space-y-1 py-4">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all group",
                            pathname === item.href
                                ? "bg-[#111] text-white border border-[#222]"
                                : "text-muted-foreground hover:text-white hover:bg-white/[0.03]"
                        )}
                    >
                        <item.icon className={cn(
                            "w-4 h-4 transition-colors",
                            pathname === item.href ? "text-white" : "group-hover:text-white"
                        )} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-[#111]">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">JD</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-white truncate">John Doe</p>
                        <p className="text-[10px] text-muted-foreground truncate">Hobby Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
