import { z } from "zod";

export const AddNewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be less than 200 characters"),
  externalLink: z.string().url("Must be a valid URL").optional(),
  isPublished: z.boolean(),
});

export type AddNewsRequest = z.infer<typeof AddNewsSchema>;
