import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkUserId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    posts: v.optional(v.array(v.id("posts"))),
  }).index("byClerkUserId", ["clerkUserId"]),
  // Main categories (e.g., "Clerk Exam")
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
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
    categoryId: v.id("categories"),
    imageStorageId: v.id("_storage"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_name", {
    searchField: "name",
    filterFields: ["createdAt", "updatedAt"],
  }),

  // Tests (e.g., "Test 1", "Test 2" under Memory Based Papers)
  tests: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    subCategoryId: v.id("subCategories"),
    totalQuestions: v.optional(v.number()),
    totalMarks: v.optional(v.number()),
    duration: v.optional(v.number()), // in minutes
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_name", {
    searchField: "name",
  }),

  // Sections within each test (e.g., "General Knowledge", "Mathematics")
  sections: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    testId: v.id("tests"),
    duration: v.optional(v.number()),
    totalQuestions: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_name", {
    searchField: "name",
  }),

  // Questions within each section
  questions: defineTable({
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(), // Index of the correct option
    sectionId: v.id("sections"),
    explanation: v.optional(v.string()),
    marks: v.optional(v.number()), // marks for this question
    negativeMarks: v.optional(v.number()), // negative marking if any
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_section", ["sectionId"]),

  // Test attempts
  testAttempts: defineTable({
    userId: v.id("users"), // Placeholder for future auth
    testId: v.id("tests"),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    score: v.optional(v.number()),
    correctAnswers: v.optional(v.number()),
    incorrectAnswers: v.optional(v.number()),
    timeTaken: v.optional(v.number()), // in seconds
    performancePercentile: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});
