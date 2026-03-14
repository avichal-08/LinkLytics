import { NextRequest } from "next/server";
import { clickQueue } from "@repo/queue";

export default async function clickToQueue(req: NextRequest, slug: string) {
  try {

    const rawCity = req.headers.get("x-vercel-ip-city");
    const decodedCity = rawCity ? decodeURIComponent(rawCity) : null;

    const analyticsPayload = {
      slug,
      timestamp: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1",
      userAgent: req.headers.get("user-agent") || "",
      referrer: req.headers.get("referer") || null,
      country: req.headers.get("x-vercel-ip-country") || null,
      city: decodedCity
    };

    await clickQueue.add("process-click", analyticsPayload, {
      removeOnComplete: true,
      removeOnFail: false,
    });

  } catch (error) {
    console.error("Failed to queue analytics:", error);
  }
}