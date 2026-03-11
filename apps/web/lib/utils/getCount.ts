import { RawAnalyticsData } from "../types/rawAnalyticsData";

export function getCount(data: RawAnalyticsData[], field: keyof RawAnalyticsData) {
    return data.reduce((acc, item) => {
        const value = item[field] || "Unknown";
        if ( typeof value == "string"){
            acc[value] = (acc[value] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);
}