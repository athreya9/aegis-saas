"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Puzzle,
    Settings2,
    ShieldCheck,
    Zap,
    Power,
    RefreshCcw,
    CheckCircle2
} from "lucide-react";
import { useState } from "react";

export default function AutomationPage() {
    const [isLive, setIsLive] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Strategy Automation</h1>
                    <p className="text-muted-foreground">Configure your execution algorithms and risk parameters.</p>
                </div>
                <Button
                    variant={isLive ? "destructive" : "default"}
                    size="lg"
                    onClick={() => setIsLive(!isLive)}
                    className="flex items-center gap-2"
                >
                    <Power size={18} /> {isLive ? "Stop Automation" : "Start Automation"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Puzzle className="h-5 w-5 text-primary" />
                            <CardTitle>Broker Integration</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg border p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center font-bold">K</div>
                                <div>
                                    <p className="font-semibold">Kite (Zerodha)</p>
                                    <p className="text-xs text-muted-foreground">Status: Connected</p>
                                </div>
                            </div>
                            <Badge variant="success">Active</Badge>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Access Token</label>
                            <div className="flex gap-2">
                                <Input type="password" value="************************" readOnly />
                                <Button variant="outline" size="icon">
                                    <RefreshCcw size={16} />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">Configure New Broker</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Settings2 className="h-5 w-5 text-primary" />
                            <CardTitle>Risk Parameters</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: "Daily Max Loss", value: "$500.00" },
                            { label: "Max Position Size", value: "2 Lots" },
                            { label: "Trailing SL Buffer", value: "1.5%" },
                        ].map((param, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                                <span className="text-sm text-muted-foreground">{param.label}</span>
                                <span className="font-mono font-medium">{param.value}</span>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button variant="secondary" className="w-full">Edit Risk Profile</Button>
                    </CardFooter>
                </Card>

                <Card className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            <CardTitle>Active Intelligence Modules</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: "Trend Follower", desc: "Momentum-based trend continuation", status: "Active" },
                                { name: "Sentiment Analyzer", desc: "News & Social media mood filtering", status: "Active" },
                                { name: "Alpha Scalper", desc: "High-frequency mean reversion", status: "Idle" },
                            ].map((module, i) => (
                                <div key={i} className="p-4 rounded-xl border bg-card/50 backdrop-blur-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold">{module.name}</h4>
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            module.status === "Active" ? "bg-emerald-500" : "bg-muted"
                                        )} />
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-4">{module.desc}</p>
                                    <Button variant="ghost" size="sm" className="w-full justify-start px-0 text-primary">
                                        View Logs
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
