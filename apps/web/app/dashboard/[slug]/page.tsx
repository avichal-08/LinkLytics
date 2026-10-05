import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { and, count, countDistinct, desc, eq, gte, sql } from "drizzle-orm";
import {
  ArrowLeft,
  ExternalLink,
  MousePointerClick,
  Users,
} from "lucide-react";

import { db, linkAnalytics, links } from "@repo/db";

import { ChartCard } from "@/components/ChartCard";
import { ClicksTimeChart } from "@/components/ClicksTimeChart";
import { CopyButton } from "@/components/CopyButton";
import { LinkDeleteButton } from "@/components/LinkDeleteButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/configs/authOptions";

export default async function LinkAnalyticsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/api/auth/signin");
  }

  const linkData = await db.query.links.findFirst({
    where: and(eq(links.slug, slug), eq(links.userId, session.user.id)),
    columns: {
      id: true,
      slug: true,
      destinationUrl: true,
      createdAt: true,
    },
  });

  if (!linkData) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        Link not found or you do not have permission to view it.
      </div>
    );
  }

  const buildStatQuery = (column: any) =>
    db
      .select({
        name: sql<string>`COALESCE(${column}, 'Unknown')`,
        clicks: count(),
      })
      .from(linkAnalytics)
      .where(eq(linkAnalytics.linkId, linkData.id))
      .groupBy(column)
      .orderBy(desc(count()))
      .limit(10);

  const [
    [totals],
    rawTimeSeries,
    devices,
    os,
    browsers,
    countries,
    cities,
    referrers,
  ] = await Promise.all([
    db
      .select({
        totalClicks: count(),
        uniqueVisitors: countDistinct(linkAnalytics.visitorHash),
      })
      .from(linkAnalytics)
      .where(eq(linkAnalytics.linkId, linkData.id)),

    db
      .select({
        date: sql<string>`to_char(${linkAnalytics.timestamp} at time zone 'UTC', 'YYYY-MM-DD')`,
        clicks: count(),
      })
      .from(linkAnalytics)
      .where(
        and(
          eq(linkAnalytics.linkId, linkData.id),
          gte(linkAnalytics.timestamp, sql`now() - interval '6 days'`)
        )
      )
      .groupBy(
        sql`to_char(${linkAnalytics.timestamp} at time zone 'UTC', 'YYYY-MM-DD')`
      )
      .orderBy(sql`min(${linkAnalytics.timestamp})`),

    buildStatQuery(linkAnalytics.deviceType),
    buildStatQuery(linkAnalytics.os),
    buildStatQuery(linkAnalytics.browser),
    buildStatQuery(linkAnalytics.countryCode),
    buildStatQuery(linkAnalytics.city),
    buildStatQuery(linkAnalytics.referrer),
  ]);

  // Fill in missing days with 0 clicks for the chart
  const now = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const localIso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const utcIso = d.toISOString().slice(0, 10);
    const dateStr = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const found = rawTimeSeries.find(
      (row) => row.date === localIso || row.date === utcIso
    );

    return {
      date: dateStr,
      clicks: found ? Number(found.clicks) : 0,
    };
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col space-y-8 p-8">
      <div>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-primary mb-4 -ml-4"
          asChild
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-primary mb-2 text-2xl font-bold">
              https://linklytics-two.vercel.app/{linkData.slug}
            </h1>
            <CopyButton
              text={`https://linklytics-two.vercel.app/${linkData.slug}`}
            />
          </div>
          <LinkDeleteButton link={{ id: linkData.id, slug: linkData.slug }} />
        </div>
        <a
          href={linkData.destinationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground flex items-center gap-1 text-sm transition-colors hover:text-blue-500"
        >
          {linkData.destinationUrl} <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <ClicksTimeChart data={last7Days} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totals?.totalClicks || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Visitors
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totals?.uniqueVisitors || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ChartCard title="Devices" data={devices} />
        <ChartCard title="Operating Systems" data={os} />
        <ChartCard title="Browsers" data={browsers} />
        <ChartCard title="Countries" data={countries} />
        <ChartCard title="Cities" data={cities} />
        <ChartCard title="Referrers" data={referrers} />
      </div>
    </div>
  );
}
