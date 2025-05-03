import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Queries
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("questions").collect();
  },
});

export const getBySectionId = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("sectionId"), args.sectionId))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutations
export const create = mutation({
  args: {
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(),
    sectionId: v.id("sections"),
    explanation: v.optional(v.string()),
    marks: v.optional(v.number()),
    negativeMarks: v.optional(v.number()),
    testId: v.id("tests"),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    return await ctx.db.insert("questions", {
      ...args,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("questions"),
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(),
    sectionId: v.id("sections"),
    explanation: v.optional(v.string()),
    marks: v.optional(v.number()),
    negativeMarks: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    return await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Bulk create questions for a test
export const bulkCreate = mutation({
  args: {
    questions: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.number(),
        explanation: v.optional(v.string()),
        marks: v.optional(v.number()),
        negativeMarks: v.optional(v.number()),
      })
    ),
    testId: v.id("tests"),
    sectionId: v.id("sections"),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    const questions = [];

    for (const q of args.questions) {
      const questionId = await ctx.db.insert("questions", {
        ...q,
        testId: args.testId,
        sectionId: args.sectionId,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      questions.push(questionId);
    }

    return questions;
  },
});

export const getQuestionsByTestId = query({
  args: {
    testId: v.id("tests"),
  },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.testId);
    if (!test) {
      throw new Error("Test not found");
    }

    const sections = await ctx.db
      .query("sections")
      .filter((s) => s.eq(s.field("testId"), args.testId))
      .collect();

    const data = await Promise.all(
      sections.map(async (section) => {
        return await ctx.db
          .query("questions")
          .filter((q) => q.eq(q.field("sectionId"), section._id))
          .collect();
      })
    );

    if (!data) {
      throw new Error("No questions found for this test");
    }

    const result = data.flatMap((questions) => questions);

    return result;
  },
});
