import { db, links, linkAnalytics } from "@repo/db";
import { eq } from "drizzle-orm";
import { parseUserAgent } from "../utils/parseUserAgent";
import { generateVisitorHash } from "../utils/visitorHash";

interface ClickJobData {
  slug: string;
  ip: string;
  userAgent: string;
  referrer: string | null;
  country: string | null;
  timestamp: string;
}

export async function processClickJob(data: ClickJobData) {
  const { slug, ip, userAgent, referrer, country, timestamp } = data;

  try {
    const linkResult = await db
      .select({ id: links.id })
      .from(links)
      .where(eq(links.slug, slug))
      .limit(1);

    const link = linkResult[0];

    if (!link) {
      return;
    }

    const uaData = parseUserAgent(userAgent);
    const visitorHash = generateVisitorHash(ip, userAgent);

    await db.insert(linkAnalytics).values({
      linkId: link.id,
      timestamp: new Date(timestamp),
      visitorHash: visitorHash,
      countryCode: country || "Unknown",
      deviceType: uaData.deviceType,
      os: uaData.os,
      browser: uaData.browser,
      referrer: referrer
    });


  } catch (error) {
    throw error;
  }
}