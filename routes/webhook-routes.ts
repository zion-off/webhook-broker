import express, { Router } from "express";
import { postWebhookController, getWebhooksController } from "@/controllers";
import { validateEventBody } from "@/middlewires/validateBody";
import { eventRequestSchema } from "@/schemas/eventSchema";

const webhookRouter: Router = express.Router();

webhookRouter.post("/", validateEventBody(eventRequestSchema), postWebhookController);
webhookRouter.get("/", getWebhooksController);
webhookRouter.get("/:eventName", getWebhooksController);

export default webhookRouter;
