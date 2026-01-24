"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader as Header } from "@/components/dashboard/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AegisNavigator } from "@/components/navigator/aegis-navigator"
import dynamic from 'next/dynamic'

const AegisNavigatorDynamic = dynamic(
    () => import('@/components/navigator/aegis-navigator').then((mod) => mod.AegisNavigator),
    { ssr: false }
)

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-[#0A0A0A]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
                    {children}
                </main>
                <MobileNav />
                <AegisNavigatorDynamic />
            </div>
        </div>
    )
}
