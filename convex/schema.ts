import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Main categories (e.g., "Clerk Exam")
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Sub-categories (e.g., "Memory Based Papers", "Practice Papers")
  subCategories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    categoryId: v.id("categories"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Tests (e.g., "Test 1", "Test 2" under Memory Based Papers)
  tests: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    subCategoryId: v.id("subCategories"),
    totalQuestions: v.number(),
    duration: v.optional(v.number()), // in minutes
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Questions within each test
  questions: defineTable({
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(), // Index of the correct option
    testId: v.id("tests"),
    explanation: v.optional(v.string()),
    marks: v.optional(v.number()), // marks for this question
    negativeMarks: v.optional(v.number()), // negative marking if any
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});