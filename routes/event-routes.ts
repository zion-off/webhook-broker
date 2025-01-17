import express from "express";

import { postEventController } from "@/controllers";
import { authorizeUser } from "@/middlewares";

const eventRouter = express.Router();

eventRouter.use(authorizeUser);

eventRouter.post("/", postEventController);

export default eventRouter;
