import { action, mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

const FOOTBALL_DATA_API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = "https://api.football-data.org/v4";

export const fetchTodayFixtures = action({
  args: {},
  handler: async (ctx) => {
    if (!FOOTBALL_DATA_API_KEY) {
      throw new Error("FOOTBALL_DATA_API_KEY is not set in environment variables");
    }

    const response = await fetch(`${BASE_URL}/matches`, {
      headers: { "X-Auth-Token": FOOTBALL_DATA_API_KEY },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Football API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.matches) {
      for (const match of data.matches) {
        await ctx.runMutation(internal.football.syncMatch, { match });
      }
    }

    return { count: data.matches?.length || 0 };
  },
});

export const checkRecentResults = action({
  args: {},
  handler: async (ctx) => {
    if (!FOOTBALL_DATA_API_KEY) {
      throw new Error("FOOTBALL_DATA_API_KEY is not set in environment variables");
    }

    // Fetch finished matches from the last 24 hours
    const response = await fetch(`${BASE_URL}/matches?status=FINISHED`, {
      headers: { "X-Auth-Token": FOOTBALL_DATA_API_KEY },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Football API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    for (const match of data.matches) {
      // 1. Sync the match score/status
      await ctx.runMutation(internal.football.syncMatch, { match });
      
      // 2. Trigger prediction verification
      await ctx.runMutation(internal.predictions.verifyPredictionResult, { 
        matchApiId: match.id,
        actualScore: match.score 
      });
    }

    return { count: data.matches?.length || 0 };
  },
});

export const fetchStandings = action({
  args: { competitionCode: v.string() },
  handler: async (ctx, { competitionCode }) => {
    if (!FOOTBALL_DATA_API_KEY) {
      throw new Error("FOOTBALL_DATA_API_KEY is not set in environment variables");
    }

    const response = await fetch(`${BASE_URL}/competitions/${competitionCode}/standings`, {
      headers: { "X-Auth-Token": FOOTBALL_DATA_API_KEY },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Football API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.standings && data.standings.length > 0) {
      const mainStanding = data.standings.find(s => s.type === 'TOTAL') || data.standings[0];
      
      await ctx.runMutation(internal.football.syncStandings, { 
        competitionCode, 
        table: mainStanding.table 
      });
    }

    return { success: true };
  },
});

export const syncMatch = internalMutation({
  args: { match: v.any() },
  handler: async (ctx, { match }) => {
    const existing = await ctx.db
      .query("matches")
      .withIndex("by_apiId", (q) => q.eq("apiId", match.id))
      .unique();

    const matchData = {
      apiId: match.id,
      competition: match.competition,
      season: match.season,
      utcDate: match.utcDate,
      status: match.status,
      matchday: match.matchday,
      stage: match.stage,
      group: match.group,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      score: {
        winner: match.score.winner,
        duration: match.score.duration,
        fullTime: match.score.fullTime,
        halfTime: match.score.halfTime,
      },
      lastUpdated: match.lastUpdated,
    };

    if (existing) {
      await ctx.db.patch(existing._id, matchData);
    } else {
      await ctx.db.insert("matches", matchData);
    }
  },
});

export const getMatches = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    let query = ctx.db.query("matches");
    if (status) {
      query = query.withIndex("by_status", (q) => q.eq("status", status));
    }
    return await query.order("desc").collect();
  },
});

export const syncStandings = internalMutation({
  args: { competitionCode: v.string(), table: v.array(v.any()) },
  handler: async (ctx, { competitionCode, table }) => {
    const existing = await ctx.db
      .query("standings")
      .withIndex("by_competition", (q) => q.eq("competitionCode", competitionCode))
      .unique();

    const standingData = {
      competitionCode,
      table: table.map(row => ({
        position: row.position,
        team: {
          id: row.team.id,
          name: row.team.name,
          shortName: row.team.shortName,
          tla: row.team.tla,
          crest: row.team.crest,
        },
        playedGames: row.playedGames,
        won: row.won,
        draw: row.draw,
        lost: row.lost,
        points: row.points,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        goalDifference: row.goalDifference,
      })),
      lastUpdated: new Date().toISOString(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, standingData);
    } else {
      await ctx.db.insert("standings", standingData);
    }
  },
});

export const getStandings = query({
  args: { competitionCode: v.string() },
  handler: async (ctx, { competitionCode }) => {
    return await ctx.db
      .query("standings")
      .withIndex("by_competition", (q) => q.eq("competitionCode", competitionCode))
      .unique();
  },
});
