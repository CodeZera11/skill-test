import { z } from "zod";

const QuestionOptionItemSchema = z.object({
  type: z.enum(["text", "image"]),
  text: z.string().optional(),
  imageStorageId: z.string().optional(),
  imageMeta: z
    .object({
      width: z.number(),
      height: z.number(),
      size: z.number(),
      mimeType: z.string(),
    })
    .optional(),
  imageUrl: z.string().optional(),
});

const QuestionSchema = z
  .object({
    question: z.string().min(1, { message: "Question text is required" }),
    questionAttachmentStorageId: z.string().optional(),
    questionAttachmentMeta: z
      .object({
        width: z.number(),
        height: z.number(),
        size: z.number(),
        mimeType: z.string(),
      })
      .optional(),
    questionAttachmentUrl: z.string().optional(),
    options: z
      .array(z.union([z.string(), z.number()]))
      .length(5, { message: "Exactly 5 options are required" }),
    optionType: z.enum(["text", "image"]).optional(),
    optionItems: z
      .array(QuestionOptionItemSchema)
      .length(5, { message: "Exactly 5 option items are required" }),
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
  .superRefine((question, ctx) => {
    const type = question.optionType || "text";

    if (question.correctAnswer < 0 || question.correctAnswer > 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctAnswer"],
        message: "Correct answer must be between option 1 and option 5",
      });
    }

    if (type === "text") {
      question.options.forEach((option, index) => {
        if (!String(option ?? "").trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["options", index],
            message: `Option ${index + 1} text is required`,
          });
        }
      });
      return;
    }

    question.optionItems.forEach((item, index) => {
      if (!item.imageStorageId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["optionItems", index, "imageStorageId"],
          message: `Option ${index + 1} image is required`,
        });
      }
    });
  });

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
  questions: z.array(QuestionSchema),

  totalQuestions: z.number().optional(),
  // .min(1, { message: "Total questions must be at least 1" })
  // .max(200, { message: "Total questions must be less than 200" }),
});

export type AddTestRequest = z.infer<typeof AddTestSchema>;
