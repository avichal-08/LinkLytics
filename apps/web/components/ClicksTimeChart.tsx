"use client";

import { useTheme } from "next-themes";
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ClicksTimeChart({ data }: { data: { date: string; clicks: number }[] }) {
    const { resolvedTheme } = useTheme();
    const strokeColor = resolvedTheme === "dark" ? "#3b82f6" : "#2563eb"; 
    const fillColor = resolvedTheme === "dark" ? "rgba(59, 130, 246, 0.2)" : "rgba(37, 99, 235, 0.2)";

    return (
        <Card className="border-border shadow-sm bg-card text-card-foreground mb-6">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Clicks Over Time (Last 7 Days)
                </CardTitle>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                        Not enough data to display trends.
                    </div>
                ) : (
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'} />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                                    allowDecimals={false}
                                />
                                <Tooltip 
                                    cursor={{ stroke: resolvedTheme === 'dark' ? '#4b5563' : '#d1d5db', strokeWidth: 1, strokeDasharray: '3 3' }}
                                    contentStyle={{ 
                                        borderRadius: '8px', 
                                        border: `1px solid ${resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'}`, 
                                        backgroundColor: resolvedTheme === 'dark' ? '#030712' : '#ffffff',
                                        color: resolvedTheme === 'dark' ? '#f9fafb' : '#030712'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="clicks" 
                                    stroke={strokeColor} 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorClicks)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}