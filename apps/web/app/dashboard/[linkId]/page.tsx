import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { db, links, linkAnalytics } from "@repo/db";
import { eq, and, desc } from "drizzle-orm";
import { getCount } from "@/lib/utils/getCount";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MousePointerClick, Users, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClicksTimeChart } from "@/components/ClicksTimeChart";
import { Button } from "@/components/ui/button";
import { ChartCard } from "@/components/ChartCard";

export default async function LinkAnalyticsPage({ params }: { params: { linkId: string } }) {
    const { linkId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        redirect("/api/auth/signin");
    }

    const linkData = await db.query.links.findFirst({
        where: and(
            eq(links.id, linkId),
            eq(links.userId, session.user.id)
        ),
        columns: {
            slug: true,
            destinationUrl: true,
            createdAt: true
        }
    });

    if (!linkData) {
        return <div className="p-8 text-center text-muted-foreground">Link not found or you do not have permission to view it.</div>;
    }

    const analyticsData = await db
        .select()
        .from(linkAnalytics)
        .where(eq(linkAnalytics.linkId, linkId))
        .orderBy(desc(linkAnalytics.timestamp));

    const totalClicks = analyticsData.length;
    const uniqueVisitors = new Set(analyticsData.map(a => a.visitorHash)).size;

    const stats = {
        countries: getCount(analyticsData, "countryCode"),
        cities: getCount(analyticsData, "city"),
        devices: getCount(analyticsData, "deviceType"),
        os: getCount(analyticsData, "os"),
        browsers: getCount(analyticsData, "browser"),
        referrers: getCount(analyticsData, "referrer"),
    };

    const processTimeSeries = (data: typeof analyticsData) => {
        const counts: Record<string, number> = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            counts[dateStr] = 0;
        }

        data.forEach(click => {
            const dateStr = new Date(click.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (counts[dateStr] !== undefined) {
                counts[dateStr]++;
            }
        });

        return Object.entries(counts).map(([date, clicks]) => ({ date, clicks }));
    };

    const timeSeriesData = processTimeSeries(analyticsData);

    return (
        <div className="max-w-5xl mx-auto p-8 flex flex-col min-h-screen space-y-8">

            <div>
                <Button variant="ghost" className="-ml-4 mb-4 text-muted-foreground hover:text-primary">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                    </Link>
                </Button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-primary mb-2">
                            /{linkData.slug}
                        </h1>
                        <a
                            href={linkData.destinationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-blue-500 flex items-center gap-1 text-sm transition-colors"
                        >
                            {linkData.destinationUrl} <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </div>
            </div>

            <ClicksTimeChart data={timeSeriesData} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalClicks}</div>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{uniqueVisitors}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ChartCard title="Devices" data={stats.devices} />
                <ChartCard title="Operating Systems" data={stats.os} />
                <ChartCard title="Browsers" data={stats.browsers} />
                <ChartCard title="Countries" data={stats.countries} />
                <ChartCard title="Cities" data={stats.cities} />
                <ChartCard title="Referrers" data={stats.referrers} />
            </div>
        </div>
    );
}