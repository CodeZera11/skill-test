import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Types
export type TestWithDetails = {
  _id: Id<"tests">;
  name: string;
  description?: string;
  subCategoryId: Id<"subCategories">;
  totalQuestions: number;
  duration?: number;
  createdAt: number;
  updatedAt: number;
  subCategory: {
    _id: Id<"subCategories">;
    name: string;
  };
  sections: {
    _id: Id<"sections">;
    name: string;
    description?: string;
    duration?: number;
    totalQuestions?: number;
    testId: Id<"tests">;
    createdAt: number;
    updatedAt: number;
  }[];
  questions: {
    _id: Id<"questions">;
    question: string;
    options: string[];
    correctAnswer: number;
    sectionId: Id<"sections">;
    explanation?: string;
    marks?: number;
    sectionKey: string | undefined;
    negativeMarks?: number;
    createdAt: number;
    updatedAt: number;
  }[];
};

export interface Test {
  _id: Id<"tests">;
  name: string;
  description?: string;
  subCategoryId: Id<"subCategories">;
  totalQuestions: number | undefined;
  duration?: number;
  createdAt: number;
  updatedAt: number;
}

// Queries
export const listWithDetails = query({
  args: {
    searchQuery: v.optional(v.string()),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const { searchQuery, sortOrder } = args;

    if (searchQuery) {
      const searchData = await ctx.db
        .query("tests")
        .withSearchIndex("search_name", (q) => {
          return q.search("name", searchQuery.toLowerCase());
        })
        .collect();

      return await Promise.all(
        searchData?.map(async (test) => {
          const subCategory = await ctx.db.get(test.subCategoryId);

          return {
            ...test,
            subCategory: {
              _id: subCategory!._id,
              name: subCategory!.name,
            },
          };
        })
      );
    }

    const tests = await ctx.db
      .query("tests")
      .order(sortOrder ?? "desc")
      .collect();

    return await Promise.all(
      tests.map(async (test) => {
        const subCategory = await ctx.db.get(test.subCategoryId);

        return {
          ...test,
          subCategory: {
            _id: subCategory!._id,
            name: subCategory!.name,
          },
        };
      })
    );
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tests").collect();
  },
});

export const getBySubCategoryId = query({
  args: { subCategoryId: v.id("subCategories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("subCategoryId"), args.subCategoryId))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("tests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByIdWithSections = query({
  args: { id: v.id("tests") },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.id);
    if (test === null) {
      throw new Error("Test not found");
    }

    const sections = await ctx.db
      .query("sections")
      .filter((q) => q.eq(q.field("testId"), args.id))
      .collect();

    return {
      ...test,
      sections: sections.map((section) => ({
        ...section,
      })),
    };
  },
});

export const getTestWithDetails = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.testId);
    if (!test) throw new Error("Test not found");

    const sections = await ctx.db
      .query("sections")
      .filter((q) => q.eq(q.field("testId"), args.testId))
      .collect();

    const questions: Doc<"questions">[] = [];
    for (const section of sections) {
      const sectionQuestions = await ctx.db
        .query("questions")
        .withIndex("by_section")
        .filter((q) => q.eq(q.field("sectionId"), section._id))
        .collect();
      questions.push(...sectionQuestions);
    }

    return {
      ...test,
      totalQuestions: test.totalQuestions || 0,
      subCategory: {
        _id: test.subCategoryId,
        name: (await ctx.db.get(test.subCategoryId))?.name || "",
      },
      questions: questions.map((question) => {
        const section = sections.find(
          (s) => s._id.toString() === question.sectionId.toString()
        );
        return {
          ...question,
          sectionKey: section?.name.toLowerCase().replace(" ", "_"),
        };
      }),
      sections: sections.map((section) => ({
        ...section,
        questions: questions.filter((q) => q.sectionId === section._id),
      })),
    };
  },
});

// Get test with its questions
export const getTestWithQuestions = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.sectionId);
    if (!test) return null;

    const questions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("sectionId"), args.sectionId))
      .collect();

    return { ...test, questions };
  },
});

// Mutations
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    subCategoryId: v.id("subCategories"),
    totalQuestions: v.optional(v.number()),
    duration: v.optional(v.number()),
    questions: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.number(),
        sectionKey: v.string(),
        explanation: v.optional(v.string()),
        marks: v.optional(v.string()),
        negativeMarks: v.optional(v.string()),
      })
    ),
    sections: v.array(
      v.object({
        name: v.string(),
        description: v.optional(v.string()),
        duration: v.optional(v.number()),
        totalQuestions: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    const test = await ctx.db.insert("tests", {
      name: args.name,
      description: args.description || undefined,
      subCategoryId: args.subCategoryId,
      totalQuestions: args.questions.length,
      duration: args.sections.reduce(
        (acc, section) => acc + (section.duration || 0),
        0
      ),
      totalMarks: args.questions.reduce(
        (acc, question) => acc + Number(question.marks || 0),
        0
      ),
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await Promise.all(
      args.sections.map(async (section) => {
        const sectionQuestions = section.totalQuestions || 0;
        const sectionId = await ctx.db.insert("sections", {
          name: section.name,
          description: section.description || undefined,
          duration: section.duration,
          totalQuestions: sectionQuestions,
          testId: test,
          createdAt: timestamp,
          updatedAt: timestamp,
        });

        const questionsBySection = args.questions.filter(
          (question) =>
            question.sectionKey === section.name.toLowerCase().replace(" ", "_")
        );

        await Promise.all(
          questionsBySection.map(async (question) => {
            return await ctx.db.insert("questions", {
              question: question.question,
              options: question.options,
              correctAnswer: question.correctAnswer,
              sectionId,
              explanation: question.explanation || undefined,
              marks: Number(question.marks),
              negativeMarks: Number(question.negativeMarks),
              createdAt: timestamp,
              updatedAt: timestamp,
            });
          })
        );
      })
    );
  },
});

export const update = mutation({
  args: {
    id: v.id("tests"),
    name: v.string(),
    description: v.optional(v.string()),
    subCategoryId: v.id("subCategories"),
    totalQuestions: v.optional(v.number()),
    duration: v.number(),
    questions: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.number(),
        sectionKey: v.string(),
        explanation: v.optional(v.string()),
        marks: v.optional(v.string()),
        negativeMarks: v.optional(v.string()),
      })
    ),
    sections: v.array(
      v.object({
        name: v.string(),
        description: v.optional(v.string()),
        duration: v.optional(v.number()),
        totalQuestions: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const {
      id,
      name,
      questions,
      sections,
      subCategoryId,
      description,
      duration,
      totalQuestions,
    } = args;

    await ctx.db.patch(id, {
      name,
      description: description || undefined,
      subCategoryId,
      totalQuestions,
      totalMarks: questions.reduce(
        (acc, question) => acc + Number(question.marks || 0),
        0
      ),
      duration: duration || undefined,
      updatedAt: Date.now(),
    });

    // Delete all sections and questions related to this test
    const sectionsToDelete = await ctx.db
      .query("sections")
      .filter((q) => q.eq(q.field("testId"), id))
      .collect();

    await Promise.all(
      sectionsToDelete.map(async (section) => {
        const questionsToDelete = await ctx.db
          .query("questions")
          .filter((q) => q.eq(q.field("sectionId"), section._id))
          .collect();
        await Promise.all(
          questionsToDelete.map(async (question) => {
            await ctx.db.delete(question._id);
          })
        );

        await ctx.db.delete(section._id);
      })
    );

    // Create new sections
    await Promise.all(
      sections.map(async (section) => {
        const sectionQuestions = section.totalQuestions || 0;
        const sectionId = await ctx.db.insert("sections", {
          name: section.name,
          description: section.description || undefined,
          duration: section.duration,
          totalQuestions: sectionQuestions,
          testId: id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        const questionsBySection = questions.filter(
          (question) =>
            question.sectionKey === section.name.toLowerCase().replace(" ", "_")
        );

        await Promise.all(
          questionsBySection.map(async (question) => {
            return await ctx.db.insert("questions", {
              question: question.question,
              options: question.options,
              correctAnswer: question.correctAnswer,
              sectionId,
              explanation: question.explanation || undefined,
              marks: Number(question.marks),
              negativeMarks: Number(question.negativeMarks),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          })
        );
      })
    );
  },
});

export const remove = mutation({
  args: { id: v.id("tests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
