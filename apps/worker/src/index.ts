import { Worker, type ConnectionOptions } from "bullmq";
import { redisConnection } from "@repo/queue";
import { processClickJob } from "./processor/clickProcessor";

const worker = new Worker(
  "click-events",
  async (job) => {
    return await processClickJob(job.data);
  },
  {
    connection: redisConnection as ConnectionOptions,
    concurrency: 4,
    removeOnComplete: { count: 10 },
    removeOnFail: { count: 10 },
  }
);

worker.on("ready", () => {
  console.log("Worker is ready and connected to Redis.");
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} (${job.name}) completed.`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});

worker.on("error", (err) => {
  console.error("Worker encountered an error:", err);
});

const gracefulShutdown = async () => {
  console.log("shutting down worker");
  await worker.close();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);