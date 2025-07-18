import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Types
export type SubCategoryWithTests = {
  _id: Id<"subCategories">;
  name: string;
  isPublished: boolean;
  description?: string;
  categoryId: Id<"categories">;
  createdAt: number;
  updatedAt: number;
  category: {
    _id: Id<"categories">;
    name: string;
  };
  imageStorageId?: Id<"_storage">;
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
    onlyPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { searchQuery, sortOrder } = args;
    const subCategories = await ctx.db
      .query("subCategories")
      .filter((q) =>
        args.onlyPublished
          ? q.eq(q.field("isPublished"), true)
          : q.eq(q.field("isPublished"), q.field("isPublished"))
      )
      .order(sortOrder ? sortOrder : "asc");

    if (searchQuery) {
      const searchData = await ctx.db
        .query("subCategories")
        .filter((q) =>
          args.onlyPublished
            ? q.eq(q.field("isPublished"), true)
            : q.eq(q.field("isPublished"), q.field("isPublished"))
        )
        .withSearchIndex("search_name", (q) => {
          return q.search("name", searchQuery);
        })
        .collect();

      const filteredSubCategoriesWithTests = await Promise.all(
        searchData.map(async (subCategory) => {
          const category = await ctx.db.get(subCategory.categoryId);
          const tests = await ctx.db
            .query("tests")
            .filter((q) =>
              args.onlyPublished
                ? q.and(
                    q.eq(q.field("subCategoryId"), subCategory._id),
                    q.eq(q.field("isPublished"), true)
                  )
                : q.and(
                    q.eq(q.field("subCategoryId"), subCategory._id),
                    q.eq(q.field("isPublished"), q.field("isPublished"))
                  )
            )
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
          .filter((q) =>
            args.onlyPublished
              ? q.and(
                  q.eq(q.field("subCategoryId"), subCategory._id),
                  q.eq(q.field("isPublished"), true)
                )
              : q.and(
                  q.eq(q.field("subCategoryId"), subCategory._id),
                  q.eq(q.field("isPublished"), q.field("isPublished"))
                )
          )
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
      isPublished: false,
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
    const timestamp = Date.now();
    const updateData: Partial<{
      name: string;
      description?: string;
      categoryId: Id<"categories">;
      imageStorageId?: Id<"_storage">;
      updatedAt: number;
    }> = {
      ...data,
      updatedAt: timestamp,
    };
    if (data.categoryId) {
      updateData.categoryId = data.categoryId;
    }
    if (data.imageStorageId) {
      updateData.imageStorageId = data.imageStorageId;
    }
    return await ctx.db.patch(id, updateData);
  },
});

export const remove = mutation({
  args: { id: v.id("subCategories") },
  handler: async (ctx, args) => {
    const { id } = args;

    const tests = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("subCategoryId"), id))
      .collect();
    for (const test of tests) {
      // Delete all questions under this test
      const questions = await ctx.db
        .query("questions")
        .filter((q) => q.eq(q.field("testId"), test._id))
        .collect();
      for (const question of questions) {
        // Delete the question
        await ctx.db.delete(question._id);
      }
      // Delete the test
      await ctx.db.delete(test._id);
    }
    // Finally, delete the subcategory
    return await ctx.db.delete(id);
  },
});

export const getByCategory = query({
  args: {
    categoryId: v.id("categories"),
    populateTests: v.optional(v.boolean()),
    onlyPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const subCategories = await ctx.db
      .query("subCategories")
      .filter((q) =>
        q.and(
          q.eq(q.field("categoryId"), args.categoryId),
          q.eq(q.field("isPublished"), args?.onlyPublished)
        )
      )
      .collect();

    return await Promise.all(
      subCategories.map(async (subCategory) => {
        const tests = await ctx.db
          .query("tests")
          .filter((q) =>
            q.and(
              q.eq(q.field("subCategoryId"), subCategory._id),
              q.eq(q.field("isPublished"), args?.onlyPublished)
            )
          )
          .collect();

        return {
          ...subCategory,
          tests: tests,
        };
      })
    );
  },
});

export const getByIdWithCategoryAndTests = query({
  args: {
    id: v.id("subCategories"),
    onlyPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const subCategory = await ctx.db.get(args.id);
    if (!subCategory) {
      throw new Error("Subcategory not found");
    }

    const category = await ctx.db.get(subCategory.categoryId);
    if (!category || category.isPublished !== args.onlyPublished) {
      throw new Error("Category not found");
    }

    const tests = await ctx.db
      .query("tests")
      .filter((q) =>
        q.and(
          q.eq(q.field("subCategoryId"), subCategory._id),
          q.eq(q.field("isPublished"), args.onlyPublished)
        )
      )
      .collect();

    return {
      ...subCategory,
      category,
      tests,
    };
  },
});

export const togglePublishStatus = mutation({
  args: {
    id: v.id("subCategories"),
    publishStatus: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      isPublished: args.publishStatus,
      updatedAt: Date.now(),
    });
  },
});
