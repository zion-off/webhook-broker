import { z } from "zod";

export const eventRequestSchema = z.object({
    eventName: z.string().trim().min(3, "event name can not be empty"),
    webhookUrl: z.string().url("not a valid url"),
});

export const eventResponseSchema = z.object({
    eventName: z.string().trim().min(3, "event name can not be empty"),
    webhookUrls: z.array(z.string().url()).nonempty("No URLs Found!"),
});
