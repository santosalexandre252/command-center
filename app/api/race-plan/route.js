import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const INTERVALS_API_KEY = process.env.INTERVALS_API_KEY;
const INTERVALS_ATHLETE_ID = process.env.INTERVALS_ATHLETE_ID;

async function getFitnessData() {
  if (!INTERVALS_API_KEY || !INTERVALS_ATHLETE_ID) return null;
  try {
    const auth = Buffer.from(`API_KEY:${INTERVALS_API_KEY}`).toString("base64");
    const today = new Date().toISOString().split("T")[0];
    const monthAgo = new Date(Date.now() - 60 * 86400000).toISOString().split("T")[0];

    const [wellnessRes, activitiesRes] = await Promise.all([
      fetch(`https://intervals.icu/api/v1/athlete/${INTERVALS_ATHLETE_ID}/wellness?oldest=${monthAgo}&newest=${today}`, {
        headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
      }),
      fetch(`https://intervals.icu/api/v1/athlete/${INTERVALS_ATHLETE_ID}/activities?oldest=${monthAgo}&newest=${today}`, {
        headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
      }),
    ]);

    const wellness = wellnessRes.ok ? await wellnessRes.json() : [];
    const activities = activitiesRes.ok ? await activitiesRes.json() : [];
    const latest = wellness.length > 0 ? wellness[wellness.length - 1] : {};

    const recentRuns = activities
      .filter((a) => a.type === "Run" && a.moving_time && a.distance)
      .map((a) => ({
        date: a.start_date_local?.split("T")[0],
        name: a.name,
        distance_km: (a.distance / 1000).toFixed(1),
        duration_min: Math.round(a.moving_time / 60),
        pace_sec_per_km: a.moving_time / (a.distance / 1000),
        avg_hr: a.average_heartrate,
        tss: a.icu_training_load,
      }))
      .slice(-10);

    const recentRides = activities
      .filter((a) => (a.type === "Ride" || a.type === "VirtualRide") && a.moving_time)
      .map((a) => ({
        date: a.start_date_local?.split("T")[0],
        name: a.name,
        distance_km: a.distance ? (a.distance / 1000).toFixed(1) : null,
        duration_min: Math.round(a.moving_time / 60),
        avg_power: a.icu_weighted_avg_watts,
        normalized_power: a.icu_np,
        avg_hr: a.average_heartrate,
        elevation: a.total_elevation_gain,
        tss: a.icu_training_load,
      }))
      .slice(-10);

    return { ctl: latest.ctl, atl: latest.atl, tsb: latest.ctl && latest.atl ? latest.ctl - latest.atl : null, weight: latest.weight, resting_hr: latest.restingHR, hrv: latest.hrv, recentRuns, recentRides };
  } catch (err) {
    console.error("Error fetching fitness:", err);
    return null;
  }
}

function formatPace(secondsPerKm) {
  const min = Math.floor(secondsPerKm / 60);
  const sec = Math.round(secondsPerKm % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  return h > 0 ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}` : `${m}:${s.toString().padStart(2, "0")}`;
}

// Race time prediction using threshold pace + Riegel formula
function predictRaceTime(race, fitness) {
  // Threshold pace: 5:07 to 5:28 per km = 307 to 328 seconds per km
  const thresholdPaceSlow = 328; // 5:28/km
  const thresholdPaceFast = 307; // 5:07/km
  const thresholdPaceMid = (thresholdPaceSlow + thresholdPaceFast) / 2; // ~5:17/km

  const isRunning = race.type === "road_run" || race.type === "trail";
  const isCycling = race.type === "cycling";

  if (isRunning) {
    // For half marathon: race pace is typically 103-108% of threshold pace
    // For shorter races: closer to threshold
    // Using Riegel-style adjustment from threshold
    const distKm = race.distance;
    let racePaceFactor;
    if (distKm <= 10) racePaceFactor = 1.0;
    else if (distKm <= 15) racePaceFactor = 1.03;
    else if (distKm <= 21.1) racePaceFactor = 1.06;
    else racePaceFactor = 1.12;

    // Adjust for elevation: ~5 sec/km per 100m of elevation per km
    const elevPerKm = race.elevation / distKm;
    const elevAdjust = elevPerKm * 5;

    // Trail factor: technical terrain adds ~10-15%
    const trailFactor = race.type === "trail" ? 1.12 : 1.0;

    const conservativePace = thresholdPaceSlow * racePaceFactor * trailFactor + elevAdjust;
    const targetPace = thresholdPaceMid * racePaceFactor * trailFactor + elevAdjust;
    const optimisticPace = thresholdPaceFast * racePaceFactor * trailFactor + elevAdjust;

    return {
      conservative: { pace: formatPace(conservativePace), total: formatTime(conservativePace * distKm), paceSeconds: conservativePace },
      target: { pace: formatPace(targetPace), total: formatTime(targetPace * distKm), paceSeconds: targetPace },
      optimistic: { pace: formatPace(optimisticPace), total: formatTime(optimisticPace * distKm), paceSeconds: optimisticPace },
    };
  }

  if (isCycling) {
    // FTP-based: for a ~3-4 hour ride, target ~75-85% FTP
    // With 2700m D+, climbing dominates
    const ftp = 181;
    const weight = fitness?.weight || 76.2;
    const wpkg = ftp / weight;

    // Rough estimate: climbing time + flat time
    const climbingMeters = race.elevation;
    const distKm = race.distance;
    // VAM estimate at 80% FTP: ~800-1000 m/h for ~2.4 W/kg
    const vam = wpkg * 350; // rough VAM estimate
    const climbHours = climbingMeters / vam;
    const flatKm = distKm - (climbingMeters / 50); // assume ~50m gain per climbing km
    const flatSpeed = 28; // km/h on flat at tempo
    const flatHours = Math.max(0, flatKm) / flatSpeed;
    const totalHours = climbHours + flatHours;

    return {
      conservative: { total: formatTime(totalHours * 3600 * 1.1) },
      target: { total: formatTime(totalHours * 3600) },
      optimistic: { total: formatTime(totalHours * 3600 * 0.9) },
    };
  }

  return null;
}

export async function POST(request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
  }

  try {
    const { race, planType } = await request.json();
    const fitness = await getFitnessData();
    const prediction = predictRaceTime(race, fitness);

    const isRunning = race.type === "road_run" || race.type === "trail";
    const isCycling = race.type === "cycling";

    const prompt = `You are an expert endurance coach generating a race plan. You MUST use the calculated predictions provided below — do NOT invent your own finish time estimates.

ATHLETE:
- Alexandre Santos, 29 years old, 76.2kg
- LACTATE THRESHOLD PACE: 5:07-5:28/km (this is his THRESHOLD, NOT his easy or race pace)
- FTP: 181W (2.4 W/kg) | Max HR: 188 | Resting HR: 59
- Right knee ACL surgery ~2 years ago
- Uses Nduranz products (gels, drink mix, electrolytes)

CURRENT FITNESS:
- CTL: ${fitness?.ctl ? Math.round(fitness.ctl) : "~37"} | ATL: ${fitness?.atl ? Math.round(fitness.atl) : "~37"} | TSB: ${fitness?.tsb ? Math.round(fitness.tsb) : "~0"}
- Weight: ${fitness?.weight || 76.2}kg | Resting HR: ${fitness?.resting_hr || 59} | HRV: ${fitness?.hrv || "unknown"}

${isRunning && fitness?.recentRuns?.length > 0 ? `RECENT RUNS:
${fitness.recentRuns.map((r) => `- ${r.date}: ${r.name || "Run"} ${r.distance_km}km in ${r.duration_min}min (${formatPace(r.pace_sec_per_km)}/km) HR:${r.avg_hr || "?"}`).join("\n")}` : ""}

${isCycling && fitness?.recentRides?.length > 0 ? `RECENT RIDES:
${fitness.recentRides.map((r) => `- ${r.date}: ${r.name || "Ride"} ${r.distance_km || "?"}km in ${r.duration_min}min NP:${r.normalized_power || "?"}W HR:${r.avg_hr || "?"}`).join("\n")}` : ""}

RACE:
- ${race.name} | ${race.date} | ${race.distance}km | ${race.elevation}m D+
- Type: ${race.type === "road_run" ? "Road (flat)" : race.type === "trail" ? "Trail (technical)" : "Mountain cycling"}
- Priority: ${race.priority}-Race | Location: ${race.location}

CALCULATED PREDICTIONS (use these exact numbers):
${prediction ? `- Conservative: ${prediction.conservative.total}${prediction.conservative.pace ? ` @ ${prediction.conservative.pace}/km` : ""}
- Target: ${prediction.target.total}${prediction.target.pace ? ` @ ${prediction.target.pace}/km` : ""}
- Optimistic: ${prediction.optimistic.total}${prediction.optimistic.pace ? ` @ ${prediction.optimistic.pace}/km` : ""}` : "No prediction available"}

IMPORTANT RULES:
- His threshold is 5:07-5:28/km. Half marathon pace should be SLOWER than threshold (around 5:25-5:50/km depending on fitness).
- DO NOT predict a finish time faster than the "optimistic" calculation above.
- For HR zones: easy Z2 = 130-150, tempo Z3 = 150-165, threshold Z4 = 165-178, VO2max Z5 = 178-188
- Race pace HR for a half marathon should be ~155-170bpm (Z3-low Z4), NOT at threshold HR.

${planType === "pacing" ? `Generate a PACING STRATEGY:
1. Predicted finish time range (use the calculated predictions above)
2. Split pacing every 5km with target pace and HR
3. Where to push and where to hold back based on elevation
4. Negative split recommendation if applicable
5. Warning signs (HR drift beyond 175, pace dropping >15s/km)
6. Last 3km strategy` : ""}

${planType === "fuelling" ? `Generate a RACE-DAY FUELLING TIMELINE using Nduranz products:
1. Night before: dinner composition
2. Race morning: meal timing and content
3. Pre-race (60-30min before): Nrgy Unit Drink details
4. During race: gel schedule every ~30 min with exact km markers
5. Hydration: when and how much at each aid station
6. Post-race: recovery nutrition
Specify exact Nduranz products and quantities.` : ""}

${planType === "full" ? `Generate a COMPLETE RACE PLAN:
1. Predicted finish time (use calculated predictions above)
2. Pacing strategy with 5km splits, pace, and HR targets
3. Fuelling timeline using Nduranz (pre/during/post with exact products)
4. Race week: final week taper guidance
5. Race day schedule from wake-up to finish
6. ACL warm-up: specific knee-friendly dynamic stretches (10 min)
7. Mental checkpoints: what to think about at 5km, 10km, 15km, 19km
8. What to do if things go wrong (too fast start, GI issues, knee pain)` : ""}

Be specific with numbers. Format with clear sections using headers.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq error:", res.status, errText);
      return NextResponse.json({ error: "AI error" }, { status: 502 });
    }

    const data = await res.json();
    const plan = data.choices?.[0]?.message?.content || "Could not generate plan.";

    return NextResponse.json({ plan, prediction, fitness });
  } catch (err) {
    console.error("Race plan error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
