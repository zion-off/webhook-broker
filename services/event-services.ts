import { EventResponseType } from "@/utils/types";
import { publishToQueue } from "@/handlers/publisher";
import { getWebhookByEventNameService } from "@/services";
import { QUEUE } from "@/utils/enums";

export const processEventService = async (eventName: string): Promise<void> => {
  const event: EventResponseType = await getWebhookByEventNameService(
    eventName
  );
  event.webhookUrls.forEach(async (url) => {
    await publishToQueue(QUEUE.MAIN_QUEUE, {
      eventName: event.eventName,
      webhookUrl: url,
    });
  });
};
