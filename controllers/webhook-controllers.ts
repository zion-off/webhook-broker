import { Request, Response, NextFunction } from "express";

export const postWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json();
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
      res.status(200).json();
      return;
    }

    if (!isNaN(page_size) && !isNaN(offset)) {
      res.status(200).json();
      return;
    }

    res.status(400).json({ error: "Invalid parameters" });
  } catch (error) {
    next(error);
  }
};