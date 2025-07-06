import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get all published news articles, sorted by publishedAt (latest first)
export const getPublishedNews = query({
  args: {},
  handler: async (ctx) => {
    const news = await ctx.db
      .query("news")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .collect();

    return news.sort(
      (a, b) => (b.publishedAt || b.createdAt) - (a.publishedAt || a.createdAt)
    );
  },
});

// Get latest news for landing page (limit to 6)
export const getLatestNews = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 6;
    const news = await ctx.db
      .query("news")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .take(limit);

    return news.sort(
      (a, b) => (b.publishedAt || b.createdAt) - (a.publishedAt || a.createdAt)
    );
  },
});

// Get all news for admin dashboard
export const getAllNews = query({
  args: {
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const newsQuery = ctx.db.query("news");
    const { searchQuery } = args;

    if (searchQuery) {
      const searchData = await ctx.db
        .query("news")
        .withSearchIndex("search_title", (q) => q.search("title", searchQuery))
        .collect();

      return searchData.sort((a, b) => b.createdAt - a.createdAt);
    }

    const news = await newsQuery.order("desc").collect();

    return news.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get single news article by ID
export const getNewsById = query({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create new news article
export const createNews = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    externalLink: v.string(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("news", {
      title: args.title,
      description: args.description,
      externalLink: args.externalLink,
      isPublished: args.isPublished,
      publishedAt: args.isPublished ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update news article
export const updateNews = mutation({
  args: {
    id: v.id("news"),
    title: v.string(),
    description: v.string(),
    externalLink: v.string(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("News article not found");
    }

    const now = Date.now();
    const publishedAt =
      args.isPublished && !existing.isPublished ? now : existing.publishedAt;

    return await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      externalLink: args.externalLink,
      isPublished: args.isPublished,
      publishedAt,
      updatedAt: now,
    });
  },
});

// Delete news article
export const deleteNews = mutation({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Search news articles
export const searchNews = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!args.searchTerm) {
      return [];
    }

    return await ctx.db
      .query("news")
      .withSearchIndex("search_title", (q) =>
        q.search("title", args.searchTerm)
      )
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
  },
});

export const toggleNewsPublishStatus = mutation({
  args: {
    id: v.id("news"),
    publishStatus: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("News article not found");
    }
    const now = Date.now();
    const publishedAt =
      args.publishStatus && !existing.isPublished ? now : existing.publishedAt;
    return await ctx.db.patch(args.id, {
      isPublished: args.publishStatus,
      publishedAt,
      updatedAt: now,
    });
  },
});

export type News = {
  _id: Id<"news">;
  title: string;
  description: string;
  externalLink: string;
  isPublished: boolean;
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
};
