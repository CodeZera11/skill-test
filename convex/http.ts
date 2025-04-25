import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

// define the webhook handler
const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Error occured", { status: 400 });
  }
  switch (event.type) {
    case "user.created":
    case "user.updated": {
      await ctx.runMutation(internal.users.upsertFromClerk, {
        data: event.data,
      });
      break;
    }
    case "user.deleted": {
      const clerkUserId = event.data.id!;
      await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
      break;
    }
    default: {
      console.log("ignored Clerk webhook event", event.type);
    }
  }
  return new Response(null, { status: 200 });
});

// define the http router
const http = httpRouter();

// define the webhook route
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}
