"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const GOOGLE_TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2";
const DEFAULT_BATCH_SIZE = 100;

const isNumericLike = (text: string) => {
  const trimmed = text.trim();
  return /\d/.test(trimmed) && /^[\d\s.,()%+\-/:=]+$/.test(trimmed);
};

const isImagePlaceholder = (text: string) => {
  const trimmed = text.trim();
  return (
    /^\[image option \d+\]$/i.test(trimmed) ||
    /^image option \d+$/i.test(trimmed)
  );
};

const shouldTranslateText = (text?: string) => {
  if (!text || !text.trim()) {
    return false;
  }

  return !isNumericLike(text) && !isImagePlaceholder(text);
};

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const chunk = <T>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

const translateTexts = async (texts: string[]) => {
  if (texts.length === 0) {
    return [];
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_TRANSLATE_API_KEY");
  }

  const translated: string[] = [];

  for (const batch of chunk(texts, DEFAULT_BATCH_SIZE)) {
    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: batch,
        source: "en",
        target: "hi",
        format: "text",
      }),
    });

    const data = (await response.json()) as {
      error?: { message?: string };
      data?: { translations?: Array<{ translatedText: string }> };
    };

    if (!response.ok) {
      throw new Error(data.error?.message || "Google Translate request failed");
    }

    const batchTranslations =
      data.data?.translations?.map((item) =>
        decodeHtmlEntities(item.translatedText)
      ) || [];

    translated.push(...batchTranslations);
  }

  return translated;
};

export const translateTestToHindi = internalAction({
  args: {
    testId: v.id("tests"),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.testTranslationHelpers.setTranslationStatus, {
      testId: args.testId,
      status: "processing",
    });

    try {
      const source = await ctx.runQuery(
        internal.testTranslationHelpers.getTestTranslationSource,
        {
          testId: args.testId,
        }
      );

      if (!source) {
        throw new Error("Test not found");
      }

      const translationInputs: Array<{
        key: string;
        text: string;
      }> = [];

      source.questions.forEach((question) => {
        if (shouldTranslateText(question.question)) {
          translationInputs.push({
            key: `${question._id}:question`,
            text: question.question,
          });
        }

        if (shouldTranslateText(question.explanation)) {
          translationInputs.push({
            key: `${question._id}:explanation`,
            text: question.explanation!,
          });
        }

        question.options.forEach((option, optionIndex) => {
          if (shouldTranslateText(option)) {
            translationInputs.push({
              key: `${question._id}:option:${optionIndex}`,
              text: option,
            });
          }
        });

        (question.optionItems || []).forEach((item, optionIndex) => {
          if (item.type === "image" && shouldTranslateText(item.text)) {
            translationInputs.push({
              key: `${question._id}:imageLabel:${optionIndex}`,
              text: item.text!,
            });
          }
        });
      });

      const translatedTexts = await translateTexts(
        translationInputs.map((item) => item.text)
      );

      const translatedMap = new Map<string, string>();
      translationInputs.forEach((item, index) => {
        translatedMap.set(item.key, translatedTexts[index] || item.text);
      });

      const payload = source.questions.map((question) => {
        const rawItems =
          question.optionItems && question.optionItems.length > 0
            ? question.optionItems
            : question.options.map((text) => ({
                type: "text" as const,
                text,
              }));

        const optionsHi = question.options.map(
          (option, optionIndex) =>
            translatedMap.get(`${question._id}:option:${optionIndex}`) || option
        );

        return {
          questionId: question._id,
          questionHi:
            translatedMap.get(`${question._id}:question`) || question.question,
          optionsHi,
          optionItemsHi: rawItems.map((item, optionIndex) => {
            if (item.type === "text") {
              return {
                type: item.type,
                text: optionsHi[optionIndex] || item.text,
              };
            }

            return {
              type: item.type,
              text:
                translatedMap.get(`${question._id}:imageLabel:${optionIndex}`) ||
                item.text,
            };
          }),
          explanationHi:
            translatedMap.get(`${question._id}:explanation`) ||
            question.explanation,
        };
      });

      await ctx.runMutation(internal.testTranslationHelpers.applyHindiTranslation, {
        testId: args.testId,
        questions: payload,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Hindi translation failed";

      await ctx.runMutation(internal.testTranslationHelpers.setTranslationStatus, {
        testId: args.testId,
        status: "failed",
        error: message,
      });

      throw error;
    }
  },
});
