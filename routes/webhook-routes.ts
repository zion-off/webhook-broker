import express, { Router } from "express";
import {
    postWebhookController,
    getWebhooksController,
} from "@/controllers";

const webhookRouter: Router = express.Router();

webhookRouter.post("/", postWebhookController);
webhookRouter.get("/", getWebhooksController); 
webhookRouter.get("/:event_name", getWebhooksController);

export default webhookRouter;