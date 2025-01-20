import { Job, Worker } from "bullmq";
import { connection } from "./brokerSetup";
import { EventRequestType } from "@/utils/types";
import { QUEUE } from "@/utils/enums";
import { processEvent } from "./processor";

const mainQueueWorker = new Worker(
  QUEUE.MAIN_QUEUE,
  async (job: Job) => {
    await processEvent(job.data as EventRequestType);
  },
  {
    // we can rate limiter here !!! remember
    connection: connection,
    concurrency: 5,
  }
);

const dlqWorker = new Worker(
  QUEUE.DEAD_LETTER_QUEUE,
  async (job: Job) => {
    await processEvent(job.data as EventRequestType);
  },
  {
    // we can rate limiter here !!! remember
    connection: connection,
    concurrency: 5,
    
  }
);
