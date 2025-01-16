import { eventRequestSchema, eventResponseSchema } from "@/schemas/eventSchema";
import { z } from "zod";


export type EventResponseType = z.infer<typeof eventResponseSchema>;
export type EventRequestType = z.infer<typeof eventRequestSchema>;