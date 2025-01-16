import { Job, Worker } from "bullmq";
import { connection } from "./broker-setup";
import { QUEUE } from "@/utils/enums";
import { publishToQueue } from "./publisher";
import { processEvent } from "@/utils/helper";

const mainQueueWorker = new Worker(
  QUEUE.MAIN_QUEUE,
  async (job: Job) => {
    return await processEvent(job.data);
  },
  {
    // we can rate limiter here !!! remember
    connection: connection,
    concurrency: 5,
  }
);

mainQueueWorker.on("completed", (job: Job, returnvalue: any) => {
  console.log(`[Main-Queue] ${job.id} is completed now, returnValue:  ${returnvalue}`);
});

mainQueueWorker.on("failed", async (job: Job | undefined, err: Error) => {
  console.log(`[Main-Queue] ${job.id} has failed after attempting ${job.attemptsMade}(times) err_message: ${err.message}`);
  const jobState = await job.getState();
  const condition: boolean = job.attemptsMade >= job.opts.attempts;

  if (jobState !== "completed" && condition) {
    console.log("[Main-Queue] Max retring done!")
    await publishToQueue(QUEUE.DEAD_LETTER_QUEUE, job.data);
  }
});




const dlqWorker = new Worker(
  QUEUE.DEAD_LETTER_QUEUE,
  async (job: Job) => {
    return await processEvent(job.data);
  },
  {
    // we can rate limiter here !!! remember
    connection: connection,
    concurrency: 5,
  }
);

dlqWorker.on("completed", (job: Job, returnvalue: any) => {
  console.log(`[Main-Queue] ${job.id} is completed now, returnValue:  ${returnvalue}`);
});

dlqWorker.on("failed", async (job: Job | undefined, err: Error) => {
  console.log(`[Main-Queue] ${job.id} has failed after attempting ${job.attemptsMade}(times) err_message: ${err.message}`);
  const jobState = await job.getState();
  const condition: boolean = job.attemptsMade >= job.opts.attempts;

  if (jobState !== "completed" && condition) {
    console.log("[Main-Queue] job Processing failed even in dlq!");
  }
});