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
    totalQuestions: number;
  }[];
};

export const listWithTests = query({
  args: {
    searchQuery: v.optional(v.string()),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const { searchQuery, sortOrder } = args;
    const subCategories = await ctx.db
      .query("subCategories")
      .order(sortOrder ? sortOrder : "asc");

    if (searchQuery) {
      const searchData = await ctx.db
        .query("subCategories")
        .withSearchIndex("search_name", (q) => {
          return q.search("name", searchQuery);
        })
        .collect();

      const filteredSubCategoriesWithTests = await Promise.all(
        searchData.map(async (subCategory) => {
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
              totalQuestions: test.totalQuestions || 0,
            })),
          };
        })
      );
      return filteredSubCategoriesWithTests;
    }

    const items = await subCategories.collect();

    const data = await Promise.all(
      items.map(async (subCategory) => {
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
            totalQuestions: test.totalQuestions || 0,
          })),
        };
      })
    );

    return data;
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
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    return await ctx.db.insert("subCategories", {
      name: args.name,
      description: args.description,
      categoryId: args.categoryId,
      imageStorageId: args.imageStorageId,
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
    imageStorageId: v.optional(v.id("_storage")),
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

export const getByIdWithCategoryAndTests = query({
  args: {
    id: v.id("subCategories"),
  },
  handler: async (ctx, args) => {
    const subCategory = await ctx.db.get(args.id);
    if (!subCategory) {
      throw new Error("Subcategory not found");
    }

    const category = await ctx.db.get(subCategory.categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    const tests = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("subCategoryId"), subCategory._id))
      .collect();

    return {
      ...subCategory,
      category,
      tests,
    };
  },
});
