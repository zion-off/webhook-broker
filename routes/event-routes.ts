import express from "express";

import { postEventController , getEventStatsController } from "@/controllers";

const eventRouter = express.Router();

eventRouter.get("/", getEventStatsController);
eventRouter.post("/:eventName", postEventController);

export default eventRouter;
