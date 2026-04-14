import { query } from "./_generated/server";
export const getCounts = query({
  handler: async (ctx) => {
    const matches = await ctx.db.query("matches").collect();
    const predictions = await ctx.db.query("predictions").collect();
    return { matches: matches.length, predictions: predictions.length };
  }
});
