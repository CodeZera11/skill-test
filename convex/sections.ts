import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new section
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    testId: v.id("tests"),
    totalQuestions: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const sectionId = await ctx.db.insert("sections", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return sectionId;
  },
});

// Get all sections for a test
export const getByTestId = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sections")
      .filter((q) => q.eq(q.field("testId"), args.testId))
      .collect();
  },
});

// Get a single section by ID
export const getById = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sectionId);
  },
});

// Update a section
export const update = mutation({
  args: {
    sectionId: v.id("sections"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    totalQuestions: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { sectionId, ...updates } = args;
    const now = Date.now();
    await ctx.db.patch(sectionId, { ...updates, updatedAt: now });
    return sectionId;
  },
});

// Delete a section and its questions
export const remove = mutation({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    // First, delete all questions in this section
    const questions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("sectionId"), args.sectionId))
      .collect();
    
    for (const question of questions) {
      await ctx.db.delete(question._id);
    }
    
    // Then delete the section
    await ctx.db.delete(args.sectionId);
    return args.sectionId;
  },
});
