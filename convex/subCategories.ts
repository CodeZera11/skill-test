import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Types
export type SubCategoryWithTests = {
  _id: Id<"subCategories">;
  name: string;
  description?: string;
  categoryId: Id<"categories">;
  createdAt: number;
  updatedAt: number;
  category: {
    _id: Id<"categories">;
    name: string;
  };
  tests: {
    _id: Id<"tests">;
    name: string;
  }[];
};

// Queries
export const listWithTests = query({
  handler: async (ctx) => {
    const subCategories = await ctx.db.query("subCategories").order("desc").collect();

    return await Promise.all(
      subCategories.map(async (subCategory) => {
        const category = await ctx.db.get(subCategory.categoryId);
        const tests = await ctx.db
          .query("tests")
          .filter((q) => q.eq(q.field("subCategoryId"), subCategory._id))
          .collect();

        return {
          ...subCategory,
          category: {
            _id: category!._id,
            name: category!.name,
          },
          tests: tests.map((test) => ({
            _id: test._id,
            name: test.name,
          })),
        };
      })
    );
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("subCategories").collect();
  },
});

export const getByCategoryId = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subCategories")
      .filter((q) => q.eq(q.field("categoryId"), args.categoryId))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("subCategories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutations
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    return await ctx.db.insert("subCategories", {
      name: args.name,
      description: args.description,
      categoryId: args.categoryId,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("subCategories"),
    name: v.string(),
    description: v.optional(v.string()),
    categoryId: v.id("categories"),
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
  args: { id: v.id("subCategories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
