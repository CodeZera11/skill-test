import { z } from "zod";

export const AddSubCategorySchema = z.object({
  imageStorageId: z.string().min(1, { message: "Logo is required" }),
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

export const EditSubCategorySchema = AddSubCategorySchema.extend({
  _id: z.string().min(1, { message: "Sub Category ID is required" }),
});

export type AddSubCategoryRequest = z.infer<typeof AddSubCategorySchema>;
export type EditSubCategoryRequest = z.infer<typeof EditSubCategorySchema>;