"use client";

import { useTheme } from "next-themes";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    Cell 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatChartData = (data: Record<string, number> | undefined) => {
    if (!data) return [];
    return Object.entries(data)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value); 
};

export function ChartCard({ title, data }: { title: string, data: Record<string, number> }) {
    const { resolvedTheme } = useTheme();
    const chartData = formatChartData(data);

    const barColor = resolvedTheme === "dark" ? "#3b82f6" : "#2563eb";

    return (
        <Card className="border-border shadow-sm bg-card text-card-foreground">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                        No data yet
                    </div>
                ) : (
                    <div className="h-[200px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    fontSize={12}
                                    width={90}
                                    tick={{ fill: resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280' }}
                                />
                                <Tooltip 
                                    cursor={{ fill: resolvedTheme === 'dark' ? '#1f2937' : '#f3f4f6' }}
                                    contentStyle={{ 
                                        borderRadius: '8px', 
                                        border: `1px solid ${resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'}`, 
                                        backgroundColor: resolvedTheme === 'dark' ? '#030712' : '#ffffff',
                                        color: resolvedTheme === 'dark' ? '#f9fafb' : '#030712'
                                    }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={barColor} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}