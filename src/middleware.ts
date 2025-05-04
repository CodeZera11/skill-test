import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/instructions(.*)",
  "/tests(.*)/attempt(.*)",
  "/my-attempts(.*)",
  "/api/payment(.*)",
  "/callback(.*)",
]);

const isAdminRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const role = (await auth()).sessionClaims?.metadata?.role;
  console.log("Role:", role);
  // if (isAdminRoute(req) && role !== "admin") {
  //   const url = new URL("/", req.url);
  //   return NextResponse.redirect(url);
  // }

  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
