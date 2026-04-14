# BetWise NG — Complete Build Plan for Antigravity

> **From:** The founder  
> **To:** Antigravity (developer)  
> **Last updated:** April 2025  
> **Version:** 1.0

---

## What This Document Is

This is the complete, detailed plan for building **BetWise NG** — a free sports betting prediction platform built specifically for Nigerian bettors. Read this entire document before writing a single line of code. Every decision about the stack, the features, the phases, and the rules has been thought through carefully. Follow the phases in order. Do not skip ahead.

---

## The Vision

BetWise NG is Nigeria's go-to free sports prediction platform. Users come every day to see football predictions, live scores, team stats, and Aviator crash analysis — all completely free, no subscription, no login required to use the core features.

**How we make money:** Ads only. Monetag and Adsterra from day one. Google AdSense when we hit 1,000 daily users.

**Why free:** Nigerian users do not subscribe to things the way Americans do. They will use a free platform every day and ignore a paid one forever. Free + ads is the correct model for this market.

**Who builds it:** You (Antigravity).  
**Who owns it:** The founder.  
**The founder's role:** Product decisions, content strategy, social media growth. Not code.

---

## Do I Need Authentication?

Short answer: **No, not for Phase 1 or Phase 2.**

Since everything is free and we monetise via ads, there is no reason to lock predictions behind a login. The more people can access the platform without friction, the more ad impressions we get, and the more money we make.

Here is the rule:

| Feature | Needs login? |
|---|---|
| View predictions | No — fully public |
| See live scores | No — fully public |
| Aviator analysis | No — fully public |
| Stats and league tables | No — fully public |
| Personal prediction tracker | Optional (Phase 3 only) |
| Push notification preferences | Optional (Phase 3 only) |
| Accumulator builder | No — localStorage is fine |

Build Phase 1 and Phase 2 with **zero authentication**. Add optional Google Sign-In in Phase 3 only, and only for the tracker feature. Never put predictions behind a login wall. Ever.

---

## Tech Stack — Use Exactly These

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| TailwindCSS | All styling |
| React Router v6 | Page routing |
| TanStack Query (React Query) | Data fetching and caching |
| Zustand | Lightweight client state |
| Socket.io client | Live score real-time updates |
| Recharts | Charts for Aviator and stats |
| Axios | HTTP requests to our backend |
| dayjs | All date/time — always display in WAT (UTC+1) |
| Vite PWA plugin | Make the site installable on Android |

### Backend (Convex)
| Technology | Purpose |
|---|---|
| Convex | Serverless DB, Backend Functions, and Real-time Reactivity |
| Convex Actions | Handle external API calls (football-data.org) |
| Convex Crons | Scheduled daily jobs for predictions and scores |
| Convex HTTP | REST API endpoints (if needed for external webhooks) |

### External Services — Updated
| Service | What it does | Cost |
|---|---|---|
| football-data.org | Fixtures, live scores, league tables | Free |
| Convex | Database, Auth, and Functions | Free Tier |
| Upstash Redis | Still used for high-frequency caching if needed | Free Tier |
| Monetag | Ad network 1 | Free — revenue share |
| Adsterra | Ad network 2 | Free — revenue share |

**Important note on odds:** We will NOT integrate a paid odds API. Instead, every match card will have a "Check odds on Bet9ja" button that links to the bookmaker. In Phase 4 we apply for Bet9ja and Sportybet affiliate programs — they pay commission per user we refer, which earns more than ads per click.

### Why These Free APIs Are Enough
football-data.org gives 10 calls per minute. Because we cache everything in Redis, our users never directly hit the API — they read from cache. The actual API calls are made by background jobs on a schedule. 277 calls per day is all we need, spread over 24 hours. This free tier supports unlimited users because user count and API call count are completely decoupled by caching.

---

## Folder Structure — Set This Up First

```
betwise-ng/
├── client/                         # React + Vite frontend
│   ├── public/
│   │   └── icons/                  # PWA icons all sizes
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Predictions.jsx
│   │   │   ├── LiveScores.jsx
│   │   │   ├── Stats.jsx
│   │   │   ├── Aviator.jsx
│   │   │   ├── Results.jsx
│   │   │   └── MatchDetail.jsx
│   │   ├── components/
│   │   │   ├── layout/             # Navbar, BottomNav, Footer, Layout
│   │   │   ├── predictions/        # MatchCard, ConfidenceBar, OddsButton
│   │   │   ├── scores/             # LiveScoreCard, LeagueTable
│   │   │   ├── aviator/            # CrashChart, StreakTracker, BankrollCalc
│   │   │   ├── ads/                # AdSlot.jsx
│   │   │   └── shared/             # Button, Badge, Spinner, EmptyState
│   │   ├── hooks/
│   │   │   ├── useMatches.js
│   │   │   ├── usePredictions.js
│   │   │   ├── useSocket.js
│   │   │   └── useLiveScores.js
│   │   ├── store/
│   │   │   └── useAppStore.js      # Zustand store
│   │   ├── lib/
│   │   │   ├── api.js              # Axios instance with base URL
│   │   │   └── utils.js            # Format dates, format odds, etc.
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── server/
│   ├── routes/
│   │   ├── predictions.route.js
│   │   ├── matches.route.js
│   │   ├── scores.route.js
│   │   ├── stats.route.js
│   │   └── aviator.route.js
│   ├── controllers/
│   │   ├── predictions.controller.js
│   │   ├── matches.controller.js
│   │   ├── scores.controller.js
│   │   ├── stats.controller.js
│   │   └── aviator.controller.js
│   ├── models/
│   │   ├── Match.model.js
│   │   ├── Prediction.model.js
│   │   └── AviatorRound.model.js
│   ├── services/
│   │   ├── footballApi.service.js  # All football-data.org calls
│   │   ├── sportsDb.service.js     # TheSportsDB calls (logos etc.)
│   │   └── prediction.engine.js   # Core scoring logic
│   ├── jobs/
│   │   ├── fetchScores.job.js      # Every 2 min during live matches
│   │   ├── fetchFixtures.job.js    # Daily at midnight WAT
│   │   └── generatePredictions.job.js  # Daily at 6am WAT
│   ├── middleware/
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   ├── redis.js                # Upstash Redis connection
│   │   └── socket.js               # Socket.io setup
│   ├── index.js
│   └── .env                        # NEVER commit this file
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # Auto-deploy on push to main
├── .gitignore                      # Must include .env and node_modules
└── README.md
```

---

## All Pages and What Goes on Each One

### Route Map
| URL | Page | Public? |
|---|---|---|
| `/` | Home / Dashboard | Yes |
| `/predictions` | Predictions feed | Yes |
| `/predictions/:matchId` | Match detail | Yes |
| `/scores` | Live scores | Yes |
| `/stats` | Stats hub | Yes |
| `/aviator` | Aviator analyzer | Yes |
| `/results` | Yesterday's results | Yes |
| `/about` | About the platform | Yes |

---

### Home Page (`/`)
- Top banner: "Today's Top 3 Banker Picks" — the 3 highest confidence predictions of the day
- Live scores widget — shows currently playing matches, updates every 2 minutes
- Quick stats bar: tips published today, 7-day accuracy %, total predictions all-time
- "Banker of the Day" — single highest confidence pick with a written reason
- League shortcut buttons: EPL, UCL, La Liga, Serie A, NPFL — tap to go to filtered predictions
- Recent results strip: last 5 predictions with WIN/LOSS outcome shown
- One native ad below the hero section
- "Share today's banker on WhatsApp" button

### Predictions Page (`/predictions`)
- Filter bar pills: All, EPL, UCL, La Liga, Serie A, Bundesliga, Ligue 1, NPFL, High Confidence (70%+)
- Sort options: by kick-off time, by confidence score, by league
- Date navigator: arrows to view tomorrow's or yesterday's predictions
- Each match card contains:
  - Competition badge and kick-off time in **WAT (West Africa Time)** — never UTC
  - Home team vs Away team with current form summary (e.g. W W D L W)
  - Prediction outcome highlighted: "Arsenal win or draw" with market type label
  - Confidence bar: green if 70%+, amber if 50-70%, red if below 50%
  - "Check odds on Bet9ja →" button (links to Bet9ja, opens in new tab)
  - "Share on WhatsApp" button — pre-formatted message
- Ad slot injected automatically every 3 match cards
- Empty state if no matches today: "No predictions yet for today — check back at 7am WAT"

### Match Detail Page (`/predictions/:matchId`)
- This page is critical for SEO — every match gets a unique URL
- Full match header: both team names, kick-off time in WAT, competition, matchday
- Our prediction shown prominently in a highlighted box with confidence score
- Written reasoning paragraph (2-3 sentences explaining why we predict this)
- Head-to-head table: last 5 meetings between these teams, dates, scores, outcomes
- Form table: last 6 matches for each team (competition, opponent, score, result)
- Key stats comparison: goals scored average, goals conceded average, clean sheet rate, BTTS rate
- "Check odds" links to Bet9ja and Sportybet (affiliate links when we get them)
- Team news section: any known injuries or suspensions from API data
- Ad slots: one between the prediction and H2H section, one at the bottom

### Live Scores Page (`/scores`)
- All currently live matches with real-time score updates (Socket.io, every 2 minutes)
- Each score card shows: teams, current score, match minute (e.g. 67'), status (LIVE / HT / FT)
- Filter by competition
- "Upcoming" section below: next 3 hours of fixtures
- "Completed today" section: all finished scores for the day
- Clicking any match card goes to that match's detail page
- Pull-to-refresh on mobile

### Stats Hub (`/stats`)
- League table for each competition — standings, played, GD, points
- Top scorers list per league
- Team lookup: search any team, see their full season stats
- Head-to-head lookup tool: enter two teams, see full H2H history
- Current form table for any team: last 6 results
- **NPFL section** (Nigerian Professional Football League) — this differentiates us from every foreign competitor
- Ad slots between each major section

### Aviator Analyzer (`/aviator`)
- Clear disclaimer at the top: "Aviator uses a provably fair RNG. No tool can predict its outcomes. This page shows statistical analysis only to help you manage risk."
- Crash history chart: last 100/500/1000 rounds shown as a histogram
- Distribution stats: % of rounds that ended below 1.2x, 1.5x, 2x, 3x, 5x, 10x
- Current streak tracker: how many consecutive rounds went above/below a threshold
- Safe cashout guide: "Based on last 1000 rounds, cashing out at 1.4x wins in 72% of rounds"
- Bankroll management calculator: enter stake amount, target multiplier, see risk rating
- "How Aviator works" explainer section for new users
- Ad slots above the chart and below the calculator

### Results Page (`/results`)
- Yesterday's predictions listed with actual outcomes: WIN ✓ / LOSS ✗ / VOID
- Overall accuracy stats clearly shown: yesterday, last 7 days, last 30 days, all time
- Monthly accuracy calendar view
- "How we calculate accuracy" explanation (transparent methodology)
- This page is the single most important trust-building feature on the platform. Most tip sites hide their losses. We show everything.

---

## The Prediction Engine

This is the brain of the platform. It lives in `server/services/prediction.engine.js` and runs as a scheduled job every day at 6:00am WAT.

### How It Works

For each upcoming match, we pull data from football-data.org and score it using six weighted factors:

| Factor | Weight | Data needed |
|---|---|---|
| Home/away recent form (last 6 matches) | 25% | Each team's last 6 results |
| Head-to-head record (last 5 meetings) | 20% | H2H results and goal counts |
| Goals scored and conceded averages | 20% | Season stats for both teams |
| Current league position gap | 15% | Current standings |
| Injuries and suspensions | 10% | Team news from API |
| Home advantage factor | 10% | Historical home vs away win rates |

The engine evaluates four possible prediction markets for each match:
1. 1X2 (Home Win / Draw / Away Win)
2. Both Teams to Score (Yes / No)
3. Over/Under 2.5 goals
4. Double Chance (1X / X2 / 12)

Whichever market scores highest becomes the prediction. The confidence score is that combined weighted score normalised to a 0-100 percentage.

### What Gets Stored in MongoDB

Each prediction record stores:
- Match ID (from football-data.org)
- Home team and away team
- Competition and kick-off time
- Predicted outcome and market type
- Confidence score (0-100)
- Reasoning text (auto-generated from the factor scores)
- Actual result (filled in after the match ends)
- Whether prediction was correct (filled in after match)

### Caching Strategy

Every API call goes through Redis cache first. If the data is in cache and fresh, return it. If not, call the API and store the result.

| Data type | Cache TTL |
|---|---|
| Today's fixtures | 1 hour |
| Live scores | 2 minutes |
| League tables | 6 hours |
| Team form | 3 hours |
| H2H data | 24 hours |
| Predictions | 1 hour |

This caching strategy means football-data.org's 10 calls/minute limit is never an issue.

---

## Ad System

### Networks
- **Monetag** — add from day 1. Best format: native in-feed ads and push notification ads. Sign up at monetag.com, get the script tag, wire it into the AdSlot component.
- **Adsterra** — add from day 1. Best format: Social Bar. Sign up at adsterra.com.
- **Google AdSense** — apply once we hit 1,000 daily unique visitors. It pays better than both above.

### The AdSlot Component

Build one reusable React component called `AdSlot` that lives in `client/src/components/ads/AdSlot.jsx`. It:
- Accepts a `type` prop (native, banner, sidebar)
- Renders a container div with a small "Sponsored" label above it
- Injects the appropriate ad script on mount
- Handles the case where ad blockers are active (just shows nothing, no error)

### Placement Rules
| Page | Where ads go |
|---|---|
| Home | Below the hero section, bottom of page |
| Predictions | Every 3 match cards |
| Match Detail | Between prediction and H2H, bottom of page |
| Live Scores | Between live and upcoming sections |
| Stats Hub | Between each major stats section |
| Aviator | Above the chart, below the calculator |
| Results | Below the results table |

**Non-negotiable rule:** Never put an ad above the main prediction content. Users come for predictions. Show them the prediction first, ad second. This keeps bounce rate low, which keeps ad RPM high.

---

## Environment Variables

Create a `.env` file inside the `/server` folder. Add `.env` to `.gitignore` immediately — never commit it.

```
# Server config
PORT=5000
NODE_ENV=production

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/betwise

# Upstash Redis
REDIS_URL=rediss://default:yourtoken@yourhost.upstash.io:6380

# football-data.org
FOOTBALL_DATA_API_KEY=your_key_here

# Frontend URL (for CORS whitelist)
CLIENT_URL=https://betwise.ng

# Phase 3 only — leave blank until then
GOOGLE_CLIENT_ID=
JWT_SECRET=
```

Get the football-data.org free API key at: https://www.football-data.org/client/register

---

## API Endpoints to Build

All endpoints are prefixed with `/api`.

### Predictions
```
GET /api/predictions                    Returns today's predictions (all leagues)
GET /api/predictions?league=PL          Filter by league code (PL = Premier League)
GET /api/predictions?date=2025-04-14    Predictions for a specific date
GET /api/predictions/:matchId           Full detail for one match prediction
GET /api/predictions/accuracy           Overall accuracy stats (7d, 30d, all-time)
```

### Matches & Scores
```
GET /api/matches/live                   All currently live matches
GET /api/matches/today                  All of today's fixtures
GET /api/matches/results                Yesterday's results
GET /api/matches/:matchId               Full match data including lineups, events
```

### Stats
```
GET /api/stats/standings/:leagueId      League table for a competition
GET /api/stats/scorers/:leagueId        Top scorers for a competition
GET /api/stats/team/:teamId             Full stats for one team
GET /api/stats/h2h/:team1Id/:team2Id    Head-to-head history between two teams
```

### Aviator
```
GET /api/aviator/history                Last 1000 Aviator round results
GET /api/aviator/stats                  Distribution stats, streak, safe cashout guide
```

---

## Scheduled Jobs

Set up three Bull queue jobs that run automatically:

### Job 1 — fetchFixtures (runs daily at 11:50pm WAT)
- Calls football-data.org to get all fixtures for the next day
- Stores them in MongoDB
- Clears and rebuilds the Redis cache for tomorrow's fixtures

### Job 2 — generatePredictions (runs daily at 6:00am WAT)
- For each fixture stored in MongoDB for today:
  - Fetches form, H2H, and team stats (from cache where available)
  - Runs the prediction engine scoring formula
  - Saves a Prediction record to MongoDB
- After all predictions are generated, updates the predictions Redis cache

### Job 3 — fetchLiveScores (runs every 2 minutes, only between 12pm and 11pm WAT)
- Calls football-data.org for all live match scores
- Updates the live scores cache in Redis
- Emits a `scoreUpdate` Socket.io event to all connected clients
- After each match finishes, compare actual result to prediction and update the prediction record with outcome

---

## Deployment Setup

### Step 1 — Database (MongoDB Atlas)
1. Go to mongodb.com/cloud/atlas and create a free account
2. Create a free M0 cluster (512MB, free forever)
3. Create a database user with username and password
4. Whitelist all IPs: add `0.0.0.0/0` to Network Access
5. Click Connect → get the connection string → paste into `.env` as `MONGODB_URI`

### Step 2 — Redis (Upstash)
1. Go to upstash.com and create a free account
2. Create a new Redis database, select the region closest to Nigeria (Europe/Frankfurt is fine)
3. Copy the REST URL → paste into `.env` as `REDIS_URL`

### Step 3 — Backend (Render.com)
1. Push all code to GitHub
2. Go to render.com, create a free account, connect GitHub
3. Create a new "Web Service" pointing to the `/server` folder
4. Set build command: `npm install`
5. Set start command: `node index.js`
6. Add all environment variables from `.env` in the Render dashboard
7. Note the deployed URL (e.g. `https://betwise-api.onrender.com`) — this goes in the frontend as `VITE_API_URL`

### Step 4 — Frontend (Vercel)
1. Go to vercel.com, connect GitHub
2. Point to the `/client` folder
3. Set environment variable: `VITE_API_URL=https://betwise-api.onrender.com`
4. Set build command: `npm run build`
5. Deploy — Vercel auto-deploys on every push to main branch

### Step 5 — Domain
1. Register `betwise.ng` at whogohost.com or web4africa.ng (approximately ₦5,000/year)
2. In Cloudflare, add the domain and point it to Vercel
3. Enable Cloudflare proxy (orange cloud) for CDN and DDoS protection
4. This is the only real cost of the entire platform at launch

### Step 6 — CI/CD (GitHub Actions)
Create `.github/workflows/deploy.yml` so that every push to the `main` branch automatically triggers a new deployment on both Vercel and Render. This means the founder never has to touch deployment manually.

---

## Phase 1 — Football Predictions MVP
**Timeline: Weeks 1–6**  
**Goal: A live, working platform Nigerian bettors can use daily**

Complete every item before moving to Phase 2.

### Backend (Convex)
- [ ] Initialize Convex in the project
- [ ] Define `convex/schema.ts` for matches, predictions, and aviator rounds
- [ ] Create `convex/football.ts` (Actions) to fetch from football-data.org
- [ ] Create `convex/predictions.ts` (Mutations/Queries) for engine logic
- [ ] Set up `convex/crons.ts` for daily tasks (fixtures, predictions)
- [ ] Implement live score sync logic in Convex
- [ ] Deploy to Convex dashboard

### Frontend (start after backend is deployed and tested)
- [ ] Scaffold React + Vite: `npm create vite@latest client -- --template react`
- [ ] Install all dependencies: TailwindCSS, React Router v6, TanStack Query, Zustand, Socket.io client, Recharts, Axios, dayjs, Vite PWA plugin
- [ ] Create `lib/api.js` — Axios instance with `baseURL` set to `VITE_API_URL` from env
- [ ] Build layout components: Navbar (desktop), BottomNav (mobile — shows on screens below 768px), Footer, Layout wrapper
- [ ] Build `AdSlot.jsx` component early — we want ads working from day one
- [ ] Build Home page with top 3 picks, live score widget, quick stats, league shortcuts, banker of the day
- [ ] Build Predictions page with match cards, filter bar, confidence bars, WhatsApp share button, ad slots every 3 cards
- [ ] Build Match Detail page with H2H, form table, team news, prediction box, reasoning text
- [ ] Build Live Scores page — connect Socket.io, show real-time updates
- [ ] Set up Monetag and Adsterra ad scripts in the `AdSlot` component
- [ ] Make site fully responsive — design for 360px Android screen first, then desktop
- [ ] All times must display in WAT (UTC+1) using dayjs — never show UTC to users
- [ ] Set up TanStack Query with appropriate stale times for each data type
- [ ] Deploy to Vercel
- [ ] Register domain and point to Vercel via Cloudflare

### Phase 1 is done when:
- Predictions load for today's fixtures by 7am WAT every morning
- Live scores update in real time on the scores page
- Every match card has a "Check odds on Bet9ja" link
- WhatsApp share button generates a proper shareable message
- Ads display correctly on the predictions feed
- The site loads in under 3 seconds on a Nigerian 4G connection
- The site works on a real Android phone, not just DevTools simulation

---

## Phase 2 — Stats Hub, Aviator and Results
**Timeline: Weeks 7–10**  
**Goal: Add depth — more features that increase daily session time**

### Backend
- [ ] Build `/api/stats` endpoints: standings, top scorers, team stats, H2H lookup
- [ ] Expand prediction coverage to all major leagues: EPL, UCL, La Liga, Serie A, Bundesliga, Ligue 1
- [ ] Add NPFL coverage — source from available API or manual data for now
- [ ] Build Aviator data storage — create a job that stores round data if available, or seed with historical sample data to show the charts
- [ ] Build `/api/aviator` endpoints: history, distribution stats, streak, safe cashout guide
- [ ] Build `/api/results` endpoint — return yesterday's predictions with actual outcomes
- [ ] Build accuracy tracker — after each match finishes, automatically compare our prediction to the actual result and update the prediction record, then recalculate accuracy stats

### Frontend
- [ ] Build Stats Hub page: league tables, top scorers, team stats, H2H lookup tool, NPFL section
- [ ] Build Aviator Analyzer page: histogram chart (Recharts), distribution stats, streak tracker, safe cashout guide, bankroll calculator
- [ ] Build Results page: yesterday's outcomes with WIN/LOSS badges, accuracy stats, monthly calendar view
- [ ] Add date navigator to Predictions page (navigate to tomorrow or yesterday)
- [ ] Add sort options to Predictions page (by time, by confidence, by league)
- [ ] Wire up ad slots on all new pages

### Phase 2 is done when:
- Stats Hub shows accurate league tables for EPL, UCL, La Liga, Serie A, Bundesliga, Ligue 1, and NPFL
- Aviator page shows crash history chart and safe cashout statistics with clear disclaimer
- Results page shows yesterday's tips with actual outcomes and overall accuracy percentage
- All new pages have ads correctly placed and displaying

---

## Phase 3 — SEO, PWA and Optional Auth
**Timeline: Weeks 11–14**  
**Goal: Get discovered on Google. Make the platform installable on Android.**

### SEO
- [ ] Install `react-helmet-async` — add unique title and meta description to every page
- [ ] Each match detail page gets a unique URL: `/predictions/arsenal-vs-man-city-apr-13-2025`
- [ ] Auto-generate a 150-200 word analysis paragraph for each match using the prediction engine reasoning data
- [ ] Generate `sitemap.xml` that includes all prediction and match detail pages
- [ ] Submit sitemap to Google Search Console
- [ ] Add JSON-LD structured data to match detail pages (sports event schema)
- [ ] Add Open Graph tags to all pages — so WhatsApp and Twitter show a proper preview image and description when users share links
- [ ] Set up canonical URLs to prevent duplicate content
- [ ] Target these Nigerian search terms: "today football predictions Nigeria", "EPL predictions today", "Bet9ja sure odds today", "NPFL predictions", specific match predictions like "Arsenal vs Man City prediction"

### PWA
- [ ] Configure Vite PWA plugin: `manifest.json`, service worker, offline fallback page
- [ ] Create all PWA icon sizes: 72, 96, 128, 144, 152, 192, 384, 512px
- [ ] Add "Install App" banner that appears after a user visits 3 times
- [ ] Cache yesterday's predictions and today's fixtures for offline viewing
- [ ] Test the full install flow on a real Android phone with Chrome

### Optional Auth (add last in this phase)
- [ ] Add Google Sign-In using Firebase Auth or direct Google OAuth
- [ ] Create a User model in MongoDB storing: googleId, displayName, email, savedMatches, notificationToken
- [ ] Build personal prediction tracker: user can log which tips they followed, platform shows their personal win rate
- [ ] Auth must be completely optional — all content remains public. Login only unlocks the tracker
- [ ] Never show a login prompt or nag screen to users who are not logged in

### Phase 3 is done when:
- Google is indexing individual match prediction pages
- Platform is installable as a PWA on Android Chrome
- WhatsApp link previews show the match name and prediction correctly
- Optional Google Sign-In works and stores user data

---

## Phase 4 — More Sports and Revenue Growth
**Timeline: Week 15 onwards (ongoing)**  
**Goal: Expand beyond football. Grow ad revenue.**

### More Sports
- [ ] Add basketball predictions: NBA, EuroLeague — same prediction engine architecture, new data source
- [ ] Add tennis predictions: ATP/WTA major tournaments
- [ ] Add more African football coverage: CAF Champions League, South African PSL
- [ ] Update navigation to include sport switcher: Football, Basketball, Tennis

### Community and Retention Features
- [ ] Accumulator builder: user selects multiple predictions, sees combined odds and potential Naira return
- [ ] Push notification opt-in: browser push API, no login needed, store device token in MongoDB
- [ ] "Tip of the Day" email subscription: user enters email, receives one top pick daily
- [ ] Automated Telegram bot: posts daily predictions to the BetWise NG Telegram channel at 7am WAT

### Revenue Growth
- [ ] Apply for Google AdSense once daily unique visitors pass 1,000
- [ ] Apply for Bet9ja affiliate program — add affiliate tracking to all "Check odds on Bet9ja" links
- [ ] Apply for Sportybet affiliate program — same
- [ ] Test ad placements and formats — A/B test native vs display to find highest RPM
- [ ] Build admin dashboard for the founder: shows daily predictions, accuracy stats, traffic overview, API usage remaining

### Performance
- [ ] Lighthouse performance audit — target 90+ score on mobile
- [ ] Optimise images: use WebP format, lazy load all images below the fold
- [ ] Add proper error boundaries in React so one broken component never crashes the whole page
- [ ] Set up Sentry or similar for error monitoring

---

## Important Rules — Read These Carefully

### Things Antigravity Must Always Do
1. **All times in WAT.** Nigerian users see West Africa Time (UTC+1). Never show UTC or GMT to users. Use dayjs with the Africa/Lagos timezone.
2. **Mobile first.** Design every component for 360px width first. Over 90% of Nigerian internet users are on Android. Test on a real phone, not just Chrome DevTools.
3. **Cache everything.** Every football-data.org API call must check Redis first. Never call the external API directly from a user request — only from background jobs.
4. **Never commit `.env`.** The `.env` file must be in `.gitignore` from the very first commit. Never push API keys to GitHub.
5. **Aviator disclaimer.** The Aviator page must display a clear disclaimer that it provides statistical analysis only — not match predictions. Aviator outcomes cannot be predicted by any tool.
6. **Keep predictions public.** Never put prediction content behind a login prompt. If a user has to log in to see a prediction, we are doing it wrong.
7. **Show ads from day one.** Wire up Monetag and Adsterra in Phase 1. We need ad revenue as soon as possible.
8. **WhatsApp share button on every prediction.** This is our primary organic growth mechanism. Every match card needs one.

### Things Antigravity Should Do
- Use skeleton loaders while data is loading, not spinners — it feels faster
- Add pull-to-refresh on the Live Scores mobile page
- Write clear git commit messages — one feature per commit
- Test WebSocket reconnection — if user's network drops and reconnects, scores must re-sync automatically
- Label every ad slot with "Sponsored" in small text above it — this is required by ad networks and is best practice
- Keep all API response times under 200ms by ensuring Redis cache is always warm
- Use HTTP response compression (gzip) on the Express server

---

## Growth Plan (Founder's Job, Not Antigravity's)

Once the platform is live after Phase 1, the founder will handle all growth activities. This is included so Antigravity understands the full picture.

**Channels to launch on day one of going live:**
- WhatsApp Channel named "BetWise NG Daily Tips" — post top 3 picks every morning at 7am WAT
- Telegram Channel — same content simultaneously
- Twitter/X account @BetWiseNG — post prediction threads on match days, post results in the evening
- TikTok @BetWiseNG — 30-second daily pick videos using screen recordings of the platform

**Daily content routine:**
- 7:00am WAT: Post "Banker of the Day" across all channels with link to full predictions page
- After matches: Post results — wins AND losses. Full transparency builds trust faster than anything else.
- Weekly: Post "Last 7 Days Performance" showing the accuracy percentage

**Why this works:** Most Nigerian betting tip channels hide their bad days. Showing every result — good and bad — is the differentiator. Users will trust BetWise NG precisely because it does not hide failures.

---

## Revenue Projections

| Daily visitors | Daily page views | Monthly ad revenue (NGN) |
|---|---|---|
| 500 | 1,500 | ₦6,750 – ₦13,500 |
| 2,000 | 6,000 | ₦27,000 – ₦54,000 |
| 5,000 | 15,000 | ₦67,500 – ₦135,000 |
| 10,000 | 30,000 | ₦180,000 – ₦360,000 |
| 30,000 | 90,000 | ₦675,000 – ₦1,350,000 |

These figures are based on ₦150–300 CPM from Monetag and Adsterra combined (standard for Nigerian traffic). Once Google AdSense is approved, CPM rises to ₦200–500 for sports content, significantly improving these numbers.

**Infrastructure upgrade triggers:**
- At 2,000 daily users: upgrade Render to $7/month paid plan (always-on server)
- At 2,000 daily users: upgrade Upstash if commands exceed 10k/day (~$3/month)
- At 7 months: upgrade MongoDB Atlas if storage exceeds 512MB (~$9/month)
- At 1,000 daily users: apply for Google AdSense

Total infrastructure cost at 2,000 daily users: approximately **$19/month (~₦28,500)**.  
Ad revenue at 2,000 daily users: approximately **₦27,000–₦54,000/month**.  
The platform pays for itself before it even gets popular.

---

## Free API Capacity Summary

| Service | Free limit | Breaks at | Notes |
|---|---|---|---|
| football-data.org | 10 calls/min | Never — caching decouples users from API calls | Register at football-data.org/client/register |
| TheSportsDB | Unlimited | Never | No API key needed |
| Upstash Redis | 10,000 commands/day | ~2,000 daily users | Upgrade is $0.2 per 100k extra commands |
| MongoDB Atlas | 512MB storage | ~7 months of data | Upgrade is $9/month |
| Render.com | 750 hours/month | 50-100 concurrent users | Upgrade is $7/month for always-on |
| Vercel | Unlimited bandwidth | Never for a React SPA | Free forever |
| Cloudflare | Unlimited | Never | Free forever |

---

## Summary — The One-Paragraph Brief

Build BetWise NG: a free, Nigerian-focused sports betting prediction platform using React + Vite on the frontend and Express.js + Node.js on the backend. Use football-data.org (free) for all football data, MongoDB Atlas (free) for the database, Upstash Redis (free) for caching, Render.com (free) for backend hosting, and Vercel (free) for frontend hosting. The platform has no login requirement and no paywalls — all predictions are public. Revenue comes entirely from Monetag and Adsterra ads injected every 3 prediction cards. Build in four phases: MVP football predictions first, then stats and Aviator, then SEO and PWA, then more sports. The only cost at launch is the domain name (₦5,000/year). Follow the phases in order. Follow the rules. Build something Nigerian bettors will use every single day.

---

*This document was prepared by the founder with full platform planning. All product decisions are final as written. If you have questions about any section, ask the founder before making a different technical decision.*