"use client"

import { Bell, ChevronDown, Command, Search, Slash, LogOut, User, Settings, Menu, LayoutDashboard, ArrowLeftRight, Activity, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { AegisLogo } from "@/components/ui/aegis-logo"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/auth-context"

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Positions", icon: ArrowLeftRight, href: "/dashboard/positions" },
    { label: "Scanner", icon: Activity, href: "/dashboard/scanner" },
    { label: "Risk", icon: ShieldAlert, href: "/dashboard/risk" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export function DashboardHeader() {
    const { logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = async () => {
        await logout()
        router.push("/login")
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#333] bg-black">
            <div className="flex h-16 items-center px-4 md:px-6 gap-4">

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-[#888] hover:text-white">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-[#050505] border-[#222]">
                            <div className="flex items-center gap-2 mb-8 px-2">
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <img src="/logo-processed.png" alt="Aegis" className="w-full h-full object-contain" />
                                </div>
                                <span className="font-bold text-white">Aegis Mobile</span>
                            </div>
                            <nav className="space-y-1">
                                {sidebarItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-3 rounded-md text-[14px] font-medium transition-colors",
                                            pathname === item.href
                                                ? "bg-[#111] text-white border border-[#222]"
                                                : "text-muted-foreground hover:text-white hover:bg-white/[0.03]"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-5 h-5",
                                            pathname === item.href ? "text-white" : "text-muted-foreground"
                                        )} />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo / Context */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/logo-processed.png" alt="Aegis" className="w-full h-full object-contain" />
                    </div>

                    <Slash className="w-4 h-4 text-[#444] -rotate-12" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#111] transition-colors cursor-pointer group">
                                <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                                    A
                                </div>
                                <span className="text-sm font-semibold text-white">Aegis Quant</span>
                                <ChevronDown className="w-3 h-3 text-[#666] group-hover:text-white transition-colors" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-[#0a0a0a] border-[#222] text-white">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-[#222]" />
                            <DropdownMenuItem className="focus:bg-[#111] focus:text-white cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-[#111] focus:text-white cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#222]" />
                            <DropdownMenuItem className="focus:bg-[#111] text-red-400 focus:text-red-400 cursor-pointer" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Breadcrumbs / Context */}
                <div className="hidden md:flex items-center gap-2 ml-2">
                    <div className="px-2 py-1 bg-[#111] rounded text-xs text-[#888] font-mono border border-[#222]">
                        Pro Plan
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-4">
                    {/* Live Indicator */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-none border border-emerald-500/20">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-500 tracking-widest">NIFTY LIVE</span>
                    </div>

                    <div className="relative hidden md:flex items-center">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                        <input
                            type="text"
                            placeholder="Search logic..."
                            className="h-8 w-64 bg-[#0a0a0a] border border-[#333] rounded-md pl-9 pr-4 text-sm text-white placeholder:text-[#444] focus:border-white focus:ring-0 transition-colors"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-[#333] bg-[#111] text-[10px] text-[#666] flex items-center gap-0.5">
                            <Command className="w-2.5 h-2.5" /> K
                        </div>
                    </div>

                    <Button variant="ghost" size="icon" className="text-[#888] hover:text-white" title="Notifications">
                        <Bell className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[#888] hover:text-red-400 gap-2 hidden md:flex" title="Log Out">
                        <LogOut className="w-4 h-4" />
                    </Button>

                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 border border-[#333]" />
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 flex items-center gap-6 overflow-x-auto scrollbar-hide">
                {["Overview", "Strategies", "Executions", "Telemetry", "Infrastructure", "Settings", "Help / Docs"].map((tab, i) => {
                    const path = tab === "Overview" ? "/dashboard"
                        : tab === "Help / Docs" ? "/docs/broker-integration"
                            : `/dashboard/${tab.toLowerCase()}`;
                    return (
                        <Link
                            key={tab}
                            href={path}
                            className={`text-sm font-medium py-3 border-b-2 transition-colors ${i === 0 ? 'text-white border-white' : 'text-[#888] border-transparent hover:text-white hover:border-[#333]'}`}
                        >
                            {tab}
                        </Link>
                    )
                })}
            </div>
        </header>
    )
}
