import express from "express";
import Redis from "ioredis";
import { Kafka, Partitioners } from "kafkajs";

import { db, eq, links } from "@repo/db";

// Workaround for KafkaJS negative timeout warning in Bun
const originalSetTimeout = globalThis.setTimeout;
globalThis.setTimeout = function (fn: any, delay?: any, ...args: any[]) {
  return originalSetTimeout(
    fn,
    typeof delay === "number" && delay < 0 ? 0 : delay,
    ...args
  );
} as any;

const app = express();
const port = process.env.PORT || 3001;

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    return Math.min(times * 500, 5000);
  },
});

redis.on("error", (err) => {
  console.error("[Redis Connection Error]:", err.message);
});

const kafka = new Kafka({
  clientId: "redirect-service",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

app.disable("x-powered-by");
app.set("etag", false);
app.set("trust proxy", 1);

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.get("/:slug", async (req, res) => {
  const slug = req.params.slug as string;

  try {
    const hit = await redis.get(`slug:${slug}`).catch((err) => {
      console.error("[Redis get failed, falling back to DB]:", err.message);
      return null;
    });

    let destinationUrl: string;
    let linkId: string;

    if (hit) {
      //negative caching check: if we previously cached a 404
      if (hit === "NOT_FOUND") {
        return res.redirect(307, "/not-found");
      }

      const parsed = JSON.parse(hit);
      destinationUrl = parsed.url;
      linkId = parsed.linkId;
    } else {
      // DB fallback
      const result = await db
        .select({ originalUrl: links.destinationUrl, id: links.id })
        .from(links)
        .where(eq(links.slug as any, slug))
        .limit(1);

      if (!result.length || !result[0]?.originalUrl) {
        //negative cache: prevent DB DoS for dead links (60 seconds)
        await redis.set(`slug:${slug}`, "NOT_FOUND", "EX", 60).catch(() => {});
        return res.redirect(307, "/not-found");
      }

      destinationUrl = result[0].originalUrl;
      linkId = result[0].id;

      //update redis cache (with 24h TTL)
      await redis
        .set(
          `slug:${slug}`,
          JSON.stringify({ url: destinationUrl, linkId }),
          "EX",
          86400
        )
        .catch(() => {});
    }

    res.redirect(302, destinationUrl);

    producer
      .send({
        topic: "click-events",
        messages: [
          {
            value: JSON.stringify({
              v: 1,
              linkId,
              ip: req.ip,
              ua: req.get("user-agent") || "Unknown",
              ts: Date.now(),
            }),
          },
        ],
      })
      .catch((err) => console.error("Kafka publish failed:", err.message));
  } catch (err) {
    console.error("Redirect error:", err);
    res.status(500).send("Internal Server Error");
  }
});

const server = app.listen(port, async () => {
  console.log(`redirect service running on port ${port}`);
  try {
    await producer.connect();
    console.log("Connected to Kafka producer successfully");
  } catch (err: any) {
    console.error("Failed to connect Kafka producer:", err.message);
  }
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

async function shutdown() {
  console.log("shutting down gracefully...");
  server.close(async () => {
    try {
      await producer.disconnect();
    } catch {}
    try {
      await redis.quit();
    } catch {}
    process.exit(0);
  });
}
