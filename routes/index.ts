import { Router } from "express";

import eventRouter from "./event-routes";
import webhookRouter from "./webhook-routes";

const router = Router();

router.use("/api/v0/trigger-event", eventRouter);
router.use("/api/v0/webhooks", webhookRouter);

export default router;
