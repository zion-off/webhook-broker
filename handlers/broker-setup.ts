import { QUEUE } from "@/utils/enums";
import { Queue } from "bullmq";

export const connection = {
    host: "127.0.0.1",
    port: 6380
};

export const mainQueue: Queue = new Queue(QUEUE.MAIN_QUEUE, {
    connection: connection
})
export const deadLetterQueue: Queue = new Queue(QUEUE.DEAD_LETTER_QUEUE, {
    connection: connection
})