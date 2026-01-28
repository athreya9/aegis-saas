"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    Shield,
    Activity,
    FileText,
    Database,
    Server,
    LogOut,
    ShieldAlert,
    BookOpen,
    Menu
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        href: "/dashboard/users",
        icon: Users,
    },
    {
        title: "Subscriptions",
        href: "/dashboard/subscriptions",
        icon: CreditCard,
    },
    {
        title: "Brokers & API",
        href: "/dashboard/brokers",
        icon: Server,
    },
    {
        title: "System Status",
        href: "/dashboard/system",
        icon: Activity,
    },
    {
        title: "Telegram Control",
        href: "/dashboard/telegram",
        icon: ShieldAlert,
    },
    {
        title: "Audit Log",
        href: "/dashboard/audit",
        icon: FileText,
    },
    {
        title: "AI Training",
        href: "/dashboard/training",
        icon: Database,
    },
    {
        title: "Documentation",
        href: "/dashboard/docs",
        icon: BookOpen,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    // Desktop Sidebar Content
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 w-64">
            <div className="p-6">
                <div className="flex items-center gap-2 font-bold text-xl text-white">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span>Aegis Admin</span>
                </div>
            </div>

            <div className="flex-1 px-4 py-2 space-y-1">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-indigo-600/10 text-indigo-400"
                                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.title}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-zinc-800">
                <button
                    onClick={() => {
                        window.location.href = "/login";
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-full">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-zinc-900 border-zinc-800 text-white">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r-zinc-800 bg-zinc-950 w-64">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}
