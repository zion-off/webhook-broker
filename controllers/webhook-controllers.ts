import { Request, Response, NextFunction } from "express";

import { HttpError } from "@/utils/error";
import {
  registerWebhookService,
  getWebhookByEventNameService,
  getAllWebhooksService,
} from "@/services/webhook-services";

const validUrlFormat = new RegExp(
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
);

export const postWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { event_name, webhook_url } = req.body;

    if (!event_name || !webhook_url || !webhook_url.match(validUrlFormat)) {
      throw new HttpError("Invalid event name or URL", 400);
    }

    await registerWebhookService(event_name, webhook_url);
    console.log(
      `Registered webhook for event ${event_name} and URL ${webhook_url}`
    );

    res.status(200).json({ eventName: event_name, webhookUrl: webhook_url });
  } catch (error) {
    next(error);
  }
};

export const getWebhooksController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event_name = req.params.event_name;
    const page_size = req.query.page_size
      ? parseInt(req.query.page_size as string, 10)
      : 10;
    const offset = req.query.offset
      ? parseInt(req.query.offset as string, 10)
      : 0;

    if (event_name) {
      const retrievedWebhooks = await getWebhookByEventNameService(event_name);
      res.status(200).json(retrievedWebhooks);
      return;
    }

    if (!isNaN(page_size) && !isNaN(offset)) {
      const retrievedWebhooks = await getAllWebhooksService(page_size, offset);
      res.status(200).json(retrievedWebhooks);
      return;
    }

    res.status(400).json({ error: "Invalid parameters" });
  } catch (error) {
    next(error);
  }
};
