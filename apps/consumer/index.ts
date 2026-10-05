import crypto from "crypto";
import { Kafka } from "kafkajs";
import { UAParser } from "ua-parser-js";

import { db, linkAnalytics } from "@repo/db";

// Workaround for KafkaJS negative timeout warning in Bun
const originalSetTimeout = globalThis.setTimeout;
globalThis.setTimeout = function (fn: any, delay?: any, ...args: any[]) {
  return originalSetTimeout(
    fn,
    typeof delay === "number" && delay < 0 ? 0 : delay,
    ...args
  );
} as any;

const kafka = new Kafka({
  clientId: "click-worker",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
});

const consumer = kafka.consumer({ groupId: "click-ingester-group" });

const getDailySalt = () => new Date().toISOString().split("T")[0];

async function run() {
  await consumer.connect();
  console.log("Worker connected to Kafka consumer group: click-ingester-group");

  await consumer.subscribe({ topic: "click-events", fromBeginning: false });

  await consumer.run({
    eachBatch: async ({ batch }) => {
      const messages = batch.messages;
      if (messages.length === 0) return;

      console.log(
        `[Worker] Processing batch of ${messages.length} click event(s)`
      );

      const clickRecords = [];
      for (const msg of messages) {
        try {
          if (!msg.value) continue;
          const data = JSON.parse(msg.value.toString());
          if (!data.linkId) continue;

          const parser = new UAParser(data.ua || "");
          const browser = parser.getBrowser();
          const os = parser.getOS();
          const device = parser.getDevice();

          const visitorHash = crypto
            .createHash("sha256")
            .update(
              `${data.ip || ""}-${data.ua || ""}-${process.env.HASH_SALT || getDailySalt()}`
            )
            .digest("hex");

          clickRecords.push({
            linkId: data.linkId,
            timestamp: new Date(data.ts || Date.now()),
            visitorHash,
            deviceType: device.type || "desktop",
            os: os.name || "Unknown",
            browser: browser.name || "Unknown",
            city: data.city || null,
            countryCode: data.country || null,
          });
        } catch (parseErr: any) {
          console.error(
            "[Worker] Corrupt message payload skipped:",
            parseErr.message
          );
        }
      }

      if (clickRecords.length === 0) return;

      try {
        await db.insert(linkAnalytics).values(clickRecords);
        console.log(
          `[Worker] Successfully inserted ${clickRecords.length} record(s)`
        );
      } catch (error: any) {
        console.warn(
          "[Worker] Batch insert failed, falling back to row-by-row insertion:",
          error.message
        );
        for (const record of clickRecords) {
          try {
            await db.insert(linkAnalytics).values(record);
          } catch (rowErr: any) {
            console.error(
              `[Worker] Skipped record (linkId: ${record.linkId}):`,
              rowErr.message
            );
          }
        }
      }
    },
  });
}

run().catch(console.error);

const shutdown = async () => {
  console.log("Shutting down worker gracefully...");
  try {
    await consumer.disconnect();
  } catch (err) {
    console.error("Error disconnecting consumer", err);
  }
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
