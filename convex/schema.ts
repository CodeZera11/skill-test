import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkUserId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.optional(v.string()),
  }).index("byClerkUserId", ["clerkUserId"]),

  // --------------------
  // News
  // --------------------
  news: defineTable({
    title: v.string(),
    description: v.string(),
    externalLink: v.optional(v.string()),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_title", {
    searchField: "title",
    filterFields: ["isPublished", "publishedAt", "createdAt"],
  }),

  // --------------------
  // Topics
  // --------------------
  topics: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    isPublished: v.boolean(),
    topicLogoId: v.optional(v.id("_storage")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_name", {
    searchField: "name",
    filterFields: ["isPublished", "createdAt", "updatedAt"],
  }),

  // --------------------
  // Categories
  // --------------------
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    isPublished: v.boolean(),
    topicId: v.id("topics"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_name", {
    searchField: "name",
    filterFields: ["isPublished", "createdAt", "updatedAt"],
  }),

  // --------------------
  // Sub-categories
  // --------------------
  subCategories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    isPublished: v.boolean(),
    categoryId: v.id("categories"),
    imageStorageId: v.id("_storage"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_name", {
    searchField: "name",
    filterFields: ["isPublished", "createdAt", "updatedAt"],
  }),

  // --------------------
  // Tests
  // --------------------
  tests: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    subCategoryId: v.id("subCategories"),
    totalQuestions: v.optional(v.number()),
    isPublished: v.boolean(),
    totalMarks: v.optional(v.number()),
    durationInSeconds: v.optional(v.number()),
    attempts: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_name", {
    searchField: "name",
    filterFields: ["isPublished", "createdAt", "updatedAt"],
  }),

  // --------------------
  // Sections
  // --------------------
  sections: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    testId: v.id("tests"),
    durationInSeconds: v.optional(v.number()),
    totalQuestions: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_name", {
    searchField: "name",
    filterFields: ["createdAt", "updatedAt"],
  }),

  // --------------------
  // Questions
  // --------------------
  questions: defineTable({
    question: v.string(),
    questionAttachmentStorageId: v.optional(v.id("_storage")),
    questionAttachmentMeta: v.optional(
      v.object({
        width: v.number(),
        height: v.number(),
        size: v.number(),
        mimeType: v.string(),
      })
    ),
    options: v.array(v.string()),
    optionType: v.optional(v.union(v.literal("text"), v.literal("image"))),
    optionsMode: v.optional(
      v.union(v.literal("text"), v.literal("image"), v.literal("mixed"))
    ),
    optionItems: v.optional(
      v.array(
        v.object({
          type: v.union(v.literal("text"), v.literal("image")),
          text: v.optional(v.string()),
          imageStorageId: v.optional(v.id("_storage")),
          imageMeta: v.optional(
            v.object({
              width: v.number(),
              height: v.number(),
              size: v.number(),
              mimeType: v.string(),
            })
          ),
        })
      )
    ),
    correctAnswer: v.number(),
    sectionId: v.id("sections"),
    testId: v.id("tests"),
    explanation: v.optional(v.string()),
    marks: v.optional(v.number()),
    negativeMarks: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_section", ["sectionId"]),

  // --------------------
  // Test Attempts
  // --------------------
  testAttempts: defineTable({
    userId: v.id("users"),
    testId: v.id("tests"),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    score: v.optional(v.number()),
    correctAnswers: v.optional(v.number()),
    incorrectAnswers: v.optional(v.number()),
    timeTakenInSeconds: v.optional(v.number()),
    performancePercentile: v.optional(v.number()),
    answers: v.optional(
      v.array(
        v.object({
          questionId: v.id("questions"),
          selectedOption: v.optional(v.number()),
          isCorrect: v.boolean(),
        })
      )
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});
