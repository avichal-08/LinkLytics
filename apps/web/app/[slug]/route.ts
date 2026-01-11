import { NextRequest, NextResponse } from "next/server";
import { redis } from "../../lib/configs/redis";
import clickToQueue from "../../lib/server/clickToQueue";
import { db, links } from "@repo/db";
import { eq } from "drizzle-orm";

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { slug } = await params;

    const cachedUrl = await redis.get<string>(`slug:${slug}`);

    if (cachedUrl) {
        await clickToQueue(req, slug);
        return NextResponse.redirect(cachedUrl, 302);
    }

    const result = await db
        .select({ originalUrl: links.destinationUrl })
        .from(links)
        .where(eq(links.slug, slug))
        .limit(1);

    if (!result.length) {
        return NextResponse.redirect(new URL("/not-found", req.url));
    }
    const destinationUrl = result[0]?.originalUrl;

    if (!destinationUrl) {
        return NextResponse.redirect(new URL("/not-found", req.url));
    }

    await redis.set(`slug:${slug}`, destinationUrl);

    await clickToQueue(req, slug);
    return NextResponse.redirect(destinationUrl, 302);
}
