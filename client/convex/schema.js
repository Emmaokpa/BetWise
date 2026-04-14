import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  userPicks: defineTable({
    userId: v.id("users"),
    matchApiId: v.number(),
    predictionId: v.optional(v.id("predictions")),
  }).index("by_userId", ["userId"]),
  
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
    preferences: v.optional(v.object({
      pushEnabled: v.boolean(),
    })),
  }).index("by_email", ["email"]),
  matches: defineTable({
    apiId: v.number(),
    competition: v.object({
      id: v.optional(v.number()),
      name: v.string(),
      code: v.string(),
      emblem: v.optional(v.string()),
      type: v.optional(v.string()),
    }),
    season: v.optional(v.object({
      id: v.number(),
      startDate: v.string(),
      endDate: v.string(),
      currentMatchday: v.number(),
      winner: v.optional(v.union(v.string(), v.null())),
    })),
    utcDate: v.string(),
    status: v.string(),
    matchday: v.optional(v.union(v.number(), v.null())),
    stage: v.optional(v.union(v.string(), v.null())),
    group: v.optional(v.union(v.string(), v.null())),
    homeTeam: v.object({
      id: v.number(),
      name: v.string(),
      shortName: v.string(),
      tla: v.optional(v.union(v.string(), v.null())),
      crest: v.optional(v.union(v.string(), v.null())),
    }),
    awayTeam: v.object({
      id: v.number(),
      name: v.string(),
      shortName: v.string(),
      tla: v.optional(v.union(v.string(), v.null())),
      crest: v.optional(v.union(v.string(), v.null())),
    }),
    score: v.object({
      winner: v.optional(v.union(v.string(), v.null())),
      duration: v.string(),
      fullTime: v.object({ home: v.union(v.number(), v.null()), away: v.union(v.number(), v.null()) }),
      halfTime: v.optional(v.object({ home: v.union(v.number(), v.null()), away: v.union(v.number(), v.null()) })),
    }),
    lastUpdated: v.string(),
  }).index("by_apiId", ["apiId"]).index("by_status", ["status"]).index("by_date", ["utcDate"]),

  predictions: defineTable({
    matchId: v.id("matches"),
    matchApiId: v.number(),
    outcome: v.string(),
    marketType: v.string(),
    confidence: v.number(),
    odds: v.optional(v.number()),
    reasoning: v.optional(v.string()),
    actualResult: v.optional(v.string()),
    isCorrect: v.optional(v.boolean()),
    factors: v.object({
      form: v.number(),
      h2h: v.number(),
      goals: v.number(),
      position: v.number(),
      news: v.number(),
      homeAdvantage: v.number(),
    }),
  }).index("by_matchId", ["matchId"]).index("by_matchApiId", ["matchApiId"]),

  standings: defineTable({
    competitionCode: v.string(),
    lastUpdated: v.string(),
    table: v.array(v.object({
      position: v.number(),
      team: v.object({
        id: v.number(),
        name: v.string(),
        shortName: v.string(),
        tla: v.optional(v.string()),
        crest: v.string(),
      }),
      playedGames: v.number(),
      won: v.number(),
      draw: v.number(),
      lost: v.number(),
      points: v.number(),
      goalsFor: v.number(),
      goalsAgainst: v.number(),
      goalDifference: v.number(),
    })),
  }).index("by_competition", ["competitionCode"]),
  pushSubscriptions: defineTable({
    userId: v.optional(v.id("users")),
    endpoint: v.string(),
    auth: v.string(),
    p256dh: v.string(),
    createdAt: v.number(),
  }).index("by_endpoint", ["endpoint"]),
});
