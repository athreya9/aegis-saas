"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>

            <Card className="p-8 border-dashed border-zinc-800 bg-[#0A0A0A] flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-3 bg-zinc-900 rounded-full">
                    <Badge variant="outline" className="border-indigo-500/20 text-indigo-500 uppercase">ReadOnly</Badge>
                </div>
                <h3 className="text-xl font-bold text-white">Managed Configuration</h3>
                <p className="text-zinc-500 max-w-md">
                    System settings are currently managed via the Backend Config API.
                    UI controls will be enabled in the next governance cycle.
                </p>
            </Card>
        </div>
    );
}
