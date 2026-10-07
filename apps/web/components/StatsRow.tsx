import { Link2, MousePointerClick, TrendingUp } from "lucide-react";

interface StatsRowProps {
    totalLinks: number;
    totalClicks: number;
    clicksToday: number;
}

export function StatsRow({ totalLinks, totalClicks, clicksToday }: StatsRowProps) {
    const stats = [
        {
            label: "Total links",
            value: totalLinks.toLocaleString(),
            icon: Link2,
            description: "Active shortened links",
        },
        {
            label: "Total clicks",
            value: totalClicks.toLocaleString(),
            icon: MousePointerClick,
            description: "All-time engagements",
        },
        {
            label: "Clicks (24h)",
            value: clicksToday.toLocaleString(),
            icon: TrendingUp,
            description: "Past 24 hours traffic",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-8">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-xs transition-all hover:border-neutral-300"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                {stat.label}
                            </span>
                            <div className="h-7 w-7 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-500">
                                <Icon className="h-3.5 w-3.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-semibold tracking-tight text-neutral-900">
                            {stat.value}
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1">
                            {stat.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
