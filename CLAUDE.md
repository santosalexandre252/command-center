# Command Center — CLAUDE.md

## Project Overview
AI-powered multi-sport training + work dashboard for Alexandre Santos, a 29-year-old Senior AE at AutoDoc who trains in road running, trail running, cycling, and gym. This app combines training data with work calendar to prevent burnout and optimize race preparation.

## Tech Stack
- **Framework:** Next.js 14 (App Router) with React 18
- **Styling:** Tailwind CSS (dark mode, class-based)
- **Charts:** Recharts
- **Database:** Supabase (PostgreSQL) — schema in `supabase/schema.sql`
- **AI:** Groq API with Llama 3.3 70B (NOT Gemini, NOT OpenAI)
- **Training Data:** Intervals.icu API (activities, wellness, planned workouts, CTL/ATL/TSB)
- **Calendar:** Google Calendar via iCal secret URL
- **Icons:** Lucide React + emoji

## Architecture
- `app/` — Next.js App Router pages
- `app/api/` — Server-side API routes (proxies for Intervals.icu, Groq, Calendar)
- `components/` — Shared React components
- `lib/` — Client helpers: `db.js` (Supabase), `intervals.js` (training API), `calendar.js` (work events), `utils.js`
- API keys are in `.env.local` (never commit). See `.env.example` for names.

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
INTERVALS_API_KEY
INTERVALS_ATHLETE_ID
GROQ_API_KEY
GOOGLE_CALENDAR_ICAL_URL
```

## Athlete Profile
- Name: Alexandre Santos, age 29
- FTP: 181W | Threshold pace: 5:07-5:28/km | Max HR: 188 | Resting HR: 59
- Weight: 76.2kg / 22% body fat → Target: 71kg / 15%
- Right knee ACL surgery ~2 years ago. Left ankle prone to sprains.
- Gym rotation: A (Legs), B (Back+Shoulders), D (Legs same as A), C (Chest+Arms+Core+Prehab)
- ACL-sensitive: Bulgarian split squat → step-ups/reverse lunges on high fatigue. Lever leg extension → terminal knee ext/wall sits.
- Fuelling: Nduranz full product range (creatine, gels, drink mix, electrolytes)

## 2026 Race Calendar
1. Aveiro Half Marathon — 26 Apr, 21.1km, 93m D+, A-race, target CTL 55
2. Trilhos da Nexebra Trail — 10 May, 14km, 470m D+, B-race, target CTL 52
3. Granfondo Serra da Estrela — 28 Jun, 97km cycling, 2700m D+, B-race, target CTL 58
4. Lisbon Half Marathon — 11 Oct, 21.1km, flat, A-race, target CTL 60

## Data Sources & API Patterns

### Intervals.icu (server-side only)
- Auth: Basic auth with `API_KEY:{key}` base64 encoded
- Base URL: `https://intervals.icu/api/v1`
- Athlete endpoint: `/athlete/{ATHLETE_ID}`
- Activities: `/athlete/{id}/activities?oldest=YYYY-MM-DD&newest=YYYY-MM-DD`
- Wellness (CTL/ATL/HRV/weight/sleep): `/athlete/{id}/wellness?oldest=...&newest=...`
- Planned workouts: `/athlete/{id}/events?oldest=...&newest=...`
- CTL/ATL come from wellness endpoint, NOT the athlete profile endpoint
- Strava-sourced activities have no detail (name, distance, TSS are null). HealthSync activities have full data.
- Apple Watch running power (watts) flows to Intervals.icu
- PBs available via Intervals.icu API

### Supabase
- Client in `lib/supabase.js`
- Data functions in `lib/db.js`
- 11 tables: athlete_profile, races, workouts, energy_logs, burnout_scores, body_comp, gym_sessions, supplement_logs, work_events, chat_messages, weekly_summaries

### Groq (AI Coach)
- Model: `llama-3.3-70b-versatile`
- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Auth: Bearer token
- Used for: AI coach chat, race plan generation
- System prompt includes full athlete profile + live Intervals.icu data

### Google Calendar
- Fetched via iCal URL (no OAuth)
- Parsed server-side in `app/api/calendar/route.js`
- Returns events + daily density classification (rest/light/medium/heavy/travel)

## Burnout Score (6 signals)
- Training Load (ATL) — 25%
- Form (TSB) — 15%
- HRV Trend (7-day vs 30-day avg) — 15%
- Sleep Quality — 15%
- Work Stress (calendar meetings + heavy days) — 15%
- Self-Reported Energy (daily check-in) — 15%

## Coding Standards
- All pages are client components ("use client") with hooks for data fetching
- Server-side API routes in `app/api/` for anything needing env vars
- Use existing helper functions in `lib/` — don't create new Supabase clients
- Dark mode only (bg-surface-950, bg-surface-850, text-gray-200, etc.)
- Font: DM Sans (loaded in layout.js)
- Color tokens: brand-500 (blue), burnout-green/amber/red, surface-850/900/950
- All data should have loading states
- Energy logs use 1-5 scale, upsert on date conflict
- Format: metric units (km, kg, watts, bpm)
- No TypeScript — plain JavaScript (.js files)

## Current Pages
| Route | File | Description |
|-------|------|-------------|
| `/dashboard` | `app/dashboard/page.js` | Weekly command center with activities, calendar, check-ins, volume tracking |
| `/load` | `app/load/page.js` | PMC chart, HRV, sleep, resting HR, weight, 6-signal burnout |
| `/races` | `app/races/page.js` | Race hub with countdowns |
| `/race/[id]` | `app/race/[id]/page.js` | Race detail with AI plan generator |
| `/fuelling` | `app/fuelling/page.js` | Session-matched fuelling, supplements, weekly overview |
| `/planner` | `app/planner/page.js` | Monthly calendar with activities + races |
| `/chat` | `app/chat/page.js` | AI coach (Groq/Llama 3.3) |
| `/settings` | `app/settings/page.js` | Connection status, profile editor |

## Build Roadmap (see ROADMAP.md for full detail)

### Build 5 — Current Priority
1. **Smart Daily Briefing** — Morning page: sleep/HRV, calendar, planned workout, AI recommendation
2. **Real-Time Guardrail System** — Multi-signal danger detection with specific action suggestions
3. **Race Readiness Tracker** — Volume progression, long run tracking, weight trajectory per race

### Build 6
4. Training Plan Generator (writes to Intervals.icu)
5. Post-Session Auto-Analysis
6. Body Composition Forecaster

### Build 7
7. GPX Maps & Elevation Profiles (Leaflet.js)
8. FTP/Power Curve Tracking
9. Running PBs + Running Power + Efficiency
10. Training Zone Distribution
11. Workout Compliance Scoring
12. Periodization ATP View
13. Aerobic Decoupling
14. Nutrition Logging

## Testing
- Run `npm run dev` and verify pages load
- Check browser console for errors
- Test API routes with curl: `curl http://localhost:3000/api/intervals?type=profile`
- After changes, run `npm run build` to catch compile errors before committing

## Git Workflow
- Always commit with descriptive messages
- Never commit `.env.local` or `node_modules`
- Push to `main` branch on `github.com/santosalexandre252/command-center`
