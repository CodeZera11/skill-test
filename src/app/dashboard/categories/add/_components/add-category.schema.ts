import { z } from "zod";

export const AddCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
});

export type AddCategoryRequest = z.infer<typeof AddCategorySchema>;
