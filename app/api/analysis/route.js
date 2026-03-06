import { NextResponse } from "next/server";
import { getIntervalsActivities, getIntervalsPlannedWorkouts } from "../../../lib/intervals";
import { getAthleteProfile } from "../../../lib/db";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

function calculateTSS(actual, planned) {
  // Simplified TSS calculation
  if (!actual || !actual.moving_time) return { actual: 0, planned: planned?.icu_training_load || 0 };

  const durationHours = actual.moving_time / 3600;
  const intensity = actual.icu_training_load ? actual.icu_training_load / durationHours : 1;

  // Use Intervals.icu TSS if available, otherwise estimate
  const actualTSS = actual.icu_training_load || Math.round(durationHours * intensity * 100);

  return {
    actual: actualTSS,
    planned: planned?.icu_training_load || 0,
    duration: actual.moving_time,
    plannedDuration: planned?.moving_time || 0,
  };
}

function analyzePace(actual, planned) {
  if (!actual || !actual.distance || !actual.moving_time) return null;

  const actualPace = actual.moving_time / (actual.distance / 1000); // seconds per km
  const plannedPace = planned?.moving_time && planned?.distance ?
    planned.moving_time / (planned.distance / 1000) : null;

  if (!plannedPace) return { actualPace, note: "No pace target set" };

  const paceDiff = ((actualPace - plannedPace) / plannedPace) * 100;

  return {
    actualPace,
    plannedPace,
    difference: paceDiff,
    note: Math.abs(paceDiff) < 5 ? "On pace" :
          paceDiff > 0 ? `Slower by ${Math.round(paceDiff)}%` :
          `Faster by ${Math.round(Math.abs(paceDiff))}%`
  };
}

function analyzeHeartRate(actual) {
  if (!actual || !actual.average_heartrate) return null;

  const avgHR = actual.average_heartrate;
  const maxHR = 188; // athlete's max HR
  const thresholdHR = 165; // approximate threshold

  const hrZone = avgHR < 130 ? "Z1-Z2" :
                 avgHR < 150 ? "Z2" :
                 avgHR < 165 ? "Z3" :
                 avgHR < 178 ? "Z4" : "Z5";

  return {
    average: avgHR,
    zone: hrZone,
    percentage: Math.round((avgHR / maxHR) * 100),
    note: hrZone === "Z2" ? "Good aerobic effort" :
          hrZone === "Z3" ? "Tempo/threshold work" :
          hrZone === "Z4" ? "High intensity" :
          hrZone === "Z5" ? "Maximal effort" : "Recovery pace"
  };
}

export async function POST(request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
  }

  try {
    const { activityId } = await request.json();

    if (!activityId) {
      return NextResponse.json({ error: "Activity ID required" }, { status: 400 });
    }

    // Get the specific activity
    const activities = await getIntervalsActivities();
    const activity = activities?.find(a => a.id === activityId);

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    // Find planned workout for the same date
    const plannedWorkouts = await getIntervalsPlannedWorkouts();
    const activityDate = activity.start_date_local?.split("T")[0];
    const planned = plannedWorkouts?.find(p =>
      p.start_date_local?.split("T")[0] === activityDate &&
      p.name?.toLowerCase().includes(activity.type?.toLowerCase())
    );

    // Get athlete profile for context
    const athlete = await getAthleteProfile();

    // Perform analysis
    const tss = calculateTSS(activity, planned);
    const pace = analyzePace(activity, planned);
    const hr = analyzeHeartRate(activity);

    // Generate AI analysis
    const prompt = `You are Alexandre Santos's AI training coach. Analyze this completed workout and provide a brief, actionable summary.

WORKOUT COMPLETED:
- Date: ${activity.start_date_local?.split("T")[0]}
- Name: ${activity.name}
- Type: ${activity.type}
- Duration: ${Math.round(activity.moving_time / 60)} minutes
- Distance: ${activity.distance ? (activity.distance / 1000).toFixed(1) + "km" : "N/A"}
- TSS: ${tss.actual} (planned: ${tss.planned})
- Average HR: ${activity.average_heartrate || "N/A"} bpm
- Average Power: ${activity.icu_weighted_avg_watts ? Math.round(activity.icu_weighted_avg_watts) + "W" : "N/A"}

PLANNED WORKOUT:
${planned ? `- Name: ${planned.name}
- Duration: ${Math.round(planned.moving_time / 60)} minutes
- TSS: ${planned.icu_training_load || "N/A"}` : "No matching planned workout found"}

ANALYSIS DATA:
- TSS Achievement: ${tss.planned > 0 ? Math.round((tss.actual / tss.planned) * 100) + "%" : "N/A"}
- Pace Analysis: ${pace?.note || "N/A"}
- HR Zone: ${hr?.zone || "N/A"} (${hr?.note || ""})

ATHLETE CONTEXT:
- Current fitness: CTL ~${athlete?.ctl || 40}, ATL ~${athlete?.atl || 35}
- Threshold pace: 5:07-5:28/km
- FTP: 181W
- Right knee ACL surgery history

INSTRUCTIONS:
1. Provide a 2-3 sentence summary of how the workout went
2. Highlight what went well and any areas for improvement
3. Give one specific recommendation for the next similar session
4. Keep it encouraging and actionable

Analysis:`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 512,
      }),
    });

    if (!res.ok) {
      throw new Error("Groq API error");
    }

    const data = await res.json();
    const aiAnalysis = data.choices?.[0]?.message?.content || "Analysis unavailable";

    const analysis = {
      activityId: activity.id,
      activityName: activity.name,
      date: activity.start_date_local?.split("T")[0],
      type: activity.type,
      metrics: {
        tss,
        pace,
        heartRate: hr,
        duration: activity.moving_time,
        distance: activity.distance,
      },
      planned: planned ? {
        name: planned.name,
        tss: planned.icu_training_load,
        duration: planned.moving_time,
      } : null,
      aiAnalysis,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ analysis });

  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json({ error: "Failed to analyze workout" }, { status: 500 });
  }
}