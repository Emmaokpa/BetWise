import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// 1. fetchFixtures - Daily at 11:50pm WAT (10:50pm UTC)
crons.daily(
  "fetch-fixtures",
  { hourUTC: 22, minuteUTC: 50 },
  internal.football.fetchTodayFixtures
);

// 2. generatePredictions - Daily at 6:00am WAT (5:00am UTC)
crons.daily(
  "generate-predictions",
  { hourUTC: 5, minuteUTC: 0 },
  internal.predictions.generateDailyPredictions
);

// 3. fetchLiveScores - Every 2 min (12pm - 11pm WAT)
// Note: Convex crons don't support complex hourly windows like node-cron easily in a single definition.
// We can use a frequent interval and check time inside the function, or just run it all day.
crons.interval(
  "fetch-live-scores",
  { minutes: 2 },
  internal.football.fetchTodayFixtures // Re-using sync logic for now
);

// 4. checkRecentResults - Hourly
crons.interval(
  "verify-predictions",
  { minutes: 60 },
  internal.football.checkRecentResults
);

export default crons;
