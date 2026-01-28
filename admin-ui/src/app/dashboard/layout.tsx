"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { AdminHeader } from "@/components/layout/header";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // In a real app, check for admin role
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-black selection:bg-purple-500/30">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <div className="bg-amber-500/10 border-b border-amber-900/30 p-2 text-center">
                    <p className="text-amber-500 text-xs font-medium tracking-wide">
                        ⚠️ CORE TRADING OS RUNS A PRIVATE BROKER ACCOUNT. SAAS USERS ARE NOT CONNECTED TO THIS ACCOUNT.
                    </p>
                </div>
                <AdminHeader />
                <main className="flex-1 overflow-y-auto bg-black p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
