import { mutation, query, action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const saveSubscription = mutation({
  args: {
    endpoint: v.string(),
    auth: v.string(),
    p256dh: v.string(),
    userId: v.optional(v.id("users")),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if subscription already exists
    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_endpoint", (q) => q.eq("endpoint", args.endpoint))
      .unique();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("pushSubscriptions", {
      ...args,
    });
  },
});

export const removeSubscription = mutation({
  args: { endpoint: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_endpoint", (q) => q.eq("endpoint", args.endpoint))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getSubscribersCount = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("pushSubscriptions").collect();
    return all.length;
  },
});

export const broadcastNotification = mutation({
  args: { title: v.string(), message: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    const user = await ctx.db.get(userId);
    if (!user?.isAdmin) throw new Error("Only admins can broadcast");

    const subscribers = await ctx.db.query("pushSubscriptions").collect();
    
    // In a real Web Push implementation, we would loop and use web-push library
    // For now, we log the broadcast event to the dashboard
    console.log(`BROADCASTING to ${subscribers.length} devices: ${args.title} - ${args.message}`);
    
    return { count: subscribers.length };
  },
});
