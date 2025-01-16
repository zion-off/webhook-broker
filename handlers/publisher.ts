import { JobsOptions, Queue } from "bullmq";
import { deadLetterQueue, mainQueue } from "./broker-setup";
import { EventRequestType } from "@/utils/types";

import { v4 as uuidv4 } from "uuid";
import { QUEUE } from "@/utils/enums";

export const publishToQueue = async (queueName: QUEUE, data: EventRequestType) => {
  console.log(`Queue Name: `, queueName);
  const jobOptions: JobsOptions = {
    jobId: uuidv4(),
    attempts: 5,
    backoff: {
      delay: 10,
      type: "exponential",
    },
  };
  const queue = getQueueByName(queueName);
  await queue.add("process_webhook", data, jobOptions);
};

export const queueStats = async (queueName: QUEUE) => {
  const queue = getQueueByName(queueName);
  return await queue.getJobCounts(
    "failed",
    "delayed",
    "active",
    "wait",
    "waiting-children",
    "prioritized",
    "paused",
    "repeat"
  );
};

export const getQueueByName = (queue: QUEUE): Queue => {
  return queue === QUEUE.MAIN_QUEUE ? mainQueue : deadLetterQueue;
}