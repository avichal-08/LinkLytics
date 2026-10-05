import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { db, links, linkAnalytics } from "@repo/db";
import { eq, and, desc, sql, count, countDistinct } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ linkId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { linkId } = await params;

        const link = await db.query.links.findFirst({
            where: and(
                eq(links.id, linkId),
                eq(links.userId, session.user.id)
            )
        });

        if (!link) {
            return new NextResponse("Link not found", { status: 404 });
        }

        const buildStatQuery = (column: any) =>
            db.select({
                name: sql<string>`COALESCE(${column}, 'Unknown')`,
                clicks: count()
            })
            .from(linkAnalytics)
            .where(eq(linkAnalytics.linkId, linkId))
            .groupBy(column)
            .orderBy(desc(count()))
            .limit(10);

        const [
            [totals],
            devices,
            os,
            browsers,
            countries,
            cities,
            referrers
        ] = await Promise.all([
            db.select({
                totalClicks: count(),
                uniqueVisitors: countDistinct(linkAnalytics.visitorHash)
            })
            .from(linkAnalytics)
            .where(eq(linkAnalytics.linkId, linkId)),

            buildStatQuery(linkAnalytics.deviceType),
            buildStatQuery(linkAnalytics.os),
            buildStatQuery(linkAnalytics.browser),
            buildStatQuery(linkAnalytics.countryCode),
            buildStatQuery(linkAnalytics.city),
            buildStatQuery(linkAnalytics.referrer)
        ]);

        return NextResponse.json({
            meta: {
                slug: link.slug,
                destinationUrl: link.destinationUrl,
                createdAt: link.createdAt
            },
            summary: {
                totalClicks: totals?.totalClicks || 0,
                uniqueVisitors: totals?.uniqueVisitors || 0
            },
            analytics: {
                devices,
                os,
                browsers,
                countries,
                cities,
                referrers
            }
        });

    } catch (error) {
        console.error("[ANALYTICS_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
