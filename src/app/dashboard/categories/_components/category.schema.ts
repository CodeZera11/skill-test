import { z } from "zod";

export const AddCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
  topicId: z.string().optional(),
});

export const EditCategorySchema = AddCategorySchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
});

export type AddCategoryRequest = z.infer<typeof AddCategorySchema>;
export type EditCategoryRequest = z.infer<typeof EditCategorySchema>;
