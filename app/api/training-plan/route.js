import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const INTERVALS_API_KEY = process.env.INTERVALS_API_KEY;
const INTERVALS_ATHLETE_ID = process.env.INTERVALS_ATHLETE_ID;

async function intervalsRequest(endpoint, method = "GET", body = null) {
  if (!INTERVALS_API_KEY || !INTERVALS_ATHLETE_ID) return null;
  const auth = Buffer.from(`API_KEY:${INTERVALS_API_KEY}`).toString("base64");
  try {
    const res = await fetch(`https://intervals.icu/api/v1${endpoint}`, {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: body ? JSON.stringify(body) : null,
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

function getNextMonday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  return nextMonday.toISOString().split("T")[0];
}

function parsePlanIntoWorkouts(planText, startDate) {
  // This is a simplified parser - in reality, you'd need more sophisticated parsing
  // For now, return a basic structure that can be expanded
  const workouts = [];
  const lines = planText.split("\n");

  let currentWeek = 0;
  let currentDay = 0;

  for (const line of lines) {
    // Look for patterns like "Week 1, Day 1: Easy run 45min"
    const weekMatch = line.match(/Week (\d+).*Day (\d+).*:\s*(.+)/i);
    if (weekMatch) {
      currentWeek = parseInt(weekMatch[1]);
      currentDay = parseInt(weekMatch[2]);
      const description = weekMatch[3];

      // Calculate date
      const workoutDate = new Date(startDate);
      workoutDate.setDate(workoutDate.getDate() + (currentWeek - 1) * 7 + (currentDay - 1));

      // Parse workout type and duration
      let workoutType = "Run";
      let duration = 45; // default
      let name = description;

      if (description.toLowerCase().includes("rest")) {
        continue; // Skip rest days
      }

      if (description.toLowerCase().includes("ride") || description.toLowerCase().includes("bike")) {
        workoutType = "Ride";
      } else if (description.toLowerCase().includes("gym") || description.toLowerCase().includes("weight")) {
        workoutType = "WeightTraining";
      }

      const durationMatch = description.match(/(\d+)\s*min/i);
      if (durationMatch) {
        duration = parseInt(durationMatch[1]);
      }

      workouts.push({
        start_date_local: workoutDate.toISOString().split("T")[0],
        name: name,
        type: workoutType,
        moving_time: duration * 60, // convert to seconds
        description: description,
      });
    }
  }

  return workouts;
}

export async function POST(request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
  }

  try {
    const { planTemplate, customPrompt, athlete, fitness, races } = await request.json();

    const startDate = getNextMonday();
    const endDate = new Date(startDate);
    if (planTemplate.duration.includes("8-12")) {
      endDate.setDate(endDate.getDate() + 77); // ~11 weeks
    } else if (planTemplate.duration.includes("6-8")) {
      endDate.setDate(endDate.getDate() + 49); // ~7 weeks
    } else if (planTemplate.duration.includes("2-4")) {
      endDate.setDate(endDate.getDate() + 21); // ~3 weeks
    } else {
      endDate.setDate(endDate.getDate() + 35); // ~5 weeks
    }

    const prompt = `You are an expert endurance coach creating a detailed training plan for Alexandre Santos.

ATHLETE PROFILE:
- Age: 29, Male
- Current fitness: CTL ${Math.round(fitness?.ctl || 0)}, ATL ${Math.round(fitness?.atl || 0)}, TSB ${Math.round((fitness?.ctl || 0) - (fitness?.atl || 0))}
- Weight: ${athlete?.weight || 76.2}kg
- Threshold pace: 5:07-5:28/km
- FTP: 181W (${Math.round(181 / (athlete?.weight || 76.2) * 10) / 10} W/kg)
- Right knee ACL surgery ~2 years ago
- Gym rotation: A (Legs), B (Back+Shoulders), D (Legs), C (Chest+Arms+Core)
- ACL constraints: Bulgarian split squat → step-ups/reverse lunges, Lever leg ext → terminal knee ext/wall sits

PLAN REQUEST:
- Type: ${planTemplate.title} (${planTemplate.description})
- Duration: ${planTemplate.duration}
- Target: ${planTemplate.target}
- Start date: ${startDate}
- Custom instructions: ${customPrompt || "None"}

UPCOMING RACES:
${races?.map(r => `- ${r.name}: ${r.date} (${r.distance}km ${r.type})`).join("\n") || "None scheduled"}

INSTRUCTIONS:
1. Create a detailed week-by-week training plan
2. Include specific workouts with duration, intensity, and type
3. Respect ACL constraints on leg days
4. Account for current fitness level and progressive overload
5. Include rest days and recovery
6. Format as: "Week X, Day Y: [Workout description]"
7. Make it realistic and achievable
8. End with a summary of the plan's goals and key principles

Generate the complete training plan:`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      throw new Error("Groq API error");
    }

    const data = await res.json();
    const planContent = data.choices?.[0]?.message?.content || "Failed to generate plan";

    // Parse the plan into structured workouts
    const workouts = parsePlanIntoWorkouts(planContent, startDate);

    return NextResponse.json({
      plan: {
        content: planContent,
        workouts: workouts,
        startDate: startDate,
        template: planTemplate,
      }
    });

  } catch (err) {
    console.error("Training plan generation error:", err);
    return NextResponse.json({ error: "Failed to generate training plan" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { plan } = await request.json();

    if (!plan?.workouts || plan.workouts.length === 0) {
      return NextResponse.json({ error: "No workouts to save" }, { status: 400 });
    }

    // Save workouts to Intervals.icu
    const results = [];
    for (const workout of plan.workouts) {
      try {
        const result = await intervalsRequest("/athlete/" + INTERVALS_ATHLETE_ID + "/events", "POST", {
          start_date_local: workout.start_date_local,
          name: workout.name,
          type: workout.type,
          moving_time: workout.moving_time,
          description: workout.description,
          // Add other fields as needed
        });
        results.push({ workout: workout.name, success: !!result });
      } catch (err) {
        console.error("Failed to save workout:", workout.name, err);
        results.push({ workout: workout.name, success: false, error: err.message });
      }
    }

    return NextResponse.json({ results });

  } catch (err) {
    console.error("Save training plan error:", err);
    return NextResponse.json({ error: "Failed to save training plan" }, { status: 500 });
  }
}