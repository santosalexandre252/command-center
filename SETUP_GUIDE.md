# Command Center Setup Guide

This guide will help you get the Command Center running locally.

## Prerequisites

- Node.js 18+ and npm
- A Supabase account with a PostgreSQL database
- Intervals.icu API key and athlete ID  
- Groq API key (for Llama 3.3 AI coach)
- Google Calendar iCal URL

## Step 1: Install Dependencies

```bash
npm install
```

**Note:** If you want interactive race course maps (Build 7), also install mapping dependencies:

```bash
npm install leaflet react-leaflet leaflet-gpx
```

## Step 2: Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### Getting Each API Key

#### Supabase
1. Go to [supabase.com](https://supabase.com) and create a project
2. In Project Settings > API Keys, copy:
   - `NEXT_PUBLIC_SUPABASE_URL` - Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon Key (public)

#### Intervals.icu
1. Go to [intervals.icu](https://intervals.icu)
2. Log in to your account
3. Go to Settings > API and generate an API key
4. Get your ATHLETE_ID from your profile URL (e.g., `https://intervals.icu/athlete/12345` → `12345`)

#### Groq API
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up and create a new API key
3. Copy the API key to `GROQ_API_KEY`

#### Google Calendar iCal URL
1. Open Google Calendar settings
2. Find your Calendar in the left sidebar
3. Click the three dots > Settings
4. Scroll to "Integrate calendar"
5. Copy the "Secret address in iCal format" link
6. Paste the full URL into `GOOGLE_CALENDAR_ICAL_URL`

## Step 3: Set Up Supabase Database

The app needs a PostgreSQL database with specific tables. This is defined in `supabase/schema.sql`.

To set up:

1. Go to your Supabase project dashboard
2. Open the SQL editor
3. Create the tables from the schema (see CLAUDE.md for schema details or check `supabase/schema.sql`)

Alternatively, use the Supabase CLI:

```bash
supabase migration up
```

## Step 4: Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### App crashes on load
- Check browser console (F12) for error messages
- Verify all `.env.local` variables are set correctly
- Make sure Supabase tables exist and have the correct schema

### API calls failing
- Check if all API keys are correct and not expired
- Verify the Intervals.icu athlete ID matches your account
- For Google Calendar, ensure the iCal URL is the "secret" URL (not the regular public sharing link)

### Data not loading
- Check if Intervals.icu has recent activities/wellness data
- Verify Google Calendar events are in the correct time range
- Check browser Network tab for API error responses

## Project Structure

- `app/` - Next.js pages and API routes
- `app/page.js` - Home (redirects to /dashboard)
- `app/dashboard/` - Weekly training & work dashboard
- `app/load/` - Performance Management Chart (PMC) and burnout analysis
- `app/briefing/` - Morning AI-powered briefing
- `app/races/` - Race planning hub
- `app/chat/` - AI training coach (Groq/Llama)
- `app/api/` - Server-side API proxies
- `components/` - Shared React components
- `lib/` - Utility functions and API helpers

## Features

- **Real-time Training Data** - Synced from Intervals.icu (CTL, ATL, HRV, sleep, weight)
- **Work Calendar Integration** - Google Calendar to track work stress
- **Burnout Detection** - 6-signal composite score (training load, form, HRV, sleep, work, energy)
- **AI Training Coach** - Groq Llama 3.3 70B for personalized recommendations
- **Race Planning** - Countdown and readiness tracking for 2026 races
- **Daily Check-In** - Log energy, sleep quality, mood, soreness, knee status
- **Dark Mode UI** - Optimized for evening training analysis

## Support

For issues or questions, check:
- `CLAUDE.md` - Full project documentation
- `ROADMAP.md` - Planned features
- Browser console for error messages
- Supabase/API response logs
