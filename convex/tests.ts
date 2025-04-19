import { mutation, query } from "./_generated/server";
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
};

// Queries
export const listWithDetails = query({
  handler: async (ctx) => {
    const tests = await ctx.db.query("tests").order("desc").collect();

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

// Get test with its questions
export const getTestWithQuestions = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.testId);
    if (!test) return null;

    const questions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("testId"), args.testId))
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
    totalQuestions: v.number(),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    return await ctx.db.insert("tests", {
      ...args,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tests"),
    name: v.string(),
    description: v.optional(v.string()),
    subCategoryId: v.id("subCategories"),
    totalQuestions: v.number(),
    duration: v.optional(v.number()),
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
  args: { id: v.id("tests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

