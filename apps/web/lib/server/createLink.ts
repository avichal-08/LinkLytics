import { isValidUrl } from "../utils/isValidUrl";
import slug from "../utils/slug";
import { db, links } from "@repo/db";
import { redis } from "../configs/redis";

export default async function createLink(url: string, userId: string) {
    try {
        const isUrlValid = isValidUrl(url);
        if (!isUrlValid) {
            console.error("createLink: invalid URL:", url);
            return false;
        }

        const redirectSlug = await slug();

        const [newLink] = await db.insert(links).values({
            slug: redirectSlug,
            destinationUrl: url,
            userId,
            createdAt: new Date()
        }).returning({ id: links.id });

        // Non-blocking cache update with 24h TTL
        try {
            await redis.set(
                `slug:${redirectSlug}`,
                JSON.stringify({ url, linkId: newLink?.id }),
                "EX",
                86400
            );
        } catch (cacheErr: any) {
            console.warn("[Redis Cache Error in createLink]:", cacheErr?.message || cacheErr);
        }

        return `http://localhost:3001/${redirectSlug}`;
    } catch (error) {
        console.error("createLink failed:", error);
        return false;
    }
}
