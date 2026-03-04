import { supabase } from "./supabase";

// ── Athlete Profile ──────────────────────────────────
export async function getAthleteProfile() {
  const { data, error } = await supabase
    .from("athlete_profile")
    .select("*")
    .limit(1)
    .single();
  if (error) {
    console.error("Error fetching athlete profile:", error);
    return null;
  }
  return data;
}

export async function updateAthleteProfile(updates) {
  const { data: current } = await supabase
    .from("athlete_profile")
    .select("id")
    .limit(1)
    .single();
  if (!current) return null;

  const { data, error } = await supabase
    .from("athlete_profile")
    .update(updates)
    .eq("id", current.id)
    .select()
    .single();
  if (error) console.error("Error updating profile:", error);
  return data;
}

// ── Races ────────────────────────────────────────────
export async function getRaces() {
  const { data, error } = await supabase
    .from("races")
    .select("*")
    .order("date", { ascending: true });
  if (error) {
    console.error("Error fetching races:", error);
    return [];
  }
  return data;
}

export async function getRaceById(id) {
  const { data, error } = await supabase
    .from("races")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching race:", error);
    return null;
  }
  return data;
}

// ── Energy Logs ──────────────────────────────────────
export async function getEnergyLog(date) {
  const { data, error } = await supabase
    .from("energy_logs")
    .select("*")
    .eq("date", date)
    .single();
  if (error && error.code !== "PGRST116") console.error("Error fetching energy:", error);
  return data;
}

export async function upsertEnergyLog(log) {
  const { data, error } = await supabase
    .from("energy_logs")
    .upsert(log, { onConflict: "date" })
    .select()
    .single();
  if (error) console.error("Error saving energy log:", error);
  return data;
}

export async function getEnergyLogsRange(startDate, endDate) {
  const { data, error } = await supabase
    .from("energy_logs")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date");
  if (error) {
    console.error("Error fetching energy range:", error);
    return [];
  }
  return data;
}

// ── Burnout Scores ───────────────────────────────────
export async function getLatestBurnout() {
  const { data, error } = await supabase
    .from("burnout_scores")
    .select("*")
    .order("date", { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") console.error("Error fetching burnout:", error);
  return data;
}

export async function upsertBurnoutScore(score) {
  const { data, error } = await supabase
    .from("burnout_scores")
    .upsert(score, { onConflict: "date" })
    .select()
    .single();
  if (error) console.error("Error saving burnout:", error);
  return data;
}

export async function getBurnoutHistory(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const { data, error } = await supabase
    .from("burnout_scores")
    .select("*")
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date");
  if (error) {
    console.error("Error fetching burnout history:", error);
    return [];
  }
  return data;
}

// ── Body Composition ─────────────────────────────────
export async function getLatestBodyComp() {
  const { data, error } = await supabase
    .from("body_comp")
    .select("*")
    .order("date", { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") console.error("Error fetching body comp:", error);
  return data;
}

export async function addBodyComp(entry) {
  const { data, error } = await supabase
    .from("body_comp")
    .insert(entry)
    .select()
    .single();
  if (error) console.error("Error saving body comp:", error);
  return data;
}

// ── Supplement Logs ──────────────────────────────────
export async function getSupplementLog(date) {
  const { data, error } = await supabase
    .from("supplement_logs")
    .select("*")
    .eq("date", date)
    .single();
  if (error && error.code !== "PGRST116") console.error("Error fetching supplements:", error);
  return data;
}

export async function upsertSupplementLog(log) {
  const { data, error } = await supabase
    .from("supplement_logs")
    .upsert(log, { onConflict: "date" })
    .select()
    .single();
  if (error) console.error("Error saving supplement log:", error);
  return data;
}

// ── Chat Messages ────────────────────────────────────
export async function getChatMessages(limit = 50) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
  return data;
}

export async function addChatMessage(message) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert(message)
    .select()
    .single();
  if (error) console.error("Error saving message:", error);
  return data;
}

// ── Gym Sessions ─────────────────────────────────────
export async function getGymSession(date) {
  const { data, error } = await supabase
    .from("gym_sessions")
    .select("*")
    .eq("date", date)
    .single();
  if (error && error.code !== "PGRST116") console.error("Error fetching gym session:", error);
  return data;
}

export async function addGymSession(session) {
  const { data, error } = await supabase
    .from("gym_sessions")
    .insert(session)
    .select()
    .single();
  if (error) console.error("Error saving gym session:", error);
  return data;
}
