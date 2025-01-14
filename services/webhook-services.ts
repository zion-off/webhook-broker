import { redis } from "..";
import { HttpError } from "@/utils/error";

export async function registerWebhookService(event_name: string, url: string) {
  try {
    await redis.sAdd(event_name, url);
  } catch (error) {
    throw new HttpError("Failed to register webhook in Redis", 500);
  }
}

export async function getWebhookByEventNameService(event_name: string) {
  try {
    const urls = await redis.sMembers(event_name);
    return {
      eventName: event_name,
      webhookUrls: urls,
    };
  } catch (error) {
    throw new HttpError("Failed to get URLs from Redis", 500);
  }
}

export async function getAllWebhooksService(page_size: number, offset: number) {
  try {
    let webhooks = {};
    let cursor = offset;

    do {
      const res = await redis.scan(cursor, {
        COUNT: page_size,
        MATCH: "",
      });

      cursor = res.cursor;
      for (const key of res.keys) {
        webhooks[key] = await redis.sMembers(key);
      }
    } while (cursor !== 0 && Object.keys(webhooks).length < page_size);

    return webhooks;
  } catch (error) {
    throw new HttpError("Failed to get URLs from Redis", 500);
  }
}
