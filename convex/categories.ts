import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Queries
export const list = query({
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories")
      .order("desc")
      .collect();
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await ctx.db
          .query("subCategories")
          .filter((q) => q.eq(q.field("categoryId"), category._id))
          .collect();
        return {
          ...category,
          subcategories,
        };
      })
    );
    return categoriesWithSubcategories;
  },
});

export const getById = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutations
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    return await ctx.db.insert("categories", {
      name: args.name,
      description: args.description,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    description: v.optional(v.string()),
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
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export type Category = {
  _id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
};

export type SubCategory = {
  _id: string;
  name: string;
  description?: string;
  categoryId: string;
  createdAt: number;
  updatedAt: number;
};

export type CategoryWithSubcategories = Category & {
  subcategories: SubCategory[];
};
