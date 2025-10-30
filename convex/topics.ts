import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { Category } from "./categories";

export type Topic = {
  _id: Id<"topics">;
  name: string;
  isPublished: boolean;
  description?: string;
  createdAt: number;
  updatedAt: number;
  topicLogoId?: Id<"_storage">;
};

export type TopicWithCategory = Topic & {
  categories: Category[];
};

export type TopicWithCategoriesAndLogos = Topic & {
  topicUrl?: string;
};

export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
    onlyPublished: v.optional(v.boolean()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<TopicWithCategoriesAndLogos[]> => {
    const { searchQuery, sortOrder } = args;
    const query = ctx.db
      .query("topics")
      .filter((q) =>
        args.onlyPublished
          ? q.eq(q.field("isPublished"), true)
          : q.eq(q.field("isPublished"), q.field("isPublished"))
      )
      .order(sortOrder ? sortOrder : "asc");

    if (searchQuery) {
      const searchData = await ctx.db
        .query("topics")
        .withSearchIndex("search_name", (q) => {
          return q.search("name", searchQuery);
        })
        .filter((q) =>
          args.onlyPublished
            ? q.eq(q.field("isPublished"), true)
            : q.eq(q.field("isPublished"), q.field("isPublished"))
        )
        .collect();

      const searchDataWithLogo = await Promise.all(
        searchData.map(async (topic) => {
          if (!topic.topicLogoId) {
            return topic;
          }
          return {
            ...topic,
            topicUrl: (await ctx.storage.getUrl(topic.topicLogoId)) || "",
          };
        })
      );

      return await Promise.all(
        searchDataWithLogo.map(async (topic) => {
          const categories = await ctx.db
            .query("categories")
            .filter((q) =>
              q.and(
                q.eq(q.field("topicId"), topic._id),
                args.onlyPublished
                  ? q.eq(q.field("isPublished"), true)
                  : q.eq(q.field("isPublished"), q.field("isPublished"))
              )
            )
            .take(args.take ?? 1000);
          return {
            ...topic,
            categories,
          };
        })
      );
    }

    const items = await query.collect();

    const topicsWithCategories = await Promise.all(
      items.map(async (topic) => {
        const categories = await ctx.db
          .query("categories")
          .filter((q) =>
            q.and(
              q.eq(q.field("topicId"), topic._id),
              args.onlyPublished
                ? q.eq(q.field("isPublished"), true)
                : q.eq(q.field("isPublished"), q.field("isPublished"))
            )
          )
          .take(args.take ?? 1000);

        return {
          ...topic,
          categories,
        };
      })
    );

    const topicsWithLogos = await Promise.all(
      topicsWithCategories.map(async (topic) => {
        if (!topic.topicLogoId) {
          return topic;
        }
        const topicUrl = await ctx.storage.getUrl(topic.topicLogoId) || "";
        return {
          ...topic,
          topicUrl,
        };
      })
    );

    return topicsWithLogos;
  },
});

export const getById = query({
  args: { id: v.id("topics") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    topicLogoId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    return await ctx.db.insert("topics", {
      name: args.name,
      description: args.description,
      createdAt: timestamp,
      updatedAt: timestamp,
      isPublished: false,
      topicLogoId: args.topicLogoId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("topics"),
    name: v.string(),
    description: v.optional(v.string()),
    topicLogoId: v.id("_storage"),
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
  args: { id: v.id("topics") },
  handler: async (ctx, args) => {
    const { id } = args;
    const categories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("topicId"), id))
      .collect();

    for (const category of categories) {
      // first delete all subcategories under this category
      const subCategories = await ctx.db
        .query("subCategories")
        .filter((q) => q.eq(q.field("categoryId"), category._id))
        .collect();
      for (const subCategory of subCategories) {
        // delete all tests under this subcategory
        const tests = await ctx.db
          .query("tests")
          .filter((q) => q.eq(q.field("subCategoryId"), subCategory._id))
          .collect();
        for (const test of tests) {
          await ctx.db.delete(test._id);
        }
        await ctx.db.delete(subCategory._id);
      }

      await ctx.db.delete(category._id);
    }

    return await ctx.db.delete(id);
  },
});

export const togglePublishStatus = mutation({
  args: {
    id: v.id("topics"),
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

export const getTopicByIdWithCategories = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const topic = await ctx.db.get(args.topicId);
    if (!topic) return null;

    // lets get the categoies and subCategoryCount for each category
    const categories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("topicId"), args.topicId))
      .collect();
    const categoriesWithSubCategories = await Promise.all(
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
    return {
      ...topic,
      categories: categoriesWithSubCategories,
    };
  },
});
