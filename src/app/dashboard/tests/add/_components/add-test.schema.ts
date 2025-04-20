import { z } from "zod";

export const AddTestSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  subCategoryId: z.string().min(1, { message: "Sub Category is required" }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
  duration: z
    .number()
    .min(1, { message: "Duration must be at least 1 minute" })
    .max(180, { message: "Duration must be less than 180 minutes" })
    .optional(),
  totalQuestions: z.number().optional(),
  // .min(1, { message: "Total questions must be at least 1" })
  // .max(200, { message: "Total questions must be less than 200" }),
});

export type AddTestRequest = z.infer<typeof AddTestSchema>;
