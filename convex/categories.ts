import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

// Queries
export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
    onlyPublished: v.boolean(),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { searchQuery, sortOrder } = args;
    const query = ctx.db
      .query("categories")
      .filter((q) =>
        args.onlyPublished
          ? q.eq(q.field("isPublished"), true)
          : q.eq(q.field("isPublished"), q.field("isPublished"))
      )
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
          const topic = await ctx.db.get(category.topicId);
          const subcategories = await ctx.db
            .query("subCategories")
            .filter((q) =>
              args.onlyPublished
                ? q.and(
                    q.eq(q.field("categoryId"), category._id),
                    q.eq(q.field("isPublished"), true)
                  )
                : q.and(
                    q.eq(q.field("categoryId"), category._id),
                    q.eq(q.field("isPublished"), q.field("isPublished"))
                  )
            )
            .take(args.take ?? 1000);
          return {
            ...category,
            topic,
            _subcategoriesCount: subcategories.length,
          };
        })
      );
      return filteredCategoriesWithSubcategories;
    }
    const items = await query.collect();

    const categoriesWithCounts = await Promise.all(
      items.map(async (category) => {
        const topic = await ctx.db.get(category.topicId);
        const subcategories = await ctx.db
          .query("subCategories")
          .filter((q) =>
            args.onlyPublished
              ? q.and(
                  q.eq(q.field("categoryId"), category._id),
                  q.eq(q.field("isPublished"), true)
                )
              : q.and(
                  q.eq(q.field("categoryId"), category._id),
                  q.eq(q.field("isPublished"), q.field("isPublished"))
                )
          )
          .take(args.take ?? 1000);

        return {
          ...category,
          topic,
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
    topicId: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    return await ctx.db.insert("categories", {
      name: args.name,
      description: args.description,
      topicId: args.topicId,
      createdAt: timestamp,
      updatedAt: timestamp,
      isPublished: false,
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
  args: {
    onlyPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("isPublished"), args?.onlyPublished))
      .take(3);

    const data = await Promise.all(
      categories.map(async (category) => {
        const subCategories = await ctx.db
          .query("subCategories")
          .filter((q) =>
            q.and(
              q.eq(q.field("categoryId"), category._id),
              q.eq(q.field("isPublished"), args?.onlyPublished)
            )
          )
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
  args: {
    onlyPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("isPublished"), args.onlyPublished))
      .collect();

    return await Promise.all(
      categories.map(async (category) => {
        const subCategories = await ctx.db
          .query("subCategories")
          .filter((q) =>
            q.and(
              q.eq(q.field("categoryId"), category._id),
              q.eq(q.field("isPublished"), true)
            )
          )
          .collect();

        const data = await Promise.all(
          subCategories.map(async (subcategory) => {
            const tests = await ctx.db
              .query("tests")
              .filter((q) =>
                q.and(
                  q.eq(q.field("subCategoryId"), subcategory._id),
                  q.eq(q.field("isPublished"), true)
                )
              )
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

export const togglePublishStatus = mutation({
  args: {
    id: v.id("categories"),
    publishStatus: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, publishStatus } = args;
    return await ctx.db.patch(id, {
      isPublished: publishStatus,
      updatedAt: Date.now(),
    });
  },
});
