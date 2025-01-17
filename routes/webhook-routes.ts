import express, { Router } from "express";
import { postWebhookController, getWebhooksController } from "@/controllers";
import { authorizeUser } from "@/middlewares";

const webhookRouter: Router = express.Router();

webhookRouter.use(authorizeUser);

webhookRouter.post("/", postWebhookController);
webhookRouter.get("/", getWebhooksController);
webhookRouter.get("/:event_name", getWebhooksController);

export default webhookRouter;
