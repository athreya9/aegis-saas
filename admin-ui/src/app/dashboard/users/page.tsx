"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, ShieldCheck, Ban, RefreshCw, PauseCircle, PlayCircle, Shield, LogOut, CreditCard, AlertCircle, FileText, Activity } from "lucide-react";

export default function UserList() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://91.98.226.5:4100/api/v1/control/all-status');
                const data = await res.json();
                if (data.status === 'success') {
                    const mapped = data.data.map((s: any, idx: number) => ({
                        id: idx + 1,
                        name: s.userId.split('_')[0].charAt(0).toUpperCase() + s.userId.split('_')[0].slice(1),
                        email: `${s.userId}@aegis.local`,
                        plan: s.planType,
                        status: s.autoTrading ? "Active" : "Paused",
                        broker: s.brokerConnected ? "Zerodha" : "-",
                        joined: "Jan 24, 2026",
                        apiStatus: s.brokerConnected ? "Active" : "Inactive",
                        lastActivity: "Now",
                        notes: `Risk Cap: ₹${s.stats.riskCap}`,
                        riskProfile: s.riskProfile
                    }));
                    setUsers(mapped);
                }
                setLoading(false)
            } catch (e) {
                console.error("User Fetch Error:", e);
                setLoading(false)
            }
        };
        fetchUsers();
    }, []);

    const handleAction = (id: number, action: string) => {
        setUsers(prev => prev.map(u => {
            if (u.id !== id) return u;

            switch (action) {
                case "APPROVE": return { ...u, status: "Active", apiStatus: "Active" };
                case "BLOCK": return { ...u, status: "Blocked", apiStatus: "Revoked" };
                case "PAUSE": return { ...u, status: "Paused", apiStatus: "Inactive" };
                case "RESUME": return { ...u, status: "Active", apiStatus: "Active" };
                case "RESET_PW":
                    alert(`Password reset link sent to ${u.email}`);
                    return u;
                case "FORCE_LOGOUT":
                    alert(`Sessions terminated for ${u.email}`);
                    return u;
                case "OVERDUE":
                    return { ...u, status: "Overdue" };
                case "CHANGE_PLAN":
                    const nextPlan = u.plan === "Starter" ? "Professional" : "Enterprise";
                    return { ...u, plan: nextPlan };
                case "UNBLOCK": return { ...u, status: "Active", broker: "-" };
                case "ADD_NOTE":
                    const note = prompt("Enter internal admin note:", u.notes);
                    return note !== null ? { ...u, notes: note } : u;
                default: return u;
            }
        }))
    }

    const [selectedUser, setSelectedUser] = useState<any>(null)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-white">Security & User Management</h1>
                    <p className="text-zinc-500 text-sm">Aegis Core™ Control Plane • Real-time session monitoring and lifecycle management.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-600" />
                        <Input placeholder="Search UID, Email, or Broker..." className="pl-9 w-64 bg-black border-zinc-900 text-white placeholder:text-zinc-600 focus:border-indigo-500 transition-all" />
                    </div>
                    <Button variant="outline" className="border-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-900 font-mono text-xs uppercase tracking-widest">Audit Logs</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className={selectedUser ? "lg:col-span-8" : "lg:col-span-12"}>
                    <Card className="bg-[#050505] border-zinc-900 overflow-hidden shadow-2xl">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-zinc-900 bg-zinc-950/50">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Context</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Plan / Broker</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Risk Profile</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Status</th>
                                            <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 whitespace-nowrap">Session Controls</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-900">
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                onClick={() => setSelectedUser(user)}
                                                className={`group hover:bg-zinc-900/40 transition-all cursor-pointer ${selectedUser?.id === user.id ? "bg-indigo-500/[0.03]" : ""}`}
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center font-black text-indigo-500 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                                            {user.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white tracking-tight">{user.name}</p>
                                                            <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-tighter">AEGIS-{user.id + 1000} • {user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1.5">
                                                        <Badge variant="outline" className="border-zinc-800 text-zinc-500 py-0 text-[9px] uppercase font-bold tracking-widest">{user.plan}</Badge>
                                                        <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">{user.broker}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <Badge variant="outline" className={`${user.riskProfile === "Conservative" ? "border-emerald-500/20 text-emerald-500" :
                                                        user.riskProfile === "Active" ? "border-orange-500/20 text-orange-500" :
                                                            "border-indigo-500/20 text-indigo-500"
                                                        } text-[9px] px-2 py-0 uppercase font-black`}>
                                                        {user.riskProfile}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full animate-pulse ${user.status === "Active" ? "bg-emerald-500" :
                                                            user.status === "Blocked" ? "bg-rose-500" : "bg-amber-500"
                                                            }`} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{user.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {user.status === "Payment Under Review" && (
                                                            <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white mr-2 text-[10px] font-black uppercase tracking-widest" onClick={(e) => { e.stopPropagation(); handleAction(user.id, "APPROVE"); }}>
                                                                Approve
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-700 hover:text-white" onClick={(e) => { e.stopPropagation(); handleAction(user.id, "ADD_NOTE"); }} title="Notes"><FileText className="h-4 w-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-700 hover:text-white" onClick={(e) => { e.stopPropagation(); handleAction(user.id, "FORCE_LOGOUT"); }} title="Kill Session"><LogOut className="h-4 w-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500/50 hover:text-rose-500" onClick={(e) => { e.stopPropagation(); handleAction(user.id, "BLOCK"); }} title="Restrict"><Ban className="h-4 w-4" /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {selectedUser && (
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="bg-[#050505] border-zinc-900 overflow-hidden sticky top-6">
                            <CardHeader className="border-b border-zinc-900 pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Activity Timeline</CardTitle>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-600" onClick={() => setSelectedUser(null)}>×</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-8 relative">
                                    <div className="absolute left-2.5 top-0 bottom-0 w-[1px] bg-zinc-900" />

                                    {[
                                        { event: "Login Success", time: "2m ago", desc: "Session started from New Delhi, IN", icon: ShieldCheck, color: "text-emerald-500" },
                                        { event: "Order Executed", time: "1h ago", desc: "NIFTY 21500 CE Buy • 50 Qty", icon: Activity, color: "text-indigo-500" },
                                        { event: "API Auth Renewed", time: "4h ago", desc: "Broker connection established successfully", icon: RefreshCw, color: "text-blue-500" },
                                        { event: "Risk Check Passed", time: "1d ago", desc: "Drawdown within Institutional 2% limits", icon: Shield, color: "text-emerald-500" },
                                    ].map((item, i) => (
                                        <div key={i} className="relative pl-10 flex flex-col gap-1">
                                            <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-black border border-zinc-800 flex items-center justify-center z-10 shadow-lg shadow-black">
                                                <item.icon className={`h-2.5 w-2.5 ${item.color}`} />
                                            </div>
                                            <p className="text-[11px] font-black uppercase tracking-widest text-white">{item.event}</p>
                                            <p className="text-[10px] text-zinc-600 leading-relaxed font-medium">{item.desc}</p>
                                            <p className="text-[9px] font-mono text-zinc-800 mt-1">{item.time}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-zinc-900 space-y-4">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700 font-black">Admin Notes</span>
                                        <p className="text-[10px] text-zinc-500 italic leading-relaxed">{selectedUser.notes || "No internal notes for this session..."}</p>
                                    </div>
                                    <Button variant="outline" className="w-full border-zinc-900 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em]">Full Security Audit</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
