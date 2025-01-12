import express from "express";

import { postEventController } from "@/controllers";

const eventRouter = express.Router();

eventRouter.post("/", postEventController);

export default eventRouter;
