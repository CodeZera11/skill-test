import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkUserId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.optional(v.string()), // e.g., "admin", "user", "moderator"
  }).index("byClerkUserId", ["clerkUserId"]),

  // News articles
  news: defineTable({
    title: v.string(),
    description: v.string(), // less than 200 words
    externalLink: v.string(),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_title", {
    searchField: "title",
    filterFields: ["isPublished", "publishedAt", "createdAt"],
  }),

  // Top level topic eg: "Bank Exams", "Govt Exams"
  topics: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    isPublished: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_name", {
    searchField: "name",
    filterFields: ["createdAt", "updatedAt"],
  }),

  // Main categories (e.g., "Clerk Exam")
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    isPublished: v.boolean(),
    topicId: v.id("topics"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_name", {
    searchField: "name",
    filterFields: ["createdAt", "updatedAt"],
  }),

  // Sub-categories (e.g., "Memory Based Papers", "Practice Papers")
  subCategories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    isPublished: v.boolean(),
    categoryId: v.id("categories"),
    imageStorageId: v.id("_storage"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["createdAt", "updatedAt"],
    })
    .index("by_categoryId", ["categoryId"]),

  // Tests (e.g., "Test 1", "Test 2" under Memory Based Papers)
  tests: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    subCategoryId: v.id("subCategories"),
    totalQuestions: v.optional(v.number()),
    isPublished: v.boolean(),
    totalMarks: v.optional(v.number()),
    durationInSeconds: v.optional(v.number()),
    attempts: v.optional(v.number()), // total number of attempts of the test
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .searchIndex("search_name", {
      searchField: "name",
    })
    .index("by_subCategoryId", ["subCategoryId"]),
  // Sections within each test (e.g., "General Knowledge", "Mathematics")
  sections: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    testId: v.id("tests"),
    durationInSeconds: v.optional(v.number()),
    totalQuestions: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .searchIndex("search_name", {
      searchField: "name",
    })
    .index("by_testId", ["testId"]),

  // Questions within each section
  questions: defineTable({
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(), // Index of the correct option
    sectionId: v.id("sections"),
    testId: v.id("tests"),
    explanation: v.optional(v.string()),
    marks: v.optional(v.number()), // marks for this question
    negativeMarks: v.optional(v.number()), // negative marking if any
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_section", ["sectionId"]),

  // Test attempts
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
