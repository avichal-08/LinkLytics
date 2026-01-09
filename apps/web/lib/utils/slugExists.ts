import { db } from "@repo/db";
import { links } from "@repo/db";
import { eq } from "drizzle-orm";

export default async function slugExists(slug: string): Promise<boolean> {
  try {
    const existing = await db
      .select({ slug: links.slug })
      .from(links)
      .where(eq(links.slug, slug))
      .limit(1);

    return existing.length > 0;
  } catch (err) {
    throw new Error("Database error while checking slug");
  }
}
