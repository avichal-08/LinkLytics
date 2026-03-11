import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/configs/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db";
import { links, linkAnalytics } from "@repo/db";
import { eq, and, desc } from "drizzle-orm";
import getCount from "../../../../lib/utils/getCount";
import { RawAnalyticsData } from "../../../../lib/types/rawAnalyticsData";

export async function GET(req: NextRequest, { params }: { params: { linkId: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { linkId } = params;
        const userId = session?.user.id;

        const link = await db.query.links.findFirst({
            where: and(
                eq(links.id, linkId),
                eq(links.userId, session.user.id)
            )
        });

        if (!link) {
            return new NextResponse("Link not found", { status: 404 });
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

        return NextResponse.json({
            meta: {
                slug: link.slug,
                destinationUrl: link.destinationUrl,
                createdAt: link.createdAt
            },
            summary: {
                totalClicks,
                uniqueVisitors
            },
            analytics: stats,
            allClicks: analyticsData
        });

    } catch (error) {
        console.error("[ANALYTICS_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}