"use client";

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const data = [
    { time: "09:15", value: 1200 },
    { time: "10:00", value: 1350 },
    { time: "11:00", value: 1280 },
    { time: "12:00", value: 1420 },
    { time: "13:00", value: 1560 },
    { time: "14:00", value: 1680 },
    { time: "15:00", value: 1620 },
    { time: "15:30", value: 1740 },
];

export default function OverviewChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="time"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: "rgba(10, 10, 10, 0.8)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}
                    itemStyle={{ color: "#fff" }}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
