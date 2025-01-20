import { QUEUE } from "@/utils/enums";
import { Queue } from "bullmq";

export const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const mainQueue: Queue = new Queue(QUEUE.MAIN_QUEUE, {
  connection: connection,
});
export const deadLetterQueue: Queue = new Queue(QUEUE.DEAD_LETTER_QUEUE, {
  connection: connection,
  defaultJobOptions: {
    delay: 2000,
  }
});
