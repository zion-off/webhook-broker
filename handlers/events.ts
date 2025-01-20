import { Job, QueueEvents } from "bullmq";
import { QUEUE } from "@/utils/enums";
import { connection, mainQueue } from "./brokerSetup";
import { publishToQueue } from "./publisher";

const mainQueueEvents = new QueueEvents(QUEUE.MAIN_QUEUE, {
  connection: connection,
});

mainQueueEvents.on("waiting", ({ jobId }) => {
  console.log(`Job with ID ${jobId} is currently waiting in the main queue.`);
});

mainQueueEvents.on("active", ({ jobId, prev }) => {
  console.log(
    `Job with ID ${jobId} is now active in the main queue. Previous status: ${prev}.`
  );
});

mainQueueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(
    `Job with ID ${jobId} has completed successfully in the main queue. Return value: ${returnvalue}.`
  );
});

mainQueueEvents.on("failed", async ({ jobId, failedReason }) => {
  console.log(
    `Job with ID ${jobId} has failed in the main queue. Reason: ${failedReason}.`
  );
  const job = await Job.fromId(mainQueue, jobId);
  await publishToQueue(QUEUE.DEAD_LETTER_QUEUE, job?.data, jobId, 2);
});

//----------------------------//

const dlqEvents = new QueueEvents(QUEUE.DEAD_LETTER_QUEUE, {
  connection: connection,
});

dlqEvents.on("waiting", ({ jobId }) => {
  console.log(
    `Job with ID ${jobId} is currently waiting in the dead letter queue.`
  );
});

dlqEvents.on("active", ({ jobId, prev }) => {
  console.log(
    `Job with ID ${jobId} is now active in the dead letter queue. Previous status: ${prev}.`
  );
});

dlqEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(
    `Job with ID ${jobId} has completed successfully in the dead letter queue. Return value: ${returnvalue}.`
  );
});

dlqEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(
    `Job with ID ${jobId} has failed in the dead letter queue. Reason: ${failedReason}.`
  );
});
