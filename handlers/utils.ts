import { QUEUE } from "@/utils/enums";
import { deadLetterQueue, mainQueue } from "./brokerSetup";
import { Queue } from "bullmq";

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
};
