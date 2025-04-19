import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

type TCategory = Doc<"categories">;
type TSubCategory = Doc<"subCategories">;

// Queries
export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    sortBy: v.optional(v.union(v.literal("name"), v.literal("createdAt"))),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const { searchQuery, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = args;

    let query = ctx.db.query("categories");

    // Apply search filter
    if (searchQuery) {
      query = query.filter((q) => 
        q.field("name").eq(searchQuery)
      );
    }

    // Get total count
    const totalCount = await query.collect().then(items => items.length);

    // Apply sorting and pagination
    const skip = (page - 1) * limit;
    query = query.order("createdAt", "desc").take(limit);

    const items = await query.collect();

    // Get subcategory counts
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

    return {
      items: categoriesWithCounts,
      totalCount,
      pageCount: Math.ceil(totalCount / limit),
      currentPage: page
    };
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
