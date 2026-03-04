# ⚡ Command Center — Alexandre Santos

AI-powered training & work dashboard. Multi-sport (road running, trail, cycling, gym) with burnout prevention, race planning, and nutrition management.

## Pages

| Page | Route | Status |
|------|-------|--------|
| Dashboard | `/dashboard` | ✅ Mock data |
| Load Monitor | `/load` | ✅ Mock data |
| Race Hub | `/races` | ✅ Mock data |
| Race Detail | `/race/[id]` | ✅ Mock data |
| Fuelling | `/fuelling` | ✅ Mock data |
| Monthly Planner | `/planner` | ✅ Mock data |
| AI Coach Chat | `/chat` | ✅ UI ready |
| Settings | `/settings` | ✅ UI ready |

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Charts:** Recharts (ready to use)
- **Database:** Supabase (Postgres + Auth + Realtime)
- **AI:** Google Gemini (fast daily) + Claude (deep analysis)
- **Data:** Intervals.icu API + Strava API + Apple Watch + Smart Scale

---

## 🚀 Setup Guide (Step by Step)

### Step 1 — Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `command-center`
3. Make it **Private**
4. Do NOT add README, .gitignore, or license (we already have them)
5. Click **Create repository**
6. Keep this page open — you'll need the URL in Step 3

### Step 2 — Open in GitHub Codespaces

1. On your new repo page, click the green **Code** button
2. Click the **Codespaces** tab
3. Click **Create codespace on main**
4. Wait for it to load (~1 minute)

### Step 3 — Upload the Project Files

Once your Codespace is open (it looks like VS Code in the browser):

1. Open the **Terminal** at the bottom (if not visible: menu → Terminal → New Terminal)
2. Download the project zip I'll provide and extract it, OR:
3. Drag and drop the `command-center` folder contents into the Codespace file explorer on the left

### Step 4 — Install Dependencies

In the Codespace terminal, run:

```bash
npm install
```

This installs Next.js, React, Tailwind, Supabase client, Recharts, and Lucide icons.

### Step 5 — Set Up Environment Variables

1. In the Codespace, create a new file called `.env.local` in the root folder
2. Add your keys (use the NEW regenerated keys, not the ones from chat):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
INTERVALS_API_KEY=your_new_intervals_api_key
INTERVALS_ATHLETE_ID=your_athlete_id
GEMINI_API_KEY=your_new_gemini_api_key
```

**To find your Supabase URL and anon key:**
- Go to [supabase.com](https://supabase.com) → your project → Settings → API
- Copy the "Project URL" and "anon public" key

**To find your Intervals.icu athlete ID:**
- Go to [intervals.icu](https://intervals.icu) → click your name top-right → Settings → Developer
- Your athlete ID is in the URL: `intervals.icu/athlete/i12345` → the ID is `i12345`

### Step 6 — Run the App

```bash
npm run dev
```

The terminal will show a URL like `https://xxxxx-3000.app.github.dev`. Click it to open your dashboard!

### Step 7 — Push to GitHub

```bash
git add .
git commit -m "Phase 1: scaffold with mock data"
git push
```

---

## 📁 Project Structure

```
command-center/
├── app/
│   ├── layout.js          # Root layout with sidebar
│   ├── page.js             # Redirect → /dashboard
│   ├── globals.css          # Tailwind + custom styles
│   ├── dashboard/page.js   # Weekly command center
│   ├── load/page.js        # Burnout prevention
│   ├── races/page.js       # Race hub
│   ├── race/[id]/page.js   # Individual race detail
│   ├── fuelling/page.js    # Nutrition & supplements
│   ├── planner/page.js     # Monthly calendar
│   ├── chat/page.js        # AI coach interface
│   └── settings/page.js    # Connections & profile
├── components/
│   └── layout/Sidebar.jsx  # Navigation sidebar
├── lib/
│   ├── mockData.js         # All mock data (your profile, races, etc.)
│   ├── supabase.js         # Supabase client
│   └── utils.js            # Helper functions
├── .env.example             # Template for environment variables
├── .gitignore               # Keeps secrets out of GitHub
├── tailwind.config.js       # Theme colors, dark mode
├── next.config.js
├── postcss.config.js
└── package.json
```

---

## What's Next (Phase 2)

- [ ] Connect Intervals.icu API for real training data
- [ ] Supabase schema for energy logs, burnout scores
- [ ] Wire Gemini API for AI coach responses
- [ ] Real PMC chart with Recharts
- [ ] GPX file parsing for race course maps
- [ ] Google Calendar integration (pending IT approval)
