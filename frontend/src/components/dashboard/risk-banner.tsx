"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function RiskBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if dismissed previously
        const dismissed = localStorage.getItem("aegis_risk_banner_dismissed");
        if (!dismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("aegis_risk_banner_dismissed", "true");
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-amber-500/10 border-b border-amber-500/20 overflow-hidden"
                >
                    <div className="container mx-auto px-6 py-3 flex items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 md:mt-0" />
                            <div className="space-y-1">
                                <p className="text-xs md:text-sm font-medium text-amber-500">
                                    Capital at Risk Warning
                                </p>
                                <p className="text-[10px] md:text-xs text-amber-200/70 leading-relaxed md:max-w-4xl">
                                    Automated trading involves significant risk. The "Signal Intelligence" provided is for informational purposes only.
                                    Past performance of signals or strategies does not guarantee future results.
                                    Ensure your Risk Profile is configured correctly before enabling automation.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDismiss}
                            className="h-6 w-6 text-amber-500/50 hover:text-amber-500 hover:bg-amber-500/10 shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
