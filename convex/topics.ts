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
};

export type TopicWithCategory = Topic & {
  categories: Category[];
};

export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
    onlyPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
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
        .filter((q) =>
          args.onlyPublished
            ? q.eq(q.field("isPublished"), true)
            : q.eq(q.field("isPublished"), q.field("isPublished"))
        )
        .withSearchIndex("search_name", (q) => {
          return q.search("name", searchQuery);
        })
        .collect();

      return await Promise.all(
        searchData.map(async (topic) => {
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
            .collect();
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
          .collect();

        return {
          ...topic,
          categories,
        };
      })
    );

    return topicsWithCategories;
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
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    return await ctx.db.insert("topics", {
      name: args.name,
      description: args.description,
      createdAt: timestamp,
      updatedAt: timestamp,
      isPublished: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("topics"),
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
  args: { id: v.id("topics") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
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
