import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const recordRound = mutation({
  args: {
    roundId: v.string(),
    multiplier: v.number(),
    roundTime: v.string(),
    hash: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("aviatorRounds", {
      ...args
    });
  }
});

export const getHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aviatorRounds")
      .order("desc")
      .take(args.limit || 50);
  }
});

export const getStats = query({
  handler: async (ctx) => {
    const rounds = await ctx.db.query("aviatorRounds").order("desc").take(100);
    if (rounds.length === 0) return { avg: 0, lowBustRate: 0, count: 0 };

    const total = rounds.reduce((sum, r) => sum + r.multiplier, 0);
    const lowBusts = rounds.filter(r => r.multiplier < 1.2).length;

    return {
      avg: parseFloat((total / rounds.length).toFixed(2)),
      lowBustRate: parseFloat(((lowBusts / rounds.length) * 100).toFixed(1)),
      count: rounds.length,
      recent: rounds.slice(0, 10)
    };
  }
});

// Seed data for demo purposes
export const seedHistoricalData = internalMutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("aviatorRounds").first();
    if (existing) return;

    for (let i = 0; i < 50; i++) {
        const mult = Math.random() > 0.8 
          ? (Math.random() * 8 + 2).toFixed(2) 
          : Math.random() > 0.3 
            ? (Math.random() * 1.5 + 1.2).toFixed(2)
            : (Math.random() * 0.2 + 1.0).toFixed(2);
            
        await ctx.db.insert("aviatorRounds", {
            roundId: `R-${1000 + i}`,
            multiplier: parseFloat(mult),
            roundTime: new Date(Date.now() - i * 60000).toISOString(),
        });
    }
  }
});
