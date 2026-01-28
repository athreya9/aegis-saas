"use client";

import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
    text: string;
    children?: React.ReactNode;
}

export function HelpTooltip({ text, children }: HelpTooltipProps) {
    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="cursor-help inline-flex items-center gap-1">
                        {children}
                        {!children && <Info className="h-3 w-3 text-zinc-500 hover:text-zinc-300 transition-colors" />}
                    </span>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs max-w-[200px] leading-relaxed">
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
