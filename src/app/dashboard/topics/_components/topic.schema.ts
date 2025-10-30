import { z } from "zod";

export const AddTopicSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
  topicLogoId: z.string().min(1, { message: "Logo is required" }),
});

export const EditTopicSchema = AddTopicSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
});

export type AddTopicRequest = z.infer<typeof AddTopicSchema>;
export type EditTopicRequest = z.infer<typeof EditTopicSchema>;
