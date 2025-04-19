import { z } from "zod";

export const AddSubCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  categoryId: z
    .string()
    .min(1, { message: "Category is required" }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
});

export type AddSubCategoryRequest = z.infer<typeof AddSubCategorySchema>;
