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

### Build 5 — March (Completed ✅)
**Theme: Decision-Making Engine**

1. **Smart Daily Briefing** ✅
   - Morning page: last night sleep/HRV, today's calendar, planned workout, current form
   - AI one-paragraph recommendation: train as planned / swap / rest
   - ACL exercise swap alerts on leg days when fatigue elevated
   - Goal: open every morning, get a decision in 5 seconds

2. **Real-Time Guardrail System** ✅
   - Background check on every dashboard load
   - Rules: ATL:CTL ratio, HRV 3-day trend, TSB + heavy work combo, sleep streak, knee status before leg day
   - Multi-flag compound warnings with specific action suggestions
   - Feeds into morning briefing and burnout score
   - Not historical pattern matching — current-state danger detection

3. **Race Readiness Tracker** ✅
   - Weekly volume progression toward race (building appropriately?)
   - Long run/ride progression (approaching race distance?)
   - Race-specific fitness (climbing meters for Serra da Estrela, trail elevation)
   - Weight trajectory toward race-day target
   - "Weeks remaining vs fitness gap" calculation
   - Visual readiness dashboard per race

### Build 6 — April (Completed ✅)
**Theme: Proactive AI Coach**

4. **Training Plan Generator** ✅
   - AI-powered plan generation with athlete context and race targets
   - Custom prompts for mesocycles, volume progression, and tapering
   - Saves structured workouts directly to Intervals.icu API
   - Respects work calendar and ACL constraints

5. **Post-Session Auto-Analysis** ✅
   - Real-time workout analysis comparing planned vs actual performance
   - AI-generated insights on pace, heart rate, and TSS achievement
   - Analysis cards appear on dashboard for recent activities
   - Builds automatic training journal with actionable recommendations

6. **Body Composition Forecaster** ✅
   - Weight trend analysis with linear regression forecasting
   - Projects race-day weight and target achievement probability
   - Generates specific caloric recommendations for weight goals
   - Race-specific weight milestones and timeline planning

### Build 7 — April (Completed ✅)
**Theme: Performance Analytics & Mapping**

7. **GPX Course Maps & Elevation Profiles** ✅
   - Interactive Leaflet.js maps with course overlays
   - GPX file upload to Supabase Storage with race-specific organization
   - Elevation profiles with gradient coloring and pacing zone overlays
   - Settings page integration for GPX file management per race

8. **FTP / Power Curve Tracking** ✅
   - Historical FTP progression charts with monthly max power analysis
   - Power duration curves showing best efforts across all time intervals
   - W/kg tracking with weight change correlations
   - Power zone distribution analysis with FTP-based training zones
   - Dedicated Power Analytics page with comprehensive cycling metrics

9. **Running Performance Dashboard** ✅
   - Personal best tracking for 5K, 10K, 15K, 20K, half marathon, and marathon
   - PB progression charts showing improvement over time
   - Running power analysis (Stryd/Apple Watch integration)
   - Running efficiency metrics (power-to-heart rate ratios)
   - Pace:HR decoupling trends for aerobic fitness assessment
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
