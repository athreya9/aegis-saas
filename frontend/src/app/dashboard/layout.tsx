"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
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
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login"); // Implicit protection
        }
    }, [user, isLoading, router]);

    return (
        <div className="flex min-h-screen bg-black text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader />
                <main className="flex-1">
                    {children}
                </main>
            </div>
            <AegisNavigatorDynamic />
        </div>
    );
}
