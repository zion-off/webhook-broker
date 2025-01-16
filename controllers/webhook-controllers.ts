import { Request, Response, NextFunction } from "express";

import { HttpError } from "@/utils/error";
import {
  registerWebhookService,
  getWebhookByEventNameService,
  getAllWebhooksService,
} from "@/services/webhook-services";
import { EventRequestType } from "@/utils/types";


export const postWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventName, webhookUrl }: EventRequestType = req.body;

    await registerWebhookService(eventName, webhookUrl);
    console.log(
      `Registered webhook for event ${eventName} and URL ${webhookUrl}`
    );

    res.status(200).json({ eventName: eventName, webhookUrl: webhookUrl });
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
    const eventName = req.params.eventName;
    const page_size = req.query.page_size
      ? parseInt(req.query.page_size as string, 10)
      : 10;
    const offset = req.query.offset
      ? parseInt(req.query.offset as string, 10)
      : 0;

    if (eventName) {
      const retrievedWebhooks = await getWebhookByEventNameService(eventName);
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
