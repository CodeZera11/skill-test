import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Queries
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("questions").collect();
  },
});

export const getByTestId = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("testId"), args.testId))
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
    testId: v.id("tests"),
    explanation: v.optional(v.string()),
    marks: v.optional(v.number()),
    negativeMarks: v.optional(v.number()),
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
    testId: v.id("tests"),
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
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    const questions = [];
    
    for (const q of args.questions) {
      const questionId = await ctx.db.insert("questions", {
        ...q,
        testId: args.testId,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      questions.push(questionId);
    }
    
    return questions;
  },
});
