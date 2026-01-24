"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import dynamic from 'next/dynamic'

const AegisNavigatorDynamic = dynamic(
    () => import('@/components/navigator/aegis-navigator').then((mod) => mod.AegisNavigator),
    { ssr: false }
)

interface ClientLayoutProps {
    children: React.ReactNode
}

import { Footer } from "@/components/layout/footer"

export function ClientLayout({ children }: ClientLayoutProps) {
    const pathname = usePathname()

    // Pages that have their own specific layouts or shouldn't have the global navbar
    const isDashboard = pathname?.startsWith("/dashboard")
    const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/payment"

    return (
        <>
            {/* Global Navbar - Hidden on Dashboard and Auth pages */}
            {!isDashboard && !isAuthPage && <Navbar />}

            {children}

            {!isDashboard && !isAuthPage && <Footer />}

            {/* Global Navigator - Hidden on Dashboard (it handles its own) */}
            {!isDashboard && (
                <AegisNavigatorDynamic />
            )}
        </>
    )
}
