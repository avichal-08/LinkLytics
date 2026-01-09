import { isValidUrl } from "../utils/isValidUrl";
import slug from "../utils/slug";
import { db, links } from "@repo/db";
import { redis } from "../configs/redis";

export default async function createLink(url: string, userId: string) {
    try {
        const isUrlValid = isValidUrl(url);
        if (!isUrlValid) {
            return false;
        }

        const redirectSlug = await slug();

        await db.insert(links).values({
            slug:redirectSlug,
            destinationUrl:url,
            userId,
            createdAt:new Date()
        })

        await redis.set(`slug:${redirectSlug}`, url);

        return `http://localhost:3000/${redirectSlug}`;
    } catch (error) {
        return false;
    }
}