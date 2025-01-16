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

export async function getAllWebhooksService(page_size: number, offset: number) {
  try {
    let webhooks = [];
    let cursor = offset;

    do {
      const res = await redis.scan(cursor, {
        COUNT: page_size,
        MATCH: "",
      });

      cursor = res.cursor;
      for (const key of res.keys) {
        webhooks.push({
          eventName: key,
          webhookUrls: await redis.sMembers(key),
        });
      }
    } while (cursor !== 0 && Object.keys(webhooks).length < page_size);

    return webhooks;
  } catch (error) {
    throw new HttpError("Failed to get URLs from Redis", 500);
  }
}
