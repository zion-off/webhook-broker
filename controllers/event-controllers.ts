
import { queueStats } from "@/handlers/publisher";
import { processEventService } from "@/services/event-services";
import { QUEUE } from "@/utils/enums";
import { NextFunction, Request, Response } from "express";

export const postEventController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await processEventService(req.params.eventName)
    res.status(200).json();
  } catch (error) {
    next(error);
  }
};

export const getEventStatsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      mainQueue: await queueStats(QUEUE.MAIN_QUEUE),
      dql: await queueStats(QUEUE.DEAD_LETTER_QUEUE)
    });
    return
  } catch (error) {
    next(error);
  }
}
