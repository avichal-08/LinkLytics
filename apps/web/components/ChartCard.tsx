import React from "react";
import { 
    Globe, 
    Laptop, 
    Smartphone, 
    Tablet, 
    Compass, 
    Cpu, 
    Chrome, 
    MapPin, 
    Share2, 
    Monitor,
    type LucideIcon 
} from "lucide-react";

export type ChartDataItem = {
    name: string;
    clicks?: number | string;
    value?: number | string;
};

interface ChartCardProps {
    title: string;
    data: Record<string, number> | ChartDataItem[];
    icon?: LucideIcon;
    category?: string;
}

// Convert 2-letter country codes to full country names
const getCountryName = (code: string): string => {
    if (!code || code === "Unknown") return "Unknown";
    if (code.length === 2) {
        try {
            const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
            const resolved = regionNames.of(code.toUpperCase());
            if (resolved) return resolved;
        } catch {
            // fallback to original code
        }
    }
    return code;
};

// Clean format names for various analytics types
const formatItemName = (name: string, categoryType: string): string => {
    if (!name || name === "Unknown" || name === "null" || name === "undefined") {
        return categoryType === "referrers" ? "Direct / None" : "Unknown";
    }

    if (categoryType === "countries") {
        return getCountryName(name);
    }

    if (categoryType === "devices") {
        const lower = name.toLowerCase();
        if (lower === "desktop") return "Desktop";
        if (lower === "mobile") return "Mobile";
        if (lower === "tablet") return "Tablet";
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    if (categoryType === "referrers") {
        const lower = name.toLowerCase();
        if (lower.includes("twitter") || lower.includes("t.co") || lower === "x.com") {
            return "x.com / Twitter";
        }
        if (lower.includes("github")) return "github.com";
        if (lower.includes("linkedin")) return "linkedin.com";
        if (lower.includes("google")) return "google.com";
        return name.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
    }

    return name;
};

// Select appropriate icon for individual device items
const getItemIcon = (name: string, categoryType: string): React.ReactNode | null => {
    if (categoryType === "devices") {
        const lower = name.toLowerCase();
        if (lower.includes("desktop")) {
            return <Monitor className="h-4 w-4 text-[#888888] stroke-[1.8]" />;
        }
        if (lower.includes("mobile")) {
            return <Smartphone className="h-4 w-4 text-[#888888] stroke-[1.8]" />;
        }
        if (lower.includes("tablet")) {
            return <Compass className="h-4 w-4 text-[#888888] stroke-[1.8]" />;
        }
        return <Laptop className="h-4 w-4 text-[#888888] stroke-[1.8]" />;
    }
    return null;
};

// Default header icon and right-side label based on category title
const getCategoryDefaults = (title: string): { icon: LucideIcon; label: string } => {
    const lower = title.toLowerCase();
    if (lower.includes("country") || lower.includes("countries")) {
        return { icon: Globe, label: "Share" };
    }
    if (lower.includes("device")) {
        return { icon: Laptop, label: "Type" };
    }
    if (lower.includes("referrer")) {
        return { icon: Compass, label: "Source" };
    }
    if (lower.includes("system") || lower.includes("os")) {
        return { icon: Cpu, label: "System" };
    }
    if (lower.includes("browser")) {
        return { icon: Chrome, label: "Browser" };
    }
    if (lower.includes("cit")) {
        return { icon: MapPin, label: "City" };
    }
    return { icon: Share2, label: "Share" };
};

export function ChartCard({ 
    title, 
    data, 
    icon, 
    category 
}: ChartCardProps) {
    const defaults = getCategoryDefaults(title);
    const HeaderIcon = icon || defaults.icon;
    const categoryLabel = category || defaults.label;
    const categoryType = title.toLowerCase();

    // Normalize raw data into value pairs
    const rawItems: { name: string; value: number }[] = Array.isArray(data)
        ? data.map((d) => ({
            name: d.name || "Unknown",
            value: Number(d.clicks ?? d.value ?? 0),
        }))
        : Object.entries(data || {}).map(([name, val]) => ({
            name: name || "Unknown",
            value: Number(val || 0),
        }));

    const validItems = rawItems
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // display top 5 for optimal compactness and balance

    const totalClicks = validItems.reduce((acc, curr) => acc + curr.value, 0);

    const itemsWithPercent = validItems.map((item) => {
        const percent = totalClicks > 0 ? Math.round((item.value / totalClicks) * 100) : 0;
        return {
            ...item,
            percent,
            formattedName: formatItemName(item.name, categoryType),
            icon: getItemIcon(item.name, categoryType),
        };
    });

    return (
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 sm:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors">
            {/* Header: [icon] Title                     Label */}
            <div className="flex items-center justify-between mb-6 pb-0.5">
                <div className="flex items-center gap-2.5">
                    <HeaderIcon className="h-5 w-5 text-[#181818] stroke-[1.8] stroke-current" />
                    <h3 className="text-[19px] sm:text-[20px] font-semibold text-[#181818] tracking-tight">
                        {title}
                    </h3>
                </div>
                <span className="text-[15px] sm:text-[16px] font-normal text-[#999999]">
                    {categoryLabel}
                </span>
            </div>

            {/* Distribution Rows */}
            {itemsWithPercent.length === 0 ? (
                <div className="py-10 text-center text-sm text-[#999999]">
                    No data recorded yet
                </div>
            ) : (
                <div className="space-y-5 sm:space-y-6">
                    {itemsWithPercent.map((item, idx) => (
                        <div key={`${item.name}-${idx}`} className="space-y-2">
                            {/* Row Label and Percentage */}
                            <div className="flex items-center justify-between text-[16px] sm:text-[17px] leading-tight">
                                <div className="flex items-center gap-2.5 min-w-0 pr-3">
                                    {item.icon && (
                                        <span className="shrink-0 flex items-center">
                                            {item.icon}
                                        </span>
                                    )}
                                    <span className="text-[#181818] font-normal truncate">
                                        {item.formattedName}
                                    </span>
                                </div>
                                <span className="text-[#555555] font-normal shrink-0 pl-2">
                                    {item.percent}%
                                </span>
                            </div>

                            {/* Horizontal Progress Track & Fill */}
                            <div className="h-2.5 w-full bg-[#EBEBEB] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#181818] rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${Math.min(100, Math.max(3, item.percent))}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
