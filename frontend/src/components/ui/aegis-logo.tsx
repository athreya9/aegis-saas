import React from "react"
import { cn } from "@/lib/utils"

interface AegisLogoProps {
    className?: string
    size?: number
    withText?: boolean
}

export function AegisLogo({ className, size = 48, withText = false }: AegisLogoProps) {
    return (
        <div className={cn("flex items-center gap-4", className)}>
            <div
                className="relative overflow-hidden flex-shrink-0"
                style={{ width: size, height: size }}
            >
                <img
                    src="/logo-processed.png"
                    alt="Aegis Logo"
                    className="w-full h-full object-contain"
                    style={{
                        objectPosition: "top center",
                        transform: "scale(1.8)",
                        transformOrigin: "top center"
                    }}
                />
            </div>
            {withText && (
                <span className="font-bold text-lg tracking-tight text-white leading-none">
                    Aegis
                </span>
            )}
        </div>
    )
}
