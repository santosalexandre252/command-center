import { NextResponse } from "next/server";

const INTERVALS_API_KEY = process.env.INTERVALS_API_KEY;
const INTERVALS_ATHLETE_ID = process.env.INTERVALS_ATHLETE_ID;

async function intervalsRequest(endpoint) {
  const auth = Buffer.from(`API_KEY:${INTERVALS_API_KEY}`).toString("base64");
  const res = await fetch(`https://intervals.icu/api/v1${endpoint}`, {
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  return res.json();
}

function getDateStr(daysFromNow) {
  const d = new Date(Date.now() + daysFromNow * 86400000);
  return d.toISOString().split("T")[0];
}

export async function POST(request) {
  if (!INTERVALS_API_KEY || !INTERVALS_ATHLETE_ID) {
    return NextResponse.json({ error: "Intervals.icu not configured" }, { status: 500 });
  }

  try {
    const { race } = await request.json();
    const raceDate = race.date;
    const raceType = race.type;
    const raceDist = race.distance;
    const raceElev = race.elevation;
    const targetCTL = race.target_ctl;

    const today = getDateStr(0);
    const twelveWeeksAgo = getDateStr(-84);

    const [wellness, activities] = await Promise.all([
      intervalsRequest(`/athlete/${INTERVALS_ATHLETE_ID}/wellness?oldest=${twelveWeeksAgo}&newest=${today}`),
      intervalsRequest(`/athlete/${INTERVALS_ATHLETE_ID}/activities?oldest=${twelveWeeksAgo}&newest=${today}`),
    ]);

    if (!wellness || !activities) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 502 });
    }

    // Current fitness
    const latestW = wellness.length > 0 ? wellness[wellness.length - 1] : {};
    const ctl = latestW.ctl || 0;
    const atl = latestW.atl || 0;
    const tsb = ctl - atl;
    const weight = wellness.filter(w => w.weight).slice(-1)[0]?.weight || 76.2;

    // Days and weeks to race
    const daysToRace = Math.ceil((new Date(raceDate) - new Date()) / 86400000);
    const weeksToRace = Math.round(daysToRace / 7);

    // ── CTL Progression ──
    // Weekly CTL snapshots (last 12 weeks)
    const ctlByWeek = [];
    for (let i = 11; i >= 0; i--) {
      const weekEnd = getDateStr(-i * 7);
      const entry = wellness.filter(w => w.ctl && w.id <= weekEnd).slice(-1)[0];
      if (entry) ctlByWeek.push({ week: 12 - i, date: weekEnd, ctl: Math.round(entry.ctl * 10) / 10 });
    }

    // CTL gap and required ramp
    const ctlGap = targetCTL - ctl;
    const weeklyRampNeeded = weeksToRace > 0 ? Math.round((ctlGap / weeksToRace) * 10) / 10 : 0;
    const ctlOnTrack = ctl >= targetCTL * 0.8;

    // ── Weekly Volume (TSS) ──
    // Group activities by week
    const weeklyTSS = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(Date.now() - (i * 7 + 6) * 86400000);
      const weekEnd = new Date(Date.now() - i * 7 * 86400000);
      const wsStr = weekStart.toISOString().split("T")[0];
      const weStr = weekEnd.toISOString().split("T")[0];
      const weekActs = activities.filter(a => {
        const d = a.start_date_local?.split("T")[0];
        return d && d >= wsStr && d <= weStr;
      });
      const tss = weekActs.reduce((s, a) => s + (a.icu_training_load || 0), 0);
      const hours = weekActs.reduce((s, a) => s + (a.moving_time || 0), 0) / 3600;
      weeklyTSS.push({ week: 12 - i, tss: Math.round(tss), hours: Math.round(hours * 10) / 10, sessions: weekActs.length });
    }

    // ── Long Session Progression ──
    const isRunRace = raceType === "road_run" || raceType === "trail";
    const isCycling = raceType === "cycling";

    let longSessions = [];
    if (isRunRace) {
      longSessions = activities
        .filter(a => a.type === "Run" && a.distance && a.distance > 5000)
        .map(a => ({
          date: a.start_date_local?.split("T")[0],
          distance: Math.round(a.distance / 100) / 10,
          duration: Math.round((a.moving_time || 0) / 60),
          elevation: a.total_elevation_gain || 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } else if (isCycling) {
      longSessions = activities
        .filter(a => (a.type === "Ride" || a.type === "VirtualRide") && a.moving_time > 1800)
        .map(a => ({
          date: a.start_date_local?.split("T")[0],
          distance: a.distance ? Math.round(a.distance / 100) / 10 : null,
          duration: Math.round((a.moving_time || 0) / 60),
          elevation: a.total_elevation_gain || 0,
          avgPower: a.icu_weighted_avg_watts || null,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    const longestSession = longSessions.length > 0
      ? longSessions.reduce((best, s) => (s.distance || 0) > (best.distance || 0) ? s : best, longSessions[0])
      : null;

    const longestDistPct = longestSession && raceDist > 0
      ? Math.round((longestSession.distance / raceDist) * 100)
      : 0;

    // ── Elevation Accumulation (for trail/cycling) ──
    let totalElevation = 0;
    if (raceType === "trail" || isCycling) {
      totalElevation = activities.reduce((s, a) => s + (a.total_elevation_gain || 0), 0);
    }

    // ── Weight Trajectory ──
    const weightEntries = wellness.filter(w => w.weight).map(w => ({
      date: w.id,
      weight: w.weight,
    }));

    const targetWeight = 71; // from athlete profile
    const weightTrend = weightEntries.length >= 2
      ? {
          start: weightEntries[0].weight,
          current: weightEntries[weightEntries.length - 1].weight,
          change: Math.round((weightEntries[weightEntries.length - 1].weight - weightEntries[0].weight) * 10) / 10,
          weeklyRate: Math.round(((weightEntries[weightEntries.length - 1].weight - weightEntries[0].weight) / 12) * 10) / 10,
          projectedRaceDay: Math.round((weight + (weightEntries[weightEntries.length - 1].weight - weightEntries[0].weight) / 12 * weeksToRace) * 10) / 10,
        }
      : null;

    // ── Overall Readiness Score ──
    const fitnessScore = Math.min(100, Math.round((ctl / targetCTL) * 100));
    const volumeScore = weeklyTSS.length >= 4
      ? Math.min(100, Math.round((weeklyTSS.slice(-4).reduce((s, w) => s + w.tss, 0) / 4 / (targetCTL * 7 * 0.8)) * 100))
      : 50;
    const longRunScore = Math.min(100, longestDistPct);
    const formScore = tsb >= -5 && tsb <= 15 ? 100 : tsb > 15 ? 70 : Math.max(0, 100 + tsb * 5);
    const weightScore = weightTrend ? Math.min(100, Math.round(100 - Math.abs(weight - targetWeight) * 10)) : 50;

    const overallReadiness = Math.round(
      fitnessScore * 0.30 +
      volumeScore * 0.20 +
      longRunScore * 0.25 +
      formScore * 0.10 +
      weightScore * 0.15
    );

    return NextResponse.json({
      daysToRace,
      weeksToRace,
      ctl: Math.round(ctl * 10) / 10,
      atl: Math.round(atl * 10) / 10,
      tsb: Math.round(tsb * 10) / 10,
      targetCTL,
      ctlGap: Math.round(ctlGap * 10) / 10,
      weeklyRampNeeded,
      ctlByWeek,
      weeklyTSS,
      longSessions,
      longestSession,
      longestDistPct,
      totalElevation: Math.round(totalElevation),
      weight,
      weightTrend,
      targetWeight,
      scores: { overall: overallReadiness, fitness: fitnessScore, volume: volumeScore, longRun: longRunScore, form: formScore, weight: weightScore },
    });
  } catch (err) {
    console.error("Race readiness error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
