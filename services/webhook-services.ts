import { redis } from "..";
import { HttpError } from "@/utils/error";

export async function registerWebhookService(
  event_name: string,
  url: string
) {
  try {
    await redis.sAdd(`webhooks:${event_name}`, url);
  } catch (error) {
    throw new HttpError("Failed to register webhook in Redis", 500);
  }
}

export async function getWebhookByEventNameService(
  event_name: string
) {
  try {
    const urls = await redis.sMembers(`webhooks:${event_name}`);
    return {
      eventName: event_name,
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
