import { z } from "zod";

export const AddTickerTapeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z
    .union([z.literal(""), z.string().url("Must be a valid URL")])
    .optional(),
  isPublished: z.boolean(),
});

export type AddTickerTapeRequest = z.infer<typeof AddTickerTapeSchema>;

export const TickerTapeConfigSchema = z.object({
  speed: z.coerce.number().min(1, "Speed is required"),
  itemsToShow: z.coerce.number().min(1, "Number of items must be at least 1"),
});

export type TickerTapeConfigRequest = z.infer<typeof TickerTapeConfigSchema>;
