import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { Question } from "./sections";

export const startTestAttempt = mutation({
  args: {
    userId: v.id("users"),
    testId: v.id("tests"),
  },
  handler: async ({ db }, { userId, testId }) => {
    const startTime = Date.now();

    const test = await db
      .query("tests")
      .filter((q) => q.eq(q.field("_id"), testId))
      .first();

    if (!test) {
      throw new Error("Test not found");
    }

    await db.patch(testId, {
      attempts: test?.attempts ? test.attempts + 1 : 1,
    });

    const testAttemptId = await db.insert("testAttempts", {
      userId,
      testId,
      startTime,
      answers: [],
      createdAt: startTime,
      updatedAt: startTime,
    });

    return testAttemptId;
  },
});

// export const updateCurrentSection = mutation({
//   args: {
//     testAttemptId: v.id("testAttempts"),
//     newSectionId: v.id("sections"),
//     timeSpentInSeconds: v.number(),
//   },
//   handler: async (
//     { db },
//     { testAttemptId, newSectionId, timeSpentInSeconds }
//   ) => {
//     const testAttempt = await db
//       .query("testAttempts")
//       .filter((q) => q.eq(q.field("_id"), testAttemptId))
//       .first();

//     if (!testAttempt) {
//       throw new Error("Test attempt not found");
//     }

//     const updatedSectionTimes = [
//       ...(testAttempt.sectionTimes || []),
//       {
//         sectionId: newSectionId,
//         timeSpentInSeconds,
//       },
//     ];

//     await db.patch(testAttemptId, {
//       currentSection: newSectionId, // Update to the new section
//       sectionTimes: updatedSectionTimes, // Update the time spent on sections
//       updatedAt: Date.now(),
//     });

//     return { success: true };
//   },
// });

export const submitTestAttempt = mutation({
  args: {
    testAttemptId: v.id("testAttempts"),
    answers: v.record(v.string(), v.union(v.null(), v.number())),
  },
  handler: async (ctx, { testAttemptId, answers }) => {
    try {
      const endTime = Date.now();

      const testAttempt = await ctx.db
        .query("testAttempts")
        .filter((q) => q.eq(q.field("_id"), testAttemptId))
        .first();

      if (!testAttempt) {
        throw new Error("Test attempt not found");
      }

      const test = await ctx.db.get(testAttempt.testId);
      if (!test) {
        throw new Error("Test not found");
      }

      const questions = await ctx.db
        .query("questions")
        .filter((q) => q.eq(q.field("testId"), testAttempt.testId))
        .collect();

      if (!questions || questions.length === 0) {
        throw new Error("No questions found for this test");
      }

      let correctAnswers = 0;
      let incorrectAnswers = 0;
      let score = 0;

      const detailedAnswers = questions.map((question) => {
        const userAnswer = answers[question._id];
        const isCorrect = userAnswer === question.correctAnswer;

        if (userAnswer !== undefined && userAnswer !== null) {
          if (isCorrect) {
            correctAnswers++;
            score += question.marks || 1; // Default to 1 mark if not specified
          } else {
            incorrectAnswers++;
            score -= question.negativeMarks || 0; // Default to 0 negative marks if not specified
          }
        }

        return {
          questionId: question._id,
          selectedOption: userAnswer ?? null,
          isCorrect:
            userAnswer !== undefined && userAnswer !== null ? isCorrect : false,
        };
      });

      const startTime = testAttempt.startTime;
      const timeTaken = (endTime - startTime) / 1000; // in seconds

      await ctx.db.patch(testAttemptId, {
        endTime,
        correctAnswers,
        incorrectAnswers,
        score,
        timeTakenInSeconds: timeTaken,
        updatedAt: endTime,
        answers: detailedAnswers.map((answer) => ({
          ...answer,
          selectedOption:
            answer.selectedOption !== null ? answer.selectedOption : undefined,
        })),
      });

      return {
        score,
        correctAnswers,
        incorrectAnswers,
        timeTaken,
      };
    } catch (error) {
      console.error("Error submitting test attempt:", error);
      return null;
    }
  },
});

export const getTestAttempt = query({
  args: {
    id: v.id("testAttempts"),
  },
  handler: async (ctx, { id }) => {
    try {
      const testAttempt = await ctx.db
        .query("testAttempts")
        .filter((q) => q.eq(q.field("_id"), id))
        .order("desc")
        .first();

      if (!testAttempt) {
        throw new Error("Test attempt not found");
      }

      const test = await ctx.db.get(testAttempt.testId);
      if (!test) {
        throw new Error("Test not found");
      }

      const sections = await ctx.db
        .query("sections")
        .filter((s) => s.eq(s.field("testId"), testAttempt.testId))
        .collect();
      if (!sections || sections.length === 0) {
        throw new Error("No sections found for this test");
      }

      const questions = await ctx.db
        .query("questions")
        .filter((q) => q.eq(q.field("testId"), testAttempt.testId))
        .collect();

      if (!questions || questions.length === 0) {
        throw new Error("No questions found for this test");
      }

      return {
        testAttempt: {
          ...testAttempt,
          answers: testAttempt.answers || [],
        },
        test,
        sections,
        questions,
      };
    } catch (error) {
      console.error("Error fetching test attempt:", error);
      return null;
    }
  },
});

export const getTestAttemptForResultPage = query({
  args: {
    id: v.id("testAttempts"),
  },
  handler: async (ctx, { id }) => {
    try {
      const testAttempt = await ctx.db
        .query("testAttempts")
        .filter((q) => q.eq(q.field("_id"), id))
        .order("desc")
        .first();

      if (!testAttempt) {
        throw new Error("Test attempt not found");
      }

      const test = await ctx.db.get(testAttempt.testId);
      if (!test) {
        throw new Error("Test not found");
      }

      const sections = await ctx.db
        .query("sections")
        .filter((s) => s.eq(s.field("testId"), testAttempt.testId))
        .collect();

      const answers = testAttempt.answers || [];
      const detailedAnswers = await Promise.all(
        answers.map(async (answer) => {
          const question = await ctx.db.get(answer.questionId);
          return {
            ...answer,
            question,
          };
        })
      );

      return {
        testAttempt: {
          ...testAttempt,
          // sectionTimes: testAttempt.sectionTimes || [],
          // submittedSections: testAttempt.submittedSections || [],
          answers: detailedAnswers,
        },
        test,
        sections,
      };
    } catch (error) {
      console.error("Error fetching test attempt:", error);
      return null;
    }
  },
});

// Updated types for TestAttempt and TestAttemptWithDetails
export type TestAttempt = {
  _id: Id<"testAttempts">;
  userId: Id<"users">;
  testId: Id<"tests">;
  startTime: number;
  endTime?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  score?: number;
  timeTakenInSeconds?: number;
  performancePercentile?: number;
  answers?: {
    questionId: Id<"questions">;
    selectedOption?: number;
    isCorrect: boolean;
  }[];
  createdAt: number;
  updatedAt: number;
};

export type TestAttemptWithDetails = {
  testAttempt: TestAttempt;
  test: {
    _id: Id<"tests">;
    name: string;
    description?: string;
    durationInSeconds?: number;
    attempts?: number;
    createdAt: number;
    updatedAt: number;
  };
  sections: {
    _id: Id<"sections">;
    name: string;
    description?: string;
    durationInSeconds?: number;
    testId: Id<"tests">;
    createdAt: number;
    updatedAt: number;
  }[];
  questions: Question[];
};

export const getTestAttemptsByUser = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkUserId"), args.clerkUserId))
        .first();
      if (!user) {
        throw new Error("User not found");
      }

      const testAttempts = await ctx.db
        .query("testAttempts")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .order("desc")
        .collect();
      if (!testAttempts) {
        throw new Error("No test attempts found for this user");
      }

      const testWithDetails = await Promise.all(
        testAttempts.map(async (testAttempt) => {
          const test = await ctx.db.get(testAttempt.testId);
          if (!test) {
            return null
          }

          return {
            ...testAttempt,
            test,
          };
        })
      );

      const fitlerTestWithDetails = testWithDetails.filter(attempt => attempt !== null);

      return fitlerTestWithDetails;
    } catch (error) {
      console.log("Error fetching test attempts:", error);
      return null;
    }
  },
});

// export const submitSection = mutation({
//   args: {
//     testAttemptId: v.id("testAttempts"),
//     sectionId: v.id("sections"),
//     timeSpentInSeconds: v.number(),
//     answers: v.record(v.string(), v.union(v.null(), v.number())),
//   },
//   handler: async (
//     ctx,
//     { testAttemptId, sectionId, timeSpentInSeconds, answers }
//   ) => {
//     try {
//       const testAttempt = await ctx.db
//         .query("testAttempts")
//         .filter((q) => q.eq(q.field("_id"), testAttemptId))
//         .first();

//       if (!testAttempt) {
//         throw new Error("Test attempt not found");
//       }

//       const submittedSections = testAttempt.submittedSections || [];
//       if (submittedSections.includes(sectionId)) {
//         throw new Error("Section already submitted.");
//       }

//       const updatedSubmittedSections = [...submittedSections, sectionId];

//       const questions = await ctx.db
//         .query("questions")
//         .filter((q) => q.eq(q.field("sectionId"), sectionId))
//         .collect();

//       let correctAnswers = 0;
//       let incorrectAnswers = 0;
//       let score = 0;

//       const detailedAnswers = questions.map((question) => {
//         const userAnswer = answers[question._id];
//         const isCorrect = userAnswer === question.correctAnswer;

//         if (userAnswer !== undefined) {
//           if (isCorrect) {
//             correctAnswers++;
//             score += question.marks || 1;
//           } else {
//             incorrectAnswers++;
//             score -= question.negativeMarks || 0;
//           }
//         }

//         return {
//           questionId: question._id,
//           selectedOption: userAnswer ?? undefined,
//           isCorrect,
//         };
//       });

//       const updatedSectionTimes = [
//         ...(testAttempt.sectionTimes || []),
//         {
//           sectionId,
//           timeSpentInSeconds,
//         },
//       ];

//       await ctx.db.patch(testAttemptId, {
//         submittedSections: updatedSubmittedSections,
//         sectionTimes: updatedSectionTimes,
//         answers: [...(testAttempt.answers || []), ...detailedAnswers],
//         updatedAt: Date.now(),
//       });

//       return {
//         submittedSections: updatedSubmittedSections,
//         correctAnswers,
//         incorrectAnswers,
//         score,
//       };
//     } catch (error) {
//       console.error("Error submitting section:", error);
//       return null;
//     }
//   },
// });
