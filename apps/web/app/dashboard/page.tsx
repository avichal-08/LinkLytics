import { db, links, linkAnalytics } from "@repo/db";
import { eq, and, desc, count, sql, gte } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/configs/authOptions";

import { Header } from "@/components/Header";
import { CreateLinkButton } from "@/components/CreateLinkButton";
import { StatsRow } from "@/components/StatsRow";
import { LinksManager } from "@/components/LinksManager";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    // 1. Fetch user's links with aggregate click count
    const userLinks = await db
        .select({
            id: links.id,
            slug: links.slug,
            destinationUrl: links.destinationUrl,
            createdAt: links.createdAt,
            clicks: count(linkAnalytics.id),
        })
        .from(links)
        .leftJoin(linkAnalytics, eq(links.id, linkAnalytics.linkId))
        .where(eq(links.userId, session.user.id))
        .groupBy(links.id, links.slug, links.destinationUrl, links.createdAt)
        .orderBy(desc(links.createdAt));

    // 2. Fetch past 24h click count across all user links
    const [todayStats] = await db
        .select({
            clicksToday: count(linkAnalytics.id),
        })
        .from(linkAnalytics)
        .innerJoin(links, eq(linkAnalytics.linkId, links.id))
        .where(
            and(
                eq(links.userId, session.user.id),
                gte(linkAnalytics.timestamp, sql`now() - interval '24 hours'`)
            )
        );

    const totalLinks = userLinks.length;
    const totalClicks = userLinks.reduce((acc, curr) => acc + Number(curr.clicks || 0), 0);
    const clicksToday = Number(todayStats?.clicksToday || 0);

    return (
        <div className="min-h-screen bg-neutral-50/30 flex flex-col text-foreground">
            <Header user={session.user} />

            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Small Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3 font-medium">
                    <span>Dashboard</span>
                    <span className="text-neutral-300">/</span>
                    <span className="text-neutral-900">Links</span>
                </div>

                {/* Page Heading & Primary CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-950 font-display">
                            Links
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Create, manage, and track your shortened links.
                        </p>
                    </div>

                    <CreateLinkButton />
                </div>

                {/* Summary / Stats Row */}
                <StatsRow
                    totalLinks={totalLinks}
                    totalClicks={totalClicks}
                    clicksToday={clicksToday}
                />

                {/* Search, Filter, and Resource List */}
                <LinksManager initialLinks={userLinks} />
            </main>
        </div>
    );
}
