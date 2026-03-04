import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const INTERVALS_API_KEY = process.env.INTERVALS_API_KEY;
const INTERVALS_ATHLETE_ID = process.env.INTERVALS_ATHLETE_ID;

async function getFitnessContext() {
  if (!INTERVALS_API_KEY || !INTERVALS_ATHLETE_ID) return null;
  try {
    const auth = Buffer.from(`API_KEY:${INTERVALS_API_KEY}`).toString("base64");
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

    const [wellnessRes, activitiesRes] = await Promise.all([
      fetch(`https://intervals.icu/api/v1/athlete/${INTERVALS_ATHLETE_ID}/wellness?oldest=${weekAgo}&newest=${today}`, {
        headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
      }),
      fetch(`https://intervals.icu/api/v1/athlete/${INTERVALS_ATHLETE_ID}/activities?oldest=${weekAgo}&newest=${today}`, {
        headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
      }),
    ]);

    const wellness = wellnessRes.ok ? await wellnessRes.json() : [];
    const activities = activitiesRes.ok ? await activitiesRes.json() : [];

    const latest = wellness.length > 0 ? wellness[wellness.length - 1] : {};
    const recentActivities = activities.map((a) => ({
      date: a.start_date_local?.split("T")[0],
      name: a.name,
      type: a.type,
      duration_min: a.moving_time ? Math.round(a.moving_time / 60) : null,
      distance_km: a.distance ? (a.distance / 1000).toFixed(1) : null,
      tss: a.icu_training_load,
      avg_hr: a.average_heartrate,
      avg_pace: a.icu_average_pace,
    }));

    return {
      ctl: latest.ctl ? Math.round(latest.ctl * 10) / 10 : null,
      atl: latest.atl ? Math.round(latest.atl * 10) / 10 : null,
      tsb: latest.ctl && latest.atl ? Math.round((latest.ctl - latest.atl) * 10) / 10 : null,
      weight: latest.weight,
      resting_hr: latest.restingHR,
      hrv: latest.hrv,
      sleep: latest.sleepTime,
      recentActivities,
    };
  } catch (err) {
    console.error("Error fetching fitness context:", err);
    return null;
  }
}

function buildSystemPrompt(fitnessContext) {
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return `You are the AI training coach for Alexandre Santos. Today is ${today}.

ATHLETE PROFILE:
- Age: 29, born 23 September 1996
- Disciplines: road running, trail running, cycling, gym (4-session A/B/D/C rotation)
- FTP: 181W | Threshold pace: 5:07-5:28/km | Max HR: 188 | Resting HR: 59
- Current weight: 76.2kg, 22% body fat | Target: 71kg, 15% body fat
- Right knee ACL surgery ~2 years ago. Left ankle prone to sprains.
- Works as Senior AE at AutoDoc (remote, markets: PT/ES/UK)
- Uses Nduranz products for fuelling (creatine, gels, drink mix, all supplements)
- Cooks at home, no dietary restrictions

ACL-SENSITIVE EXERCISES:
- Bulgarian split squat: on high-fatigue days → suggest step-ups or reverse lunges
- Lever leg extension: on high-fatigue days → suggest terminal knee extensions or wall sits

GYM ROTATION:
- Session A (Legs): Bulgarian split squat, lever leg extension, Smith full squat, lever kneeling leg curl, lever seated calf raise, seated hip abduction/adduction
- Session B (Back+Shoulders): Seated row, pulldown, seated reversed fly, narrow grip seated row, lever shoulder press, lateral raise, triceps pushdown, assisted pull-ups
- Session D (Legs): Same as A
- Session C (Chest+Arms+Core+Prehab): Lever chest press, incline bench press, seated fly lever, Russian twist, heel touchers, crunch, bird dog, dead bug, pallof press, external shoulder rotation, wrist curl, bicep curl, EZ-bar 21s, hammer curl, reverse curl, shrug, assisted dips

2026 RACE CALENDAR:
1. Aveiro Half Marathon — 26 Apr 2026, 21.1km, 93m D+, A-race, target CTL 55
2. Trilhos da Nexebra Trail — 10 May 2026, 14km, 470m D+, B-race, target CTL 52
3. Granfondo Serra da Estrela — 28 Jun 2026, 97km cycling, 2700m D+, B-race, target CTL 58
4. Lisbon Half Marathon — 11 Oct 2026, 21.1km, ~flat, A-race, target CTL 60

${fitnessContext ? `CURRENT FITNESS DATA (live from Intervals.icu):
- CTL (Fitness): ${fitnessContext.ctl || "unknown"}
- ATL (Fatigue): ${fitnessContext.atl || "unknown"}
- TSB (Form): ${fitnessContext.tsb || "unknown"}
- Weight: ${fitnessContext.weight || "unknown"}kg
- Resting HR: ${fitnessContext.resting_hr || "unknown"}
- HRV: ${fitnessContext.hrv || "unknown"}
- Sleep: ${fitnessContext.sleep || "unknown"} hours

RECENT ACTIVITIES (last 7 days):
${fitnessContext.recentActivities?.map((a) => `- ${a.date}: ${a.name} (${a.type}) ${a.duration_min || "?"}min ${a.distance_km ? a.distance_km + "km" : ""} TSS:${a.tss || "?"} HR:${a.avg_hr || "?"}`).join("\n") || "No recent activities"}` : "Intervals.icu data not available."}

COACHING GUIDELINES:
- Be concise and actionable. Use short paragraphs, not long essays.
- Always consider ACL safety when recommending leg exercises.
- Factor in work stress when recommending training load.
- For fuelling advice, use Nduranz products specifically.
- When suggesting workout modifications, explain WHY.
- Flag burnout risk if TSB is very negative or training load is high combined with work stress.
- For race preparation, reference specific target CTLs.
- Use metric units (km, kg, watts).`;
}

export async function POST(request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "Groq API key not configured. Add GROQ_API_KEY to .env.local" }, { status: 500 });
  }

  try {
    const { messages } = await request.json();
    const fitnessContext = await getFitnessContext();
    const systemPrompt = buildSystemPrompt(fitnessContext);

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-10),
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq API error:", res.status, errText);
      return NextResponse.json({ error: "Groq API error", details: errText }, { status: 502 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply, fitnessContext });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
