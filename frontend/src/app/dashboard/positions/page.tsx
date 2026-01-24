"use client";

import { SignalsTerminal } from "@/components/dashboard/signals-terminal";

export default function PositionsPage() {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Signals Terminal</h1>
                    <p className="text-zinc-400">Live intelligence feed. Read-only market observations.</p>
                </div>
                {/* No Execution Controls Allowed */}
            </div>

            <div className="flex-1 min-h-0">
                <SignalsTerminal />
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
