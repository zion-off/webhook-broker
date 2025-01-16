import { EventResponseType } from "@/utils/types";
import { publishToQueue } from "@/handlers/publisher";
import { getWebhookByEventNameService } from "@/services";
import { QUEUE } from "@/utils/enums";

export const processEventService = async (eventName: string) => {
    const event: EventResponseType = await getWebhookByEventNameService(eventName);
    return await publishToQueue(QUEUE.MAIN_QUEUE, event);
}