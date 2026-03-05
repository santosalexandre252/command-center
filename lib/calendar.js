const API_BASE = "/api/calendar";

export async function getCalendarEvents(oldest, newest) {
  try {
    const params = new URLSearchParams();
    if (oldest) params.set("oldest", oldest);
    if (newest) params.set("newest", newest);
    const res = await fetch(`${API_BASE}?${params}`);
    if (!res.ok) return { events: [], dailySummary: {} };
    return res.json();
  } catch (err) {
    console.error("Error fetching calendar:", err);
    return { events: [], dailySummary: {} };
  }
}
