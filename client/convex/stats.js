import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAccuracyStats = query({
  args: {},
  handler: async (ctx) => {
    const predictions = await ctx.db
      .query("predictions")
      .filter((q) => q.neq(q.field("isCorrect"), undefined))
      .collect();

    const total = predictions.length;
    if (total === 0) {
      return { total: 0, winRate: 0, wins: 0, losses: 0 };
    }

    const wins = predictions.filter((p) => p.isCorrect).length;
    const losses = total - wins;

    return {
      total,
      wins,
      losses,
      winRate: Math.round((wins / total) * 100),
      // Future: add breakdown by league/market
    };
  },
});
