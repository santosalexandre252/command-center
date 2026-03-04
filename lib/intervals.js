// Client-side helpers to fetch from our Intervals.icu proxy API route

const API_BASE = "/api/intervals";

export async function getIntervalsProfile() {
  try {
    const res = await fetch(`${API_BASE}?type=profile`);
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Error fetching Intervals profile:", err);
    return null;
  }
}

export async function getIntervalsActivities(oldest, newest) {
  try {
    const params = new URLSearchParams({ type: "activities" });
    if (oldest) params.set("oldest", oldest);
    if (newest) params.set("newest", newest);
    const res = await fetch(`${API_BASE}?${params}`);
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Error fetching activities:", err);
    return [];
  }
}

export async function getIntervalsWellness(oldest, newest) {
  try {
    const params = new URLSearchParams({ type: "wellness" });
    if (oldest) params.set("oldest", oldest);
    if (newest) params.set("newest", newest);
    const res = await fetch(`${API_BASE}?${params}`);
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Error fetching wellness:", err);
    return [];
  }
}

export async function getIntervalsPlannedWorkouts(oldest, newest) {
  try {
    const params = new URLSearchParams({ type: "events" });
    if (oldest) params.set("oldest", oldest);
    if (newest) params.set("newest", newest);
    const res = await fetch(`${API_BASE}?${params}`);
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Error fetching planned workouts:", err);
    return [];
  }
}

// Helper: get the Monday of the current week
export function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

// Helper: get Sunday of current week
export function getWeekEnd() {
  const start = new Date(getWeekStart());
  start.setDate(start.getDate() + 6);
  return start.toISOString().split("T")[0];
}
