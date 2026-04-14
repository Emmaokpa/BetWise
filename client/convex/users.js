import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const savePick = mutation({
  args: {
    matchApiId: v.number(),
    predictionId: v.optional(v.id("predictions")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated call to savePick");
    }

    // Check if pick already exists
    const existingPicks = await ctx.db
      .query("userPicks")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
      
    const existingPick = existingPicks.find((p) => p.matchApiId === args.matchApiId);

    if (existingPick) {
      return existingPick._id;
    }

    return await ctx.db.insert("userPicks", {
      userId,
      matchApiId: args.matchApiId,
      predictionId: args.predictionId,
    });
  },
});

export const removePick = mutation({
  args: {
    matchApiId: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated call to removePick");
    }

    const existingPicks = await ctx.db
      .query("userPicks")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
      
    const existingPick = existingPicks.find((p) => p.matchApiId === args.matchApiId);

    if (existingPick) {
      await ctx.db.delete(existingPick._id);
    }
  },
});

export const getUserPicks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("userPicks")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { winRate: "0%", totalFollowed: 0, wins: 0, losses: 0 };
    }

    const picks = await ctx.db
      .query("userPicks")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    let wins = 0;
    let losses = 0;
    
    for (const pick of picks) {
      if (pick.predictionId) {
         const pred = await ctx.db.get(pick.predictionId);
         if (pred) {
            if (pred.isCorrect === true) wins++;
            else if (pred.isCorrect === false) losses++;
         }
      }
    }
    
    const resolved = wins + losses;
    const winRate = resolved > 0 ? Math.round((wins / resolved) * 100) : 0;

    return {
      winRate: `${winRate}%`,
      totalFollowed: picks.length,
      wins,
      losses,
    };
  },
});
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

export const updatePreferences = mutation({
  args: { pushEnabled: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    await ctx.db.patch(userId, {
      preferences: {
        pushEnabled: args.pushEnabled
      }
    });
  },
});

export const promoteToAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error("User not found. They must login first.");
    }

    await ctx.db.patch(user._id, {
      isAdmin: true
    });
    
    return { success: true };
  },
});
