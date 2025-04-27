/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as categories from "../categories.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as questions from "../questions.js";
import type * as sections from "../sections.js";
import type * as subCategories from "../subCategories.js";
import type * as testAttempts from "../testAttempts.js";
import type * as tests from "../tests.js";
import type * as topics from "../topics.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  categories: typeof categories;
  files: typeof files;
  http: typeof http;
  questions: typeof questions;
  sections: typeof sections;
  subCategories: typeof subCategories;
  testAttempts: typeof testAttempts;
  tests: typeof tests;
  topics: typeof topics;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
