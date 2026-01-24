"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const data = [
    { strike: "21000", exposure: 120, risk: "low" },
    { strike: "21100", exposure: 300, risk: "medium" },
    { strike: "21200", exposure: 450, risk: "high" },
    { strike: "21300", exposure: 200, risk: "low" },
    { strike: "21400", exposure: 150, risk: "low" },
    { strike: "21500", exposure: 400, risk: "medium" },
    { strike: "21600", exposure: 80, risk: "low" },
]

export function RiskHeatmap() {
    return (
        <div className="vercel-card flex flex-col h-full bg-[#050505] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#111] flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight">Risk Exposure Heatmap</h3>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Strike Concentration</div>
            </div>

            <div className="flex-1 p-6 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                        <XAxis
                            dataKey="strike"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                            contentStyle={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="exposure" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.risk === 'high' ? '#f43f5e' : entry.risk === 'medium' ? '#fbbf24' : '#10b981'}
                                    fillOpacity={0.6}
                                    className="hover:fill-opacity-100 transition-all duration-300"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="p-4 border-t border-[#111] grid grid-cols-3 gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Stable</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Watch</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500/60" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Critical</span>
                </div>
            </div>
        </div>
    )
}
