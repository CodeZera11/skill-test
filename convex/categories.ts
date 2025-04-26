import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Queries
export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const { searchQuery, sortOrder } = args;
    const query = ctx.db
      .query("categories")
      .order(sortOrder ? sortOrder : "asc");

    if (searchQuery) {
      const searchData = await ctx.db
        .query("categories")
        .withSearchIndex("search_name", (q) => {
          return q.search("name", searchQuery);
        })
        .collect();

      const filteredCategoriesWithSubcategories = await Promise.all(
        searchData.map(async (category) => {
          const subcategories = await ctx.db
            .query("subCategories")
            .filter((q) => q.eq(q.field("categoryId"), category._id))
            .collect();
          return {
            ...category,
            _subcategoriesCount: subcategories.length,
          };
        })
      );
      return filteredCategoriesWithSubcategories;
    }

    // if (sortOrder) {

    // }

    const items = await query.collect();

    const categoriesWithCounts = await Promise.all(
      items.map(async (category) => {
        const subcategories = await ctx.db
          .query("subCategories")
          .filter((q) => q.eq(q.field("categoryId"), category._id))
          .collect();

        return {
          ...category,
          _subcategoriesCount: subcategories.length,
        };
      })
    );

    return categoriesWithCounts;
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

export const listWithSubCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").take(3);

    const data = await Promise.all(
      categories.map(async (category) => {
        const subCategories = await ctx.db
          .query("subCategories")
          .filter((q) => q.eq(q.field("categoryId"), category._id))
          .collect();
        return {
          ...category,
          subCategories,
        };
      })
    );

    return data;
  },
});

export const listWithSubCategoriesAndTests = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();

    return await Promise.all(
      categories.map(async (category) => {
        const subCategories = await ctx.db
          .query("subCategories")
          .filter((q) => q.eq(q.field("categoryId"), category._id))
          .collect();

        const data = await Promise.all(
          subCategories.map(async (subcategory) => {
            const tests = await ctx.db
              .query("tests")
              .filter((q) => q.eq(q.field("subCategoryId"), subcategory._id))
              .collect();
            return {
              ...subcategory,
              tests,
            };
          })
        );

        return {
          ...category,
          subCategories: data,
        };
      })
    );
  },
});

export type Category = {
  _id: Id<"categories">;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
};

export type SubCategory = {
  _id: Id<"subCategories">;
  name: string;
  description?: string;
  categoryId: string;
  createdAt: number;
  updatedAt: number;
};

export type CategoryWithSubcategories = Category & {
  subcategories: SubCategory[];
};
