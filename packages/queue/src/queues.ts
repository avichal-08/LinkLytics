import { Queue, type ConnectionOptions } from "bullmq";
import { redisConnection } from "./redis";

export const clickQueue = new Queue("click-events", {
  connection: redisConnection as ConnectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});
