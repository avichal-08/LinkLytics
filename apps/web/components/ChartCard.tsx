"use client";

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

export type ChartDataItem = {
    name: string;
    clicks?: number | string;
    value?: number | string;
};

const formatChartData = (
    data: Record<string, number> | ChartDataItem[] | undefined
) => {
    if (!data) return [];
    if (Array.isArray(data)) {
        return data
            .map((item) => ({
                name: item.name || "Unknown",
                value: Number(item.clicks ?? item.value ?? 0),
            }))
            .filter((item) => item.value > 0)
            .sort((a, b) => b.value - a.value);
    }
    return Object.entries(data)
        .map(([name, value]) => ({ name: name || "Unknown", value: Number(value) }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value); 
};

export function ChartCard({ 
    title, 
    data 
}: { 
    title: string; 
    data: Record<string, number> | ChartDataItem[];
}) {
    const chartData = formatChartData(data);

    const barColor = "#2563eb";

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
                                    tick={{ fill: '#6b7280' }}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ 
                                        borderRadius: '8px', 
                                        border: '1px solid #e5e7eb', 
                                        backgroundColor: '#ffffff',
                                        color: '#030712'
                                    }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                    {chartData.map((_, index) => (
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
