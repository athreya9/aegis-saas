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
                const res = await fetch('http://91.98.226.5:4100/api/v1/admin/users', {
                    headers: { 'x-user-role': 'ADMIN' }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    const mapped = data.data.map((u: any) => ({
                        id: u.user_id,
                        name: u.email.split('@')[0],
                        email: u.email,
                        plan: u.plan_type || "STARTER",
                        status: u.status || "ACTIVE",
                        broker: u.broker_name || "-",
                        brokerStatus: u.broker_status || "NOT_CONFIGURED",
                        executionMode: u.execution_mode || "SANDBOX",
                        joined: new Date(u.created_at).toLocaleDateString(),
                        apiStatus: u.broker_status === "CONNECTED" ? "Active" : "Inactive",
                        lastActivity: "Now",
                        riskProfile: "BALANCED" // Default for now
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

    const handleAction = async (id: string, action: string) => {
        try {
            let endpoint = '';
            let method = 'POST';
            let body = {};

            switch (action) {
                case "APPROVE":
                case "RESUME":
                case "UNBLOCK":
                    endpoint = `/api/v1/admin/users/${id}/status`;
                    body = { status: 'ACTIVE' };
                    break;
                case "PAUSE":
                    endpoint = `/api/v1/admin/users/${id}/status`;
                    body = { status: 'PAUSED' };
                    break;
                case "BLOCK":
                    endpoint = `/api/v1/admin/users/${id}/status`;
                    body = { status: 'BLOCKED' };
                    break;
                case "FORCE_LOGOUT":
                case "KILL_SESSION":
                    endpoint = `/api/v1/admin/users/${id}/kill`;
                    break;
                default:
                    alert("Action not implemented yet");
                    return;
            }

            const res = await fetch(`http://91.98.226.5:4100${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': 'ADMIN'
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (data.status === 'success') {
                // Refresh list
                const resUsers = await fetch('http://91.98.226.5:4100/api/v1/admin/users', { headers: { 'x-user-role': 'ADMIN' } });
                const dataUsers = await resUsers.json();
                if (dataUsers.status === 'success') {
                    const mapped = dataUsers.data.map((u: any) => ({
                        id: u.user_id,
                        name: u.email.split('@')[0],
                        email: u.email,
                        plan: u.plan_type || "STARTER",
                        status: u.status || "ACTIVE",
                        broker: u.broker_name || "-",
                        brokerStatus: u.broker_status || "NOT_CONFIGURED",
                        executionMode: u.execution_mode || "SANDBOX",
                        joined: new Date(u.created_at).toLocaleDateString(),
                        apiStatus: u.broker_status === "CONNECTED" ? "Active" : "Inactive",
                        lastActivity: "Now",
                        riskProfile: "BALANCED"
                    }));
                    setUsers(mapped);
                }
                alert("Action Successful: " + data.message);
            } else {
                alert("Action Failed: " + data.message);
            }
        } catch (e: any) {
            alert("System Error: " + e.message);
        }
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

                    {/* Desktop Table View */}
                    <Card className="hidden md:block bg-[#050505] border-zinc-900 overflow-hidden shadow-2xl">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-zinc-900 bg-zinc-950/50">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Context</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Plan / Broker</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Broker Health</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Execution Mode</th>
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
                                                    <Badge variant="outline" className={`${user.brokerStatus === "CONNECTED" ? "border-emerald-500/20 text-emerald-500" :
                                                        user.brokerStatus === "EXPIRED" ? "border-amber-500/20 text-amber-500" :
                                                            user.brokerStatus === "DISABLED" ? "border-rose-500/20 text-rose-500" :
                                                                "border-zinc-800 text-zinc-600"
                                                        } text-[9px] px-2 py-0 uppercase font-black tracking-wider`}>
                                                        {user.brokerStatus.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <Badge variant="outline" className={`${user.executionMode === "LIVE" ? "bg-red-500 text-white border-red-500" :
                                                        user.executionMode === "REQUESTED" ? "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse" :
                                                            "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                        } text-[9px] px-2 py-0.5 uppercase font-black tracking-wider`}>
                                                        {user.executionMode}
                                                    </Badge>
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

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {users.map((user) => (
                            <Card key={user.id} className="bg-[#050505] border-zinc-900" onClick={() => setSelectedUser(user)}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center font-black text-indigo-500 border border-indigo-500/20">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white tracking-tight">{user.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Badge variant="outline" className="border-zinc-800 text-zinc-500 py-0 text-[9px] uppercase font-bold tracking-widest">{user.plan}</Badge>
                                                    <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">{user.broker}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={`${user.executionMode === "LIVE" ? "bg-red-500 text-white border-red-500" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"} text-[9px] px-2 py-0.5 uppercase font-black tracking-wider`}>
                                            {user.executionMode}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                                        <div>
                                            <p className="text-zinc-600 uppercase tracking-widest text-[9px] font-black">Broker Status</p>
                                            <p className={user.brokerStatus === "CONNECTED" ? "text-emerald-500" : "text-zinc-500"}>{user.brokerStatus}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-zinc-600 uppercase tracking-widest text-[9px] font-black">Risk Profile</p>
                                            <p className="text-white">{user.riskProfile}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="w-full text-xs" onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}>
                                        View Details / Audit
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
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

                                    <div className="pt-6 border-t border-zinc-900">
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700 mb-3">Broker Governance</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="outline" className="border-amber-900/40 text-amber-600 hover:bg-amber-950/30 hover:text-amber-500 text-[9px] font-bold uppercase" onClick={() => handleAction(selectedUser.id, "FORCE_REAUTH")}>
                                                Force Re-auth
                                            </Button>
                                            <Button variant="outline" className="border-rose-900/40 text-rose-600 hover:bg-rose-950/30 hover:text-rose-500 text-[9px] font-bold uppercase" onClick={() => handleAction(selectedUser.id, "DISABLE_BROKER")}>
                                                Disable Access
                                            </Button>
                                        </div>
                                    </div>

                                    {selectedUser.executionMode !== 'SANDBOX' && (
                                        <div className="pt-6 border-t border-zinc-900">
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700 mb-3">Live Execution Controls</p>
                                            <div className="grid grid-cols-1 gap-3">
                                                {selectedUser.executionMode === 'REQUESTED' && (
                                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest" onClick={() => handleAction(selectedUser.id, "APPROVE_LIVE")}>
                                                        Approve Live Mode
                                                    </Button>
                                                )}
                                                <Button variant="destructive" className="w-full bg-red-900/20 text-red-500 hover:bg-red-900/40 text-[10px] font-black uppercase tracking-widest border border-red-900/50" onClick={() => handleAction(selectedUser.id, "FORCE_SANDBOX")}>
                                                    Downgrade to Sandbox
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
