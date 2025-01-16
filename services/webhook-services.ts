import { redis } from "..";
import { HttpError } from "@/utils/error";

export async function registerWebhookService(eventName: string, url: string) {
  try {
    await redis.sAdd(eventName, url);
  } catch (error) {
    throw new HttpError("Failed to register webhook in Redis", 500);
  }
}

export async function getWebhookByEventNameService(eventName: string) {
  try {
    const urls = await redis.sMembers(eventName);
    return {
      eventName: eventName,
      webhookUrls: urls,
    };
  } catch (error) {
    throw new HttpError("Failed to get URLs from Redis", 500);
  }
}

export async function getAllWebhooksService(
  page_size: number,
  offset: number
) {
  try {
    let webhooks = [];
    let cursor = offset;

    do {
      const res = await redis.scan(cursor, {
        COUNT: page_size,
        MATCH: `webhooks:*`,
      });

      cursor = res.cursor;

      for (const key of res.keys) {
        const name = key.split(':').pop();
        const urls = await redis.sMembers(key);
        webhooks.push({
          eventName: name,
          webhookUrls: urls,
        });
      }

      if (webhooks.length >= page_size) {
        webhooks.length = page_size;
        break;
      }

    } while (cursor !== 0);

    return webhooks;
  } catch (error) {
    throw new HttpError("Failed to get URLs from Redis", 500);
  }
}
