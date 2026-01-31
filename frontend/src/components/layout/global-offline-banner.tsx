"use client"

import { useOSData } from "@/hooks/use-os-data"
import { AlertTriangle } from "lucide-react"

export function GlobalOfflineBanner() {
    const { status } = useOSData();
    const isOffline = status?.transparency?.coreStatus === 'CORE OFFLINE';

    if (!isOffline) return null;

    return (
        <div className="bg-red-600 text-white py-2 px-4 flex items-center justify-center gap-3 z-[100] relative">
            <AlertTriangle size={16} className="animate-pulse" />
            <p className="text-xs font-black uppercase tracking-[0.1em]">
                CORE SYSTEM OFFLINE - Maintenance in Progress.
            </p>
        </div>
    )
}
