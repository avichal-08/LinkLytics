"use client";

import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import { TrendingUp } from "lucide-react";

export function ClicksTimeChart({ data }: { data: { date: string; clicks: number }[] }) {
    const strokeColor = "#181818"; 

    const totalClicks = data.reduce((acc, curr) => acc + Number(curr.clicks || 0), 0);

    return (
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 sm:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)] mb-8 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-0.5">
                <div className="flex items-center gap-2.5">
                    <TrendingUp className="h-5 w-5 text-[#181818] stroke-[1.8]" />
                    <h3 className="text-[19px] sm:text-[20px] font-semibold text-[#181818] tracking-tight">
                        Clicks Over Time
                    </h3>
                </div>
                <span className="text-[15px] sm:text-[16px] font-normal text-[#999999]">
                    Last 7 Days
                </span>
            </div>

            {/* Chart Area */}
            {data.length === 0 || totalClicks === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-sm text-[#999999]">
                    No traffic activity recorded in the past 7 days.
                </div>
            ) : (
                <div className="h-[220px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorClicksMonochrome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#181818" stopOpacity={0.12}/>
                                    <stop offset="95%" stopColor="#181818" stopOpacity={0.0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBEB" />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#888888', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#888888', fontSize: 12 }}
                                allowDecimals={false}
                            />
                            <Tooltip 
                                cursor={{ stroke: '#888888', strokeWidth: 1, strokeDasharray: '3 3' }}
                                contentStyle={{ 
                                    borderRadius: '10px', 
                                    border: '1px solid #E5E5E5', 
                                    backgroundColor: '#181818',
                                    color: '#FFFFFF',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="clicks" 
                                stroke={strokeColor} 
                                strokeWidth={2.5}
                                fillOpacity={1} 
                                fill="url(#colorClicksMonochrome)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
