import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

const TARGET_LANGUAGE = "hi";

export const getTestTranslationSource = internalQuery({
  args: {
    testId: v.id("tests"),
  },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.testId);
    if (!test) {
      return null;
    }

    const questions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("testId"), args.testId))
      .collect();

    return {
      test,
      questions: questions.sort((a, b) => a.createdAt - b.createdAt),
    };
  },
});

export const setTranslationStatus = internalMutation({
  args: {
    testId: v.id("tests"),
    status: v.union(
      v.literal("queued"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.testId, {
      translationStatus: args.status,
      translationError: args.error,
      translationUpdatedAt: Date.now(),
    });
  },
});

export const applyHindiTranslation = internalMutation({
  args: {
    testId: v.id("tests"),
    questions: v.array(
      v.object({
        questionId: v.id("questions"),
        questionHi: v.optional(v.string()),
        optionsHi: v.array(v.string()),
        optionItemsHi: v.array(
          v.object({
            type: v.union(v.literal("text"), v.literal("image")),
            text: v.optional(v.string()),
          })
        ),
        explanationHi: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const question of args.questions) {
      const existing = await ctx.db.get(question.questionId);
      if (!existing) {
        continue;
      }

      await ctx.db.patch(question.questionId, {
        questionHi: question.questionHi,
        optionsHi: question.optionsHi,
        optionItemsHi: question.optionItemsHi,
        explanationHi: question.explanationHi,
        updatedAt: Date.now(),
      });
    }

    const test = await ctx.db.get(args.testId);
    if (!test) {
      return;
    }

    await ctx.db.patch(args.testId, {
      translationStatus: "completed",
      translatedLanguages: Array.from(
        new Set([...(test.translatedLanguages || []), TARGET_LANGUAGE])
      ),
      translationError: undefined,
      translationUpdatedAt: Date.now(),
    });
  },
});
