import { z } from "zod";

export const AddSubCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  categoryId: z
    .string()
    .min(1, { message: "Category is required" }),
});

export type AddSubCategoryRequest = z.infer<typeof AddSubCategorySchema>;
