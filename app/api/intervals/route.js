import { NextResponse } from "next/server";

const API_KEY = process.env.INTERVALS_API_KEY;
const ATHLETE_ID = process.env.INTERVALS_ATHLETE_ID;
const BASE_URL = "https://intervals.icu/api/v1";

async function intervalsRequest(endpoint) {
  const auth = Buffer.from(`API_KEY:${API_KEY}`).toString("base64");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
    next: { revalidate: 300 }, // cache for 5 minutes
  });
  if (!res.ok) {
    console.error(`Intervals.icu error: ${res.status} ${res.statusText} for ${endpoint}`);
    return null;
  }
  return res.json();
}

export async function GET(request) {
  if (!API_KEY || !ATHLETE_ID) {
    return NextResponse.json({ error: "Intervals.icu credentials not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "profile";

  try {
    switch (type) {
      case "profile": {
        // Get athlete settings + latest wellness for CTL/ATL
        const [athleteData, wellnessData] = await Promise.all([
          intervalsRequest(`/athlete/${ATHLETE_ID}`),
          intervalsRequest(`/athlete/${ATHLETE_ID}/wellness?oldest=${getDateDaysAgo(1)}&newest=${getToday()}`),
        ]);
        if (!athleteData) return NextResponse.json({ error: "Failed to fetch profile" }, { status: 502 });
        const latest = wellnessData && wellnessData.length > 0 ? wellnessData[wellnessData.length - 1] : {};
        return NextResponse.json({
          ctl: latest.ctl || null,
          atl: latest.atl || null,
          tsb: (latest.ctl && latest.atl) ? latest.ctl - latest.atl : null,
          ftp: athleteData.ftp || athleteData.icu_ftp || null,
          lthr: athleteData.lthr || null,
          resting_hr: athleteData.icu_resting_hr || null,
          max_hr: athleteData.max_hr || null,
          weight: latest.weight || athleteData.icu_weight || null,
        });
      }

      case "activities": {
        // Get recent activities
        const oldest = searchParams.get("oldest") || getDateDaysAgo(30);
        const newest = searchParams.get("newest") || getToday();
        const data = await intervalsRequest(
          `/athlete/${ATHLETE_ID}/activities?oldest=${oldest}&newest=${newest}`
        );
        if (!data) return NextResponse.json({ error: "Failed to fetch activities" }, { status: 502 });
        // Return simplified activity data
        const activities = data.map((a) => ({
          id: a.id,
          date: a.start_date_local?.split("T")[0],
          name: a.name,
          type: a.type,
          moving_time: a.moving_time,
          distance: a.distance ? (a.distance / 1000).toFixed(2) : null,
          tss: a.icu_training_load,
          avg_hr: a.average_heartrate,
          max_hr: a.max_heartrate,
          avg_power: a.icu_weighted_avg_watts,
          normalized_power: a.icu_np,
          avg_pace: a.icu_average_pace,
          elevation_gain: a.total_elevation_gain,
          calories: a.calories,
          ctl_before: a.icu_ctl,
          atl_before: a.icu_atl,
          completed: true,
          source: "intervals",
        }));
        return NextResponse.json(activities);
      }

      case "wellness": {
        // Get wellness data (weight, HRV, sleep, etc.)
        const wOldest = searchParams.get("oldest") || getDateDaysAgo(30);
        const wNewest = searchParams.get("newest") || getToday();
        const data = await intervalsRequest(
          `/athlete/${ATHLETE_ID}/wellness?oldest=${wOldest}&newest=${wNewest}`
        );
        if (!data) return NextResponse.json({ error: "Failed to fetch wellness" }, { status: 502 });
        const wellness = data.map((w) => ({
          date: w.id,
          weight: w.weight,
          resting_hr: w.restingHR,
          hrv: w.hrv,
          sleep_duration: w.sleepTime,
          sleep_quality: w.sleepQuality,
          soreness: w.soreness,
          fatigue: w.fatigue,
          mood: w.mood,
          ctl: w.ctl,
          atl: w.atl,
          body_fat: w.bodyFat,
        }));
        return NextResponse.json(wellness);
      }

      case "events": {
        // Get planned workouts/events
        const eOldest = searchParams.get("oldest") || getToday();
        const eNewest = searchParams.get("newest") || getDateDaysAhead(14);
        const data = await intervalsRequest(
          `/athlete/${ATHLETE_ID}/events?oldest=${eOldest}&newest=${eNewest}`
        );
        if (!data) return NextResponse.json({ error: "Failed to fetch events" }, { status: 502 });
        const events = data.map((e) => ({
          id: e.id,
          date: e.start_date_local?.split("T")[0],
          name: e.name || e.category,
          category: e.category,
          description: e.description,
          duration: e.moving_time,
          load_target: e.icu_training_load,
          type: e.type,
        }));
        return NextResponse.json(events);
      }

      default:
        return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }
  } catch (err) {
    console.error("Intervals API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function getDateDaysAhead(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
