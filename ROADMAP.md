# Command Center — Build Roadmap

## Completed ✅

### Build 1 — Foundation (4 Mar 2026)
- ✅ Next.js project with 8 pages scaffolded
- ✅ Dark mode, DM Sans typography, pilot cockpit aesthetic
- ✅ Sidebar navigation
- ✅ Mock data for all pages

### Build 2 — Data Layer (4 Mar 2026)
- ✅ Supabase database (11 tables, athlete profile + 4 races seeded)
- ✅ Intervals.icu API integration (activities, CTL/ATL/TSB, wellness)
- ✅ All historical data fetching (383+ days)

### Build 3 — Intelligence (4 Mar 2026)
- ✅ AI Coach (Groq/Llama 3.3 70B) with full athlete context
- ✅ Race predictor with realistic pacing formulas (Riegel-based)
- ✅ AI race plans: full plan, pacing strategy, fuelling timeline
- ✅ Nduranz-specific fuelling recommendations

### Build 4 — Integration & Tracking (4-5 Mar 2026)
- ✅ Google Calendar integration (iCal feed)
- ✅ Work events in dashboard with density classification
- ✅ Daily check-in modal (energy, sleep, mood, soreness, knee status)
- ✅ Energy logging persisted to Supabase
- ✅ Supplement checklist with persistence
- ✅ Dynamic fuelling page (auto-matched to daily session)
- ✅ Monthly planner with real activities + race dates
- ✅ Load Monitor: PMC chart, HRV bars, sleep bars, resting HR, weight trend
- ✅ 6-signal burnout score (training + TSB + HRV + sleep + work + energy)
- ✅ Weekly volume actual vs planned (TSS + duration)
- ✅ Volume breakdown by discipline
- ✅ HealthSync fix for Intervals.icu (bypass Strava API block)

---

## Upcoming Builds

### Build 5 — March (Next Session)
**Theme: Decision-Making Engine**

1. **Smart Daily Briefing**
   - Morning page: last night sleep/HRV, today's calendar, planned workout, current form
   - AI one-paragraph recommendation: train as planned / swap / rest
   - ACL exercise swap alerts on leg days when fatigue elevated
   - Goal: open every morning, get a decision in 5 seconds

2. **Real-Time Guardrail System**
   - Background check on every dashboard load
   - Rules: ATL:CTL ratio, HRV 3-day trend, TSB + heavy work combo, sleep streak, knee status before leg day
   - Multi-flag compound warnings with specific action suggestions
   - Feeds into morning briefing and burnout score
   - Not historical pattern matching — current-state danger detection

3. **Race Readiness Tracker**
   - Weekly volume progression toward race (building appropriately?)
   - Long run/ride progression (approaching race distance?)
   - Race-specific fitness (climbing meters for Serra da Estrela, trail elevation)
   - Weight trajectory toward race-day target
   - "Weeks remaining vs fitness gap" calculation
   - Visual readiness dashboard per race

### Build 6
**Theme: Proactive AI Coach**

4. **Training Plan Generator**
   - Tell AI "build next 4 weeks for Aveiro HM"
   - Generates mesocycle: volume progression, taper, long run placement, gym scheduling
   - Respects work calendar (reduces volume on travel/heavy weeks)
   - Knows CTL target, ACL constraints, gym A/B/D/C rotation
   - Writes planned workouts to Intervals.icu API

5. **Post-Session Auto-Analysis**
   - Auto-triggers when new activity syncs
   - Compares planned vs actual (pace/power vs targets)
   - HR response analysis (cardiac drift, decoupling)
   - TSS appropriateness for training block position
   - Saves analysis to Supabase → appears as card on dashboard
   - Builds automatic training journal over time

6. **Body Composition Forecaster**
   - Weight + body fat trend plots with projection
   - Current rate of loss calculation
   - Projected date to hit 71kg target
   - Too-fast / too-slow flags (muscle preservation vs race weight deadlines)
   - Race-weight milestones: "74kg for Aveiro, 71kg by Lisbon"
   - Integrates with fuelling: adjusts carb recs if in deficit on hard days

### Build 7
**Theme: Performance Analytics & Mapping**

7. **GPX Course Maps & Elevation Profiles**
   - Upload GPX per race, stored in Supabase Storage
   - Leaflet.js interactive map with course overlay
   - Elevation profile chart with gradient coloring
   - Pacing zones overlaid on elevation (where to push, where to hold)
   - Aid station markers (manual input)

8. **FTP / Power Curve Tracking**
   - Historical FTP progression chart
   - Power duration curve (best efforts across all durations)
   - W/kg tracking alongside weight changes
   - Power zone distribution per ride
   - FTP test detection and auto-updating

9. **Running Performance Dashboard**
   - Personal bests: 5k, 10k, 15k, 20k, half marathon
   - PB progression charts over time (pulled from Intervals.icu best efforts)
   - Running power (watts) — requires Stryd or Apple Watch running power
   - Running efficiency: power-to-pace ratio at given HR
   - Pace:HR decoupling trends (aerobic fitness indicator)
   - Estimated race times from recent efforts (Riegel/Cameron models)

---

## Backlog
- [ ] Vercel deployment fix (Supabase env var issue)
- [ ] Mobile responsive design
- [ ] Morning notification system (email or push)
- [ ] Data export/backup
- [ ] Cycling-specific: power zone time-in-zone charts
- [ ] Multi-sport weekly periodization view
- [ ] A/B gym session logging with weight tracking
- [ ] Injury log with timeline
- [ ] Sleep staging analysis (if Apple Health provides deep/REM/light)

---

## Connections Status
| Service | Status | Method |
|---------|--------|--------|
| Supabase | ✅ Connected | Direct API |
| Intervals.icu | ✅ Connected | API Key |
| Apple Watch | ✅ Via HealthSync → Intervals.icu | HealthSync app |
| Google Calendar | ✅ Connected | iCal secret URL |
| Groq (Llama 3.3) | ✅ Connected | API Key |
| Smart Scale | ✅ Via Intervals.icu | Auto-sync |
| Strava | ⚠️ Bypassed | Data flows via HealthSync instead |
| Gemini | ❌ Rate limited | Replaced by Groq |

---

*Last updated: 5 March 2026*
