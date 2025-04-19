import { z } from "zod";

export const AddTestSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  subCategoryId: z
    .string()
    .min(1, { message: "Sub Category is required" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description must be less than 500 characters" }),
  duration: z
    .number()
    .min(1, { message: "Duration must be at least 1 minute" })
    .max(180, { message: "Duration must be less than 180 minutes" }),
  passingPercentage: z
    .number()
    .min(1, { message: "Passing percentage must be at least 1%" })
    .max(100, { message: "Passing percentage must be less than 100%" }),
});

export type AddTestRequest = z.infer<typeof AddTestSchema>;
