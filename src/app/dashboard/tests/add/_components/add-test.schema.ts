import { z } from "zod";

export const AddTestSchema = z.object({
  // Step-1: Basic Information
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  subCategoryId: z.string().min(1, { message: "Sub Category is required" }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),

  // Step-2: Section Configuration
  sections: z.array(
    z.object({
      name: z.string().min(1, { message: "Section name is required" }),
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
    })
  ),

  // Step-3: Questions Input
  questions: z.array(
    z.object({
      question: z.string().min(1, { message: "Question text is required" }),
      options: z
        .array(z.union([z.string(), z.number()]))
        .min(2, { message: "At least two options are required" })
        .max(5, { message: "A maximum of five options is allowed" }),
      // Index of the correct option
      correctAnswer: z.number(),
      sectionKey: z.string().min(1, { message: "Section is required" }),
      explanation: z
        .string()
        .max(500, { message: "Explanation must be less than 500 characters" })
        .optional(),
      marks: z
        .string()
        .refine((value) => !isNaN(Number(value)), {
          message: "Marks must be a number",
        })
        .optional(),
      negativeMarks: z
        .string()
        .refine((value) => !isNaN(Number(value)), {
          message: "Negative marks must be a number",
        })
        .optional(),
    })
  ),

  totalQuestions: z.number().optional(),
  // .min(1, { message: "Total questions must be at least 1" })
  // .max(200, { message: "Total questions must be less than 200" }),
});

export type AddTestRequest = z.infer<typeof AddTestSchema>;
