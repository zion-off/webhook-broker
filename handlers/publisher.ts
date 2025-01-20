import { JobsOptions } from "bullmq";
import { EventRequestType } from "@/utils/types";

import { v4 as uuidv4 } from "uuid";
import { QUEUE } from "@/utils/enums";
import { getQueueByName } from "./utils";

export const publishToQueue = async (
  queueName: QUEUE,
  data: EventRequestType,
  jobId: string = uuidv4(),
  attempts: number = 5
): Promise<void> => {
  const jobOptions: JobsOptions = {
    jobId: jobId,
    attempts: attempts,
    backoff: {
      delay: 10,
      type: "exponential",
    },
  };
  const queue = getQueueByName(queueName);
  await queue.add("process_webhook", data, jobOptions);
};
