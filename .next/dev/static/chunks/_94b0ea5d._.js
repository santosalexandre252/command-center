(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/supabase.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$98$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+supabase-js@2.98.0/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://wfnwvtrrccfazgwejrlm.supabase.co") || "https://placeholder.supabase.co";
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmbnd2dHJyY2NmYXpnd2VqcmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDI2ODIsImV4cCI6MjA4ODIxODY4Mn0.olssTnjNqzmAWy_mkriVwAu2fmoNLaAo6hzj7TQWFkw") || "placeholder";
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$98$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/db.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addChatMessage",
    ()=>addChatMessage,
    "addGymSession",
    ()=>addGymSession,
    "getAthleteProfile",
    ()=>getAthleteProfile,
    "getChatMessages",
    ()=>getChatMessages,
    "getEnergyLog",
    ()=>getEnergyLog,
    "getEnergyLogsRange",
    ()=>getEnergyLogsRange,
    "getLatestBurnout",
    ()=>getLatestBurnout,
    "getRaceById",
    ()=>getRaceById,
    "getRaces",
    ()=>getRaces,
    "getSupplementLog",
    ()=>getSupplementLog,
    "updateAthleteProfile",
    ()=>updateAthleteProfile,
    "upsertBurnoutScore",
    ()=>upsertBurnoutScore,
    "upsertEnergyLog",
    ()=>upsertEnergyLog,
    "upsertSupplementLog",
    ()=>upsertSupplementLog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.js [app-client] (ecmascript)");
;
async function getAthleteProfile() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("athlete_profile").select("*").limit(1).single();
    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
    return data;
}
async function updateAthleteProfile(updates) {
    const { data: current } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("athlete_profile").select("id").limit(1).single();
    if (!current) return null;
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("athlete_profile").update(updates).eq("id", current.id).select().single();
    if (error) console.error("Error updating profile:", error);
    return data;
}
async function getRaces() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("races").select("*").order("date", {
        ascending: true
    });
    if (error) {
        console.error("Error fetching races:", error);
        return [];
    }
    return data;
}
async function getRaceById(id) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("races").select("*").eq("id", id).single();
    if (error) {
        console.error("Error fetching race:", error);
        return null;
    }
    return data;
}
async function getEnergyLog(date) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("energy_logs").select("*").eq("date", date).single();
    if (error && error.code !== "PGRST116") console.error("Error fetching energy:", error);
    return data;
}
async function getEnergyLogsRange(startDate, endDate) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("energy_logs").select("*").gte("date", startDate).lte("date", endDate).order("date");
    if (error) {
        console.error("Error fetching energy range:", error);
        return [];
    }
    return data;
}
async function upsertEnergyLog(log) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("energy_logs").upsert(log, {
        onConflict: "date"
    }).select().single();
    if (error) console.error("Error saving energy:", error);
    return data;
}
async function getLatestBurnout() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("burnout_scores").select("*").order("date", {
        ascending: false
    }).limit(1).single();
    if (error && error.code !== "PGRST116") console.error("Error fetching burnout:", error);
    return data;
}
async function upsertBurnoutScore(score) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("burnout_scores").upsert(score, {
        onConflict: "date"
    }).select().single();
    if (error) console.error("Error saving burnout:", error);
    return data;
}
async function getChatMessages(limit = 50) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("chat_messages").select("*").order("created_at", {
        ascending: true
    }).limit(limit);
    if (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
    return data;
}
async function addChatMessage(message) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("chat_messages").insert(message).select().single();
    if (error) console.error("Error saving message:", error);
    return data;
}
async function getSupplementLog(date) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("supplement_logs").select("*").eq("date", date).single();
    if (error && error.code !== "PGRST116") console.error("Error fetching supplements:", error);
    return data;
}
async function upsertSupplementLog(log) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("supplement_logs").upsert(log, {
        onConflict: "date"
    }).select().single();
    if (error) console.error("Error saving supplement log:", error);
    return data;
}
async function addGymSession(session) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("gym_sessions").insert(session).select().single();
    if (error) console.error("Error saving gym session:", error);
    return data;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/intervals.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getIntervalsActivities",
    ()=>getIntervalsActivities,
    "getIntervalsAllActivities",
    ()=>getIntervalsAllActivities,
    "getIntervalsAllWellness",
    ()=>getIntervalsAllWellness,
    "getIntervalsPlannedWorkouts",
    ()=>getIntervalsPlannedWorkouts,
    "getIntervalsProfile",
    ()=>getIntervalsProfile,
    "getIntervalsWellness",
    ()=>getIntervalsWellness,
    "getWeekEnd",
    ()=>getWeekEnd,
    "getWeekStart",
    ()=>getWeekStart
]);
// Client-side helpers to fetch from our Intervals.icu proxy API route
const API_BASE = "/api/intervals";
async function getIntervalsProfile() {
    try {
        const res = await fetch(`${API_BASE}?type=profile`);
        if (!res.ok) return null;
        return res.json();
    } catch (err) {
        console.error("Error fetching Intervals profile:", err);
        return null;
    }
}
async function getIntervalsActivities(oldest, newest) {
    try {
        const params = new URLSearchParams({
            type: "activities"
        });
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
async function getIntervalsWellness(oldest, newest) {
    try {
        const params = new URLSearchParams({
            type: "wellness"
        });
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
async function getIntervalsAllWellness() {
    // Fetch everything — from 2020 to today
    const oldest = "2020-01-01";
    const newest = new Date().toISOString().split("T")[0];
    return getIntervalsWellness(oldest, newest);
}
async function getIntervalsAllActivities() {
    const oldest = "2020-01-01";
    const newest = new Date().toISOString().split("T")[0];
    return getIntervalsActivities(oldest, newest);
}
async function getIntervalsPlannedWorkouts(oldest, newest) {
    try {
        const params = new URLSearchParams({
            type: "events"
        });
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
function getWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split("T")[0];
}
function getWeekEnd() {
    const start = new Date(getWeekStart());
    start.setDate(start.getDate() + 6);
    return start.toISOString().split("T")[0];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/calendar.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCalendarEvents",
    ()=>getCalendarEvents
]);
const API_BASE = "/api/calendar";
async function getCalendarEvents(oldest, newest) {
    try {
        const params = new URLSearchParams();
        if (oldest) params.set("oldest", oldest);
        if (newest) params.set("newest", newest);
        const res = await fetch(`${API_BASE}?${params}`);
        if (!res.ok) return {
            events: [],
            dailySummary: {}
        };
        return res.json();
    } catch (err) {
        console.error("Error fetching calendar:", err);
        return {
            events: [],
            dailySummary: {}
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "daysUntil",
    ()=>daysUntil,
    "formatDate",
    ()=>formatDate,
    "getBurnoutBg",
    ()=>getBurnoutBg,
    "getBurnoutColor",
    ()=>getBurnoutColor,
    "getRaceTypeColor",
    ()=>getRaceTypeColor,
    "getRaceTypeIcon",
    ()=>getRaceTypeIcon,
    "getWorkDensityColor",
    ()=>getWorkDensityColor
]);
function daysUntil(dateStr) {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}
function getBurnoutColor(score) {
    if (score < 40) return "text-emerald-400";
    if (score < 55) return "text-yellow-400";
    if (score < 75) return "text-amber-400";
    return "text-red-400";
}
function getBurnoutBg(score) {
    if (score < 40) return "bg-emerald-500/10 border-emerald-500/20";
    if (score < 55) return "bg-yellow-500/10 border-yellow-500/20";
    if (score < 75) return "bg-amber-500/10 border-amber-500/20";
    return "bg-red-500/10 border-red-500/20";
}
function getWorkDensityColor(density) {
    const colors = {
        rest: "bg-emerald-500/20 text-emerald-400",
        light: "bg-sky-500/20 text-sky-400",
        medium: "bg-yellow-500/20 text-yellow-400",
        heavy: "bg-orange-500/20 text-orange-400",
        travel: "bg-red-500/20 text-red-400"
    };
    return colors[density] || colors.light;
}
function getRaceTypeIcon(type) {
    const icons = {
        road_run: "🏃",
        trail: "⛰️",
        cycling: "🚴"
    };
    return icons[type] || "🏅";
}
function getRaceTypeColor(type) {
    const colors = {
        road_run: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        trail: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        cycling: "bg-orange-500/20 text-orange-400 border-orange-500/30"
    };
    return colors[type] || "";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/guardrails.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Guardrail Engine — Real-time danger detection for training decisions
// Combines 6 burnout signals + specific rule-based alerts
// ── Burnout Score Calculation (shared by dashboard + load pages) ─────
__turbopack_context__.s([
    "buildBriefingDecision",
    ()=>buildBriefingDecision,
    "calculateBurnoutSignals",
    ()=>calculateBurnoutSignals,
    "calculateRaceReadiness",
    ()=>calculateRaceReadiness,
    "calculateWorkStress",
    ()=>calculateWorkStress,
    "runGuardrails",
    ()=>runGuardrails
]);
function calculateBurnoutSignals({ atl, ctl, tsb, avg7HRV, avg30HRV, avgSleep, workStress, avgEnergy, calendarConnected }) {
    const training = atl ? Math.round(Math.min(100, atl / 80 * 100)) : 40;
    const form = tsb !== null && tsb !== undefined ? Math.round(Math.max(0, Math.min(100, 50 - tsb * 3))) : 40;
    const hrv = avg30HRV && avg7HRV ? Math.round(Math.max(0, Math.min(100, 70 - (avg7HRV - avg30HRV)))) : 40;
    const sleep = avgSleep ? Math.round(Math.max(0, Math.min(100, avgSleep < 7 ? 80 : avgSleep < 7.5 ? 55 : avgSleep < 8 ? 35 : 20))) : 40;
    const work = calendarConnected ? Math.round(Math.min(100, workStress || 0)) : 40;
    const energy = avgEnergy ? Math.round(Math.max(0, Math.min(100, (5 - avgEnergy) * 25))) : 40;
    const total = Math.round(training * 0.25 + form * 0.15 + hrv * 0.15 + sleep * 0.15 + work * 0.15 + energy * 0.15);
    const level = total < 40 ? "LOW" : total < 55 ? "MODERATE" : total < 75 ? "HIGH" : "CRITICAL";
    return {
        total,
        level,
        signals: {
            training,
            form,
            hrv,
            sleep,
            work,
            energy
        }
    };
}
function calculateWorkStress(calendarData) {
    if (!calendarData || Object.keys(calendarData).length === 0) return 0;
    const heavyDays = Object.values(calendarData).filter((d)=>d.density === "heavy" || d.density === "travel").length;
    const totalMeetings = Object.values(calendarData).reduce((s, d)=>s + d.count, 0);
    return Math.min(100, heavyDays * 20 + totalMeetings * 5);
}
// ── Guardrail Rules ──────────────────────────────────────────────────
// Each rule returns null (no alert) or an alert object
const SEVERITY = {
    INFO: "info",
    WARNING: "warning",
    DANGER: "danger"
};
function checkATLCTLRatio({ atl, ctl }) {
    if (!atl || !ctl || ctl === 0) return null;
    const ratio = atl / ctl;
    if (ratio > 1.5) {
        return {
            id: "atl-ctl-spike",
            severity: SEVERITY.DANGER,
            title: "Training load spike",
            message: `ATL:CTL ratio is ${ratio.toFixed(2)} (danger >1.5). Acute load far exceeds chronic fitness.`,
            action: "Drop to Z1-Z2 only for the next 2-3 days. No intervals or hard sessions until ratio drops below 1.3.",
            icon: "🔴"
        };
    }
    if (ratio > 1.3) {
        return {
            id: "atl-ctl-elevated",
            severity: SEVERITY.WARNING,
            title: "Training load ramping fast",
            message: `ATL:CTL ratio is ${ratio.toFixed(2)} (caution >1.3). You're building load quickly.`,
            action: "Keep tomorrow easy or take a rest day. Avoid stacking two hard days.",
            icon: "🟡"
        };
    }
    return null;
}
function checkHRVTrend({ hrvLast3, avg30HRV }) {
    if (!hrvLast3 || hrvLast3.length < 3 || !avg30HRV) return null;
    const avg3 = hrvLast3.reduce((s, v)=>s + v, 0) / hrvLast3.length;
    const dropPercent = (avg30HRV - avg3) / avg30HRV * 100;
    if (dropPercent > 15) {
        return {
            id: "hrv-declining",
            severity: SEVERITY.DANGER,
            title: "HRV declining sharply",
            message: `3-day HRV avg (${Math.round(avg3)}ms) is ${Math.round(dropPercent)}% below your 30-day avg (${Math.round(avg30HRV)}ms).`,
            action: "Your autonomic system is stressed. Swap any hard session for easy movement or full rest today.",
            icon: "🔴"
        };
    }
    if (dropPercent > 8) {
        return {
            id: "hrv-dipping",
            severity: SEVERITY.WARNING,
            title: "HRV trending down",
            message: `3-day HRV avg (${Math.round(avg3)}ms) is ${Math.round(dropPercent)}% below your 30-day avg (${Math.round(avg30HRV)}ms).`,
            action: "Monitor closely. If you train today, keep intensity moderate and stop if RPE feels higher than expected.",
            icon: "🟡"
        };
    }
    return null;
}
function checkTSBWorkCombo({ tsb, todayWorkDensity }) {
    if (tsb === null || tsb === undefined) return null;
    const isHeavyWork = todayWorkDensity === "heavy" || todayWorkDensity === "travel";
    if (tsb < -15 && isHeavyWork) {
        return {
            id: "tsb-work-danger",
            severity: SEVERITY.DANGER,
            title: "Deep fatigue + heavy work day",
            message: `TSB is ${Math.round(tsb)} (very fatigued) and today is a ${todayWorkDensity} work day.`,
            action: "Skip training entirely or do 20-30min easy walk. Prioritise sleep tonight. Burnout risk is high.",
            icon: "🔴"
        };
    }
    if (tsb < -10 && isHeavyWork) {
        return {
            id: "tsb-work-warning",
            severity: SEVERITY.WARNING,
            title: "Fatigued + busy work day",
            message: `TSB is ${Math.round(tsb)} and today is a ${todayWorkDensity} work day.`,
            action: "Reduce session intensity or duration by 30%. Easy Z2 only. No intervals.",
            icon: "🟡"
        };
    }
    return null;
}
function checkSleepStreak({ recentSleep }) {
    if (!recentSleep || recentSleep.length < 3) return null;
    const last3 = recentSleep.slice(-3);
    const poorNights = last3.filter((s)=>s !== null && s < 6.5).length;
    if (poorNights >= 3) {
        return {
            id: "sleep-streak-bad",
            severity: SEVERITY.DANGER,
            title: "3+ nights of poor sleep",
            message: `Last 3 nights averaged under 6.5 hours. Recovery is severely compromised.`,
            action: "No high-intensity training until you get two consecutive nights >7h. Easy movement only.",
            icon: "🔴"
        };
    }
    if (poorNights >= 2) {
        return {
            id: "sleep-streak-warn",
            severity: SEVERITY.WARNING,
            title: "Poor sleep streak",
            message: `2 of your last 3 nights were under 6.5 hours.`,
            action: "Reduce today's session volume. Prioritise an early bedtime tonight — aim for 8+ hours.",
            icon: "🟡"
        };
    }
    return null;
}
function checkKneeBeforeLegDay({ kneeStatus, todayPlanned, energyLog }) {
    if (!todayPlanned) return null;
    const isLegDay = /leg|gym\s*a|gym\s*d|squat|lunge/i.test(todayPlanned.name || todayPlanned.category || "") || todayPlanned.category === "WeightTraining";
    if (!isLegDay) return null;
    // Knee status from energy log: 1=perfect, 5=painful
    const knee = energyLog?.knee_status || kneeStatus || 0;
    if (knee >= 4) {
        return {
            id: "knee-leg-day-danger",
            severity: SEVERITY.DANGER,
            title: "Knee sore — leg day today",
            message: `Your right knee is rated ${knee}/5 and today's plan includes legs.`,
            action: "Swap Bulgarian split squats → step-ups/reverse lunges. Swap lever leg extensions → terminal knee extensions/wall sits. Reduce load by 20%.",
            icon: "🦵"
        };
    }
    if (knee >= 3) {
        return {
            id: "knee-leg-day-warning",
            severity: SEVERITY.WARNING,
            title: "Knee moderate — leg day caution",
            message: `Your right knee is rated ${knee}/5. Leg session planned today.`,
            action: "Consider ACL-safe swaps: step-ups instead of Bulgarian split squats. Use lighter weight on any single-leg exercises. Stop if pain increases.",
            icon: "🦵"
        };
    }
    return null;
}
function checkOverallBurnout({ burnoutTotal }) {
    if (burnoutTotal >= 75) {
        return {
            id: "burnout-critical",
            severity: SEVERITY.DANGER,
            title: "Burnout risk critical",
            message: `Composite burnout score is ${burnoutTotal}/100 — multiple signals are elevated.`,
            action: "Take a full rest day. Consider rearranging the week to front-load recovery. Talk to your coach.",
            icon: "🔥"
        };
    }
    if (burnoutTotal >= 55) {
        return {
            id: "burnout-elevated",
            severity: SEVERITY.WARNING,
            title: "Burnout risk elevated",
            message: `Composite burnout score is ${burnoutTotal}/100.`,
            action: "Reduce training volume today. Prioritise sleep and nutrition. Avoid adding unplanned sessions.",
            icon: "⚠️"
        };
    }
    return null;
}
function runGuardrails({ atl, ctl, tsb, hrvLast3, avg30HRV, recentSleep, todayWorkDensity, kneeStatus, todayPlanned, energyLog, burnoutTotal }) {
    const alerts = [
        checkATLCTLRatio({
            atl,
            ctl
        }),
        checkHRVTrend({
            hrvLast3,
            avg30HRV
        }),
        checkTSBWorkCombo({
            tsb,
            todayWorkDensity
        }),
        checkSleepStreak({
            recentSleep
        }),
        checkKneeBeforeLegDay({
            kneeStatus,
            todayPlanned,
            energyLog
        }),
        checkOverallBurnout({
            burnoutTotal
        })
    ].filter(Boolean);
    // Sort: danger first, then warning, then info
    const order = {
        danger: 0,
        warning: 1,
        info: 2
    };
    alerts.sort((a, b)=>order[a.severity] - order[b.severity]);
    return alerts;
}
function buildBriefingDecision(alerts) {
    const dangerCount = alerts.filter((a)=>a.severity === "danger").length;
    const warningCount = alerts.filter((a)=>a.severity === "warning").length;
    if (dangerCount >= 2) return "rest";
    if (dangerCount === 1) return "swap";
    if (warningCount >= 2) return "modify";
    if (warningCount === 1) return "caution";
    return "go";
}
function calculateRaceReadiness({ race, currentCTL, weeksRemaining, weeklyVolumes, longSessions, currentWeight }) {
    const targetCTL = race.target_ctl;
    const ctlGap = targetCTL - (currentCTL || 0);
    const ctlPercent = Math.min(100, Math.round((currentCTL || 0) / targetCTL * 100));
    const ctlRampNeeded = weeksRemaining > 0 ? Math.round(ctlGap / weeksRemaining * 10) / 10 : 0;
    // Volume progression — are weekly volumes trending up?
    let volumeTrend = "insufficient_data";
    if (weeklyVolumes && weeklyVolumes.length >= 3) {
        const last3 = weeklyVolumes.slice(-3);
        const isIncreasing = last3[2] > last3[0];
        const avgRecent = last3.reduce((s, v)=>s + v, 0) / 3;
        volumeTrend = isIncreasing ? "building" : avgRecent > 0 ? "flat" : "declining";
    }
    // Long session progression — approaching race distance?
    let longRunProgress = null;
    if (longSessions && longSessions.length > 0) {
        const raceDistance = race.distance;
        const longestRecent = Math.max(...longSessions.map((s)=>s.distance || 0));
        const targetLong = race.type === "cycling" ? raceDistance * 0.75 : raceDistance * 0.85;
        longRunProgress = {
            longest: longestRecent,
            target: Math.round(targetLong * 10) / 10,
            percent: Math.min(100, Math.round(longestRecent / targetLong * 100))
        };
    }
    // Weight trajectory
    let weightStatus = null;
    if (currentWeight && race.target_weight) {
        const weightGap = currentWeight - race.target_weight;
        const weeklyLossNeeded = weeksRemaining > 0 ? weightGap / weeksRemaining : 0;
        weightStatus = {
            current: currentWeight,
            target: race.target_weight,
            gap: Math.round(weightGap * 10) / 10,
            weeklyLossNeeded: Math.round(weeklyLossNeeded * 100) / 100,
            onTrack: weeklyLossNeeded <= 0.5
        };
    }
    // Overall readiness
    let readiness = "on_track";
    if (ctlPercent < 60 && weeksRemaining < 6) readiness = "behind";
    else if (ctlPercent < 75 && weeksRemaining < 3) readiness = "at_risk";
    else if (ctlPercent >= 90) readiness = "ready";
    return {
        ctlPercent,
        ctlGap: Math.round(ctlGap * 10) / 10,
        ctlRampNeeded,
        volumeTrend,
        longRunProgress,
        weightStatus,
        weeksRemaining,
        readiness
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$intervals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/intervals.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/calendar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$guardrails$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/guardrails.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function EnergyStars({ value, onChange, size = "text-lg" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-1",
        children: [
            1,
            2,
            3,
            4,
            5
        ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onChange(star),
                className: `energy-star ${size} ${star <= value ? "text-yellow-400" : "text-gray-600"}`,
                children: "★"
            }, star, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 15,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/dashboard/page.js",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = EnergyStars;
function RatingRow({ label, value, onChange, labels }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between py-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-gray-300 w-28",
                children: label
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-1",
                children: [
                    1,
                    2,
                    3,
                    4,
                    5
                ].map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onChange(v),
                        className: `w-8 h-8 rounded-lg text-xs font-medium transition-all ${v === value ? "bg-brand-600 text-white" : "bg-surface-900 text-gray-500 hover:text-white hover:bg-surface-800"}`,
                        children: v
                    }, v, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 27,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[10px] text-gray-500 w-20 text-right",
                children: labels?.[value - 1] || ""
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.js",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c1 = RatingRow;
function DailyCheckIn({ date, existing, onSave, onClose }) {
    _s();
    const [energy, setEnergy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(existing?.energy || 0);
    const [sleepHours, setSleepHours] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(existing?.sleep_hours || "");
    const [sleepQuality, setSleepQuality] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(existing?.sleep_quality || 0);
    const [mood, setMood] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(existing?.mood || 0);
    const [soreness, setSoreness] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(existing?.soreness || 0);
    const [kneeStatus, setKneeStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(existing?.knee_status || 0);
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(existing?.notes || "");
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSave = async ()=>{
        setSaving(true);
        await onSave({
            date,
            energy: energy || null,
            sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
            sleep_quality: sleepQuality || null,
            mood: mood || null,
            soreness: soreness || null,
            knee_status: kneeStatus || null,
            notes: notes || null
        });
        setSaving(false);
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/60 flex items-center justify-center z-50",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-surface-850 border border-white/10 rounded-2xl p-6 w-[440px] shadow-2xl",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-bold text-white",
                                    children: "Daily Check-In"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500",
                                    children: new Date(date + "T12:00:00").toLocaleDateString("en-GB", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long"
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-500 hover:text-white text-xl",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.js",
                    lineNumber: 55,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-2 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-gray-300",
                                    children: "Energy"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 63,
                                    columnNumber: 67
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EnergyStars, {
                                    value: energy,
                                    onChange: setEnergy,
                                    size: "text-xl"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 63,
                                    columnNumber: 120
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-2 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-gray-300",
                                    children: "Sleep"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 64,
                                    columnNumber: 67
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            step: "0.5",
                                            min: "0",
                                            max: "14",
                                            value: sleepHours,
                                            onChange: (e)=>setSleepHours(e.target.value),
                                            placeholder: "hrs",
                                            className: "w-16 text-sm text-center text-gray-200 bg-surface-900 border border-white/5 rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-500/50"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.js",
                                            lineNumber: 64,
                                            columnNumber: 160
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-gray-500",
                                            children: "hours"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.js",
                                            lineNumber: 64,
                                            columnNumber: 452
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 64,
                                    columnNumber: 119
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RatingRow, {
                            label: "Sleep Quality",
                            value: sleepQuality,
                            onChange: setSleepQuality,
                            labels: [
                                "Terrible",
                                "Poor",
                                "OK",
                                "Good",
                                "Great"
                            ]
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RatingRow, {
                            label: "Mood",
                            value: mood,
                            onChange: setMood,
                            labels: [
                                "Awful",
                                "Low",
                                "Neutral",
                                "Good",
                                "Great"
                            ]
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RatingRow, {
                            label: "Soreness",
                            value: soreness,
                            onChange: setSoreness,
                            labels: [
                                "None",
                                "Light",
                                "Moderate",
                                "Heavy",
                                "Severe"
                            ]
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RatingRow, {
                            label: "Right Knee",
                            value: kneeStatus,
                            onChange: setKneeStatus,
                            labels: [
                                "Perfect",
                                "Mild",
                                "Moderate",
                                "Sore",
                                "Painful"
                            ]
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.js",
                    lineNumber: 62,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    value: notes,
                    onChange: (e)=>setNotes(e.target.value),
                    placeholder: "Any notes? (optional)",
                    rows: 2,
                    className: "w-full mt-3 text-sm text-gray-200 bg-surface-900 border border-white/5 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500/50 resize-none placeholder-gray-600"
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/page.js",
                    lineNumber: 70,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3 mt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "flex-1 px-4 py-2.5 text-sm text-gray-400 bg-surface-900 rounded-lg hover:text-white",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSave,
                            disabled: saving,
                            className: "flex-1 px-4 py-2.5 text-sm text-white bg-brand-600 rounded-lg hover:bg-brand-700 font-medium disabled:opacity-50",
                            children: saving ? "Saving..." : "Save Check-In"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.js",
                    lineNumber: 71,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/page.js",
            lineNumber: 54,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/dashboard/page.js",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_s(DailyCheckIn, "npCDacnBOok3JpaINQ2PC/JEr/M=");
_c2 = DailyCheckIn;
function DayCard({ day, isToday, energyLog, calendarDay, onCheckIn }) {
    const activity = day.activities[0];
    const typeIcons = {
        Run: "🏃",
        Ride: "🚴",
        WeightTraining: "🏋️",
        VirtualRide: "🚴",
        Walk: "🚶",
        Swim: "🏊",
        Hike: "⛰️"
    };
    const savedEnergy = energyLog?.energy || 0;
    const density = calendarDay?.density || "rest";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-xl border p-3 transition-all ${isToday ? "bg-brand-600/10 border-brand-500/30 ring-1 ring-brand-500/20" : "bg-surface-850 border-white/5"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-xs font-medium ${isToday ? "text-brand-400" : "text-gray-500"}`,
                        children: isToday ? "TODAY" : day.label
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `px-1.5 py-0.5 rounded text-[9px] font-medium ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkDensityColor"])(density)}`,
                        children: density
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            calendarDay && calendarDay.events.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2 space-y-0.5",
                children: [
                    calendarDay.events.slice(0, 2).map((evt, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-[9px] text-gray-500 truncate",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-600",
                                    children: evt.startTime
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 103,
                                    columnNumber: 15
                                }, this),
                                " ",
                                evt.title
                            ]
                        }, i, true, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 102,
                            columnNumber: 13
                        }, this)),
                    calendarDay.events.length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[9px] text-gray-600",
                        children: [
                            "+",
                            calendarDay.events.length - 2,
                            " more"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 106,
                        columnNumber: 45
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 100,
                columnNumber: 9
            }, this),
            day.activities.map((act, i)=>{
                const icon = typeIcons[act.type] || "🏅";
                const minutes = act.moving_time ? Math.round(act.moving_time / 60) : 0;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1 text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: icon
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 117,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `font-medium truncate ${act.completed ? "text-gray-200" : "text-gray-400"}`,
                                    children: act.name
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 118,
                                    columnNumber: 15
                                }, this),
                                act.completed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-emerald-500 text-[10px] ml-auto",
                                    children: "✓"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 119,
                                    columnNumber: 33
                                }, this),
                                act.planned && !act.completed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-blue-400 text-[9px] ml-auto",
                                    children: "PLAN"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 120,
                                    columnNumber: 49
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 116,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 text-[9px] text-gray-500 mt-0.5",
                            children: [
                                minutes > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        minutes,
                                        "m"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 123,
                                    columnNumber: 31
                                }, this),
                                act.tss && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "TSS ",
                                        Math.round(act.tss)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 124,
                                    columnNumber: 27
                                }, this),
                                act.load_target && !act.tss && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "~",
                                        Math.round(act.load_target)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 125,
                                    columnNumber: 47
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 122,
                            columnNumber: 13
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/app/dashboard/page.js",
                    lineNumber: 115,
                    columnNumber: 11
                }, this);
            }),
            day.activities.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-[10px] text-gray-600 italic mb-1.5",
                children: "Rest day"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 132,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onCheckIn(day.date),
                className: "flex items-center gap-1 text-[10px] text-gray-500 hover:text-brand-400 transition-colors mt-1",
                children: savedEnergy > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-yellow-400",
                            children: [
                                "★".repeat(savedEnergy),
                                "☆".repeat(5 - savedEnergy)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 138,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-600 ml-0.5",
                            children: "edit"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 138,
                            columnNumber: 108
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: "+ Check in"
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/page.js",
                    lineNumber: 140,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 136,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.js",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_c3 = DayCard;
function TSSProgressBar({ actual, planned, label }) {
    const pct = planned > 0 ? Math.min(100, Math.round(actual / planned * 100)) : 0;
    const isOver = actual > planned && planned > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-surface-850 border border-white/5 rounded-xl p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium text-gray-300",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-gray-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white font-medium",
                                children: Math.round(actual)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 154,
                                columnNumber: 48
                            }, this),
                            planned > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    " / ",
                                    Math.round(planned)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 154,
                                columnNumber: 132
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full bg-gray-800 rounded-full h-2.5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `h-2.5 rounded-full transition-all ${isOver ? "bg-amber-500" : pct >= 80 ? "bg-emerald-500" : "bg-brand-500"}`,
                    style: {
                        width: `${Math.min(100, pct)}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/page.js",
                    lineNumber: 157,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between mt-2 text-[10px] text-gray-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            pct,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    planned > 0 && !isOver && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            Math.round(planned - actual),
                            " remaining"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 161,
                        columnNumber: 36
                    }, this),
                    isOver && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-amber-400",
                        children: [
                            "+",
                            Math.round(actual - planned),
                            " over"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 162,
                        columnNumber: 20
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 159,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.js",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
_c4 = TSSProgressBar;
function VolumeBreakdown({ activities, planned }) {
    const types = {};
    activities.filter((a)=>a.completed).forEach((a)=>{
        const t = a.type || "Other";
        if (!types[t]) types[t] = {
            actual: 0,
            count: 0
        };
        types[t].actual += a.icu_training_load || a.tss || 0;
        types[t].count += 1;
    });
    const plannedTypes = {};
    planned.forEach((p)=>{
        const t = p.type || p.category || "Other";
        if (!plannedTypes[t]) plannedTypes[t] = {
            planned: 0,
            count: 0
        };
        plannedTypes[t].planned += p.load_target || p.tss || 0;
        plannedTypes[t].count += 1;
    });
    const typeIcons = {
        Run: "🏃",
        Ride: "🚴",
        WeightTraining: "🏋️",
        VirtualRide: "🚴",
        Swim: "🏊"
    };
    const allTypes = [
        ...new Set([
            ...Object.keys(types),
            ...Object.keys(plannedTypes)
        ])
    ];
    if (allTypes.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-surface-850 border border-white/5 rounded-xl p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-sm font-medium text-gray-300 mb-3",
                children: "Volume by Discipline"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: allTypes.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between p-2 bg-surface-900 rounded-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: typeIcons[t] || "🏅"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 182,
                                        columnNumber: 54
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-gray-300",
                                        children: t
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 182,
                                        columnNumber: 89
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-white font-medium",
                                        children: [
                                            Math.round(types[t]?.actual || 0),
                                            " TSS ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-500 font-normal",
                                                children: [
                                                    "(",
                                                    types[t]?.count || 0,
                                                    "x)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 184,
                                                columnNumber: 103
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this),
                                    (plannedTypes[t]?.planned || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-gray-500",
                                        children: [
                                            "Planned: ",
                                            Math.round(plannedTypes[t].planned),
                                            " (",
                                            plannedTypes[t].count,
                                            "x)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 185,
                                        columnNumber: 55
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 183,
                                columnNumber: 13
                            }, this)
                        ]
                    }, t, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 179,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.js",
        lineNumber: 177,
        columnNumber: 5
    }, this);
}
_c5 = VolumeBreakdown;
function RaceCountdown({ race, ctl }) {
    const days = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["daysUntil"])(race.date);
    const fitnessPercent = Math.min(100, Math.round(ctl / race.target_ctl * 100));
    const isOnTrack = fitnessPercent >= 80;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-surface-850 border border-white/5 rounded-xl p-4 card-hover",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRaceTypeIcon"])(race.type)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 201,
                                columnNumber: 50
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium text-gray-200",
                                children: race.short_name
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 201,
                                columnNumber: 91
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-[10px] px-2 py-0.5 rounded font-bold ${race.priority === "A" ? "bg-brand-600/20 text-brand-400" : "bg-gray-700/50 text-gray-400"}`,
                        children: race.priority
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 200,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-2xl font-bold text-white",
                children: [
                    days,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-normal text-gray-500 ml-1",
                        children: "days"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 204,
                        columnNumber: 60
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between text-[10px] text-gray-500 mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "CTL ",
                                    Math.round(ctl),
                                    "/",
                                    race.target_ctl
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 206,
                                columnNumber: 78
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: isOnTrack ? "text-emerald-400" : "text-amber-400",
                                children: isOnTrack ? "On track" : "Behind"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 206,
                                columnNumber: 130
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full bg-gray-800 rounded-full h-1.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `h-1.5 rounded-full transition-all ${isOnTrack ? "bg-emerald-500" : "bg-amber-500"}`,
                            style: {
                                width: `${fitnessPercent}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 207,
                            columnNumber: 64
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 207,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 205,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.js",
        lineNumber: 199,
        columnNumber: 5
    }, this);
}
_c6 = RaceCountdown;
function WorkWeekSummary({ calendarData }) {
    if (!calendarData || Object.keys(calendarData).length === 0) return null;
    const totalMeetings = Object.values(calendarData).reduce((s, d)=>s + d.count, 0);
    const heavyDays = Object.values(calendarData).filter((d)=>d.density === "heavy" || d.density === "travel").length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-surface-850 border border-white/5 rounded-xl p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-sm font-medium text-gray-300 mb-2",
                children: "Work This Week"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 219,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-4 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xl font-bold text-white",
                                children: totalMeetings
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 221,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] text-gray-500",
                                children: "meetings"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 221,
                                columnNumber: 81
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 221,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xl font-bold text-white",
                                children: heavyDays
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 222,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] text-gray-500",
                                children: "heavy days"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 222,
                                columnNumber: 77
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 222,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 220,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.js",
        lineNumber: 218,
        columnNumber: 5
    }, this);
}
_c7 = WorkWeekSummary;
function WeightForecast({ races, currentWeight, targetWeight, onLoadForecast, forecast }) {
    const nextRace = races.filter((r)=>new Date(r.date) > new Date()).sort((a, b)=>new Date(a.date) - new Date(b.date))[0];
    if (!nextRace) return null;
    const daysToRace = Math.ceil((new Date(nextRace.date) - new Date()) / (1000 * 60 * 60 * 24));
    const raceTarget = nextRace.target_weight || targetWeight;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-surface-850 border border-white/5 rounded-xl p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-medium text-gray-300",
                        children: "Weight Forecast"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onLoadForecast(nextRace.id),
                        className: "text-[10px] px-2 py-1 rounded bg-brand-600/20 text-brand-400 hover:bg-brand-600/30 transition-colors",
                        children: forecast ? "Refresh" : "Forecast"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 242,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 240,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-400",
                                children: "Current"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium text-white",
                                children: [
                                    currentWeight,
                                    "kg"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-400",
                                children: [
                                    "Target (",
                                    nextRace.short_name,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 256,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium text-emerald-400",
                                children: [
                                    raceTarget,
                                    "kg"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 255,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-400",
                                children: "Days to race"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 260,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium text-white",
                                children: daysToRace
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 261,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this),
                    forecast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-3 border-t border-white/5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-400",
                                        children: "Projected"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 267,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-sm font-medium ${forecast.willMeetTarget ? "text-emerald-400" : "text-amber-400"}`,
                                        children: [
                                            forecast.projectedWeight,
                                            "kg"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 268,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 266,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] text-gray-500 mb-2",
                                children: [
                                    "Trend: ",
                                    forecast.currentTrend.direction,
                                    " ",
                                    forecast.currentTrend.rate > 0 && `(${forecast.currentTrend.rate.toFixed(1)}kg/week)`
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 272,
                                columnNumber: 13
                            }, this),
                            forecast.recommendations?.slice(0, 1).map((rec, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-xs p-2 rounded ${rec.priority === "high" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`,
                                    children: rec.action
                                }, i, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 276,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 265,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 250,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.js",
        lineNumber: 239,
        columnNumber: 5
    }, this);
}
_c8 = WeightForecast;
function ActivityAnalysis({ activities, onAnalyze, analysis }) {
    const recentActivities = activities.filter((a)=>a.completed && a.start_date_local).sort((a, b)=>new Date(b.start_date_local) - new Date(a.start_date_local)).slice(0, 3);
    if (recentActivities.length === 0) return null;
    const typeIcons = {
        Run: "🏃",
        Ride: "🚴",
        WeightTraining: "🏋️",
        VirtualRide: "🚴",
        Walk: "🚶",
        Swim: "🏊",
        Hike: "⛰️"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-surface-850 border border-white/5 rounded-xl p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-sm font-medium text-gray-300 mb-3",
                children: "Recent Workouts"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 299,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: recentActivities.map((activity)=>{
                    const analysisData = analysis[activity.id];
                    const icon = typeIcons[activity.type] || "🏅";
                    const date = new Date(activity.start_date_local).toLocaleDateString();
                    const duration = activity.moving_time ? Math.round(activity.moving_time / 60) : 0;
                    const tss = activity.icu_training_load ? Math.round(activity.icu_training_load) : 0;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border border-white/5 rounded-lg p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: icon
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 312,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium text-gray-200 truncate",
                                                children: activity.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 313,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 311,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-500",
                                        children: date
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 315,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 310,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3 text-[10px] text-gray-500",
                                        children: [
                                            duration > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    duration,
                                                    "m"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 319,
                                                columnNumber: 36
                                            }, this),
                                            tss > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "TSS ",
                                                    tss
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 320,
                                                columnNumber: 31
                                            }, this),
                                            activity.distance && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    (activity.distance / 1000).toFixed(1),
                                                    "km"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 321,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 318,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onAnalyze(activity.id),
                                        className: "text-[10px] px-2 py-1 rounded bg-brand-600/20 text-brand-400 hover:bg-brand-600/30 transition-colors",
                                        disabled: analysisData,
                                        children: analysisData ? "Analyzed" : "Analyze"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 323,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 317,
                                columnNumber: 15
                            }, this),
                            analysisData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 pt-3 border-t border-white/5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-300 leading-relaxed",
                                    children: analysisData.aiAnalysis
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 333,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 332,
                                columnNumber: 17
                            }, this)
                        ]
                    }, activity.id, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 309,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 300,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.js",
        lineNumber: 298,
        columnNumber: 5
    }, this);
}
_c9 = ActivityAnalysis;
function DashboardPage() {
    _s1();
    const [athlete, setAthlete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [races, setRaces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [fitness, setFitness] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activities, setActivities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [planned, setPlanned] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [energyLogs, setEnergyLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [calendarData, setCalendarData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [intervalsConnected, setIntervalsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [calendarConnected, setCalendarConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [checkInDate, setCheckInDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [guardrailAlerts, setGuardrailAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [wellnessData, setWellnessData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activityAnalysis, setActivityAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [weightForecast, setWeightForecast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [weekStart, setWeekStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            async function loadData() {
                const ws = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$intervals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekStart"])();
                const we = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$intervals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekEnd"])();
                setWeekStart(ws);
                const [profileData, racesData, fitnessData, activitiesData, plannedData, energyData, calData, recentWellness] = await Promise.all([
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAthleteProfile"])(),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRaces"])(),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$intervals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIntervalsProfile"])(),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$intervals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIntervalsActivities"])(ws, we),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$intervals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIntervalsPlannedWorkouts"])(ws, we),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEnergyLogsRange"])(ws, we),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCalendarEvents"])(ws, we),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$intervals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIntervalsWellness"])(new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0], new Date().toISOString().split("T")[0])
                ]);
                setAthlete(profileData);
                setRaces(racesData);
                if (fitnessData && fitnessData.ctl !== undefined) {
                    setFitness(fitnessData);
                    setIntervalsConnected(true);
                }
                const completed = (activitiesData || []).map({
                    "DashboardPage.useEffect.loadData.completed": (a)=>({
                            ...a,
                            completed: true
                        })
                }["DashboardPage.useEffect.loadData.completed"]);
                const completedDates = new Set(completed.map({
                    "DashboardPage.useEffect.loadData": (a)=>a.date
                }["DashboardPage.useEffect.loadData"]));
                const futurePlanned = (plannedData || []).filter({
                    "DashboardPage.useEffect.loadData.futurePlanned": (p)=>!completedDates.has(p.date)
                }["DashboardPage.useEffect.loadData.futurePlanned"]).map({
                    "DashboardPage.useEffect.loadData.futurePlanned": (p)=>({
                            ...p,
                            name: p.name || p.category || "Planned workout",
                            completed: false,
                            planned: true,
                            tss: null,
                            moving_time: p.duration
                        })
                }["DashboardPage.useEffect.loadData.futurePlanned"]);
                setActivities([
                    ...completed,
                    ...futurePlanned
                ]);
                setPlanned(plannedData || []);
                const logsMap = {};
                (energyData || []).forEach({
                    "DashboardPage.useEffect.loadData": (log)=>{
                        logsMap[log.date] = log;
                    }
                }["DashboardPage.useEffect.loadData"]);
                setEnergyLogs(logsMap);
                if (calData?.dailySummary && Object.keys(calData.dailySummary).length > 0) {
                    setCalendarData(calData.dailySummary);
                    setCalendarConnected(true);
                }
                setWellnessData(recentWellness || []);
                setLoading(false);
            }
            loadData();
        }
    }["DashboardPage.useEffect"], []);
    const handleSaveCheckIn = async (log)=>{
        const saved = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["upsertEnergyLog"])(log);
        if (saved) setEnergyLogs((prev)=>({
                ...prev,
                [log.date]: saved
            }));
    };
    const handleAnalyzeActivity = async (activityId)=>{
        try {
            const res = await fetch("/api/analysis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    activityId
                })
            });
            if (res.ok) {
                const data = await res.json();
                setActivityAnalysis((prev)=>({
                        ...prev,
                        [activityId]: data.analysis
                    }));
            }
        } catch (err) {
            console.error("Analysis failed:", err);
        }
    };
    const loadWeightForecast = async (raceId)=>{
        try {
            const res = await fetch(`/api/forecast?raceId=${raceId}`);
            if (res.ok) {
                const data = await res.json();
                setWeightForecast(data);
            }
        } catch (err) {
            console.error("Forecast failed:", err);
        }
    };
    // Compute burnout + guardrails (must be before early returns to satisfy React hook rules)
    const ctl = fitness?.ctl || athlete?.ctl || 42;
    const atl = fitness?.atl || athlete?.atl || 38;
    const tsb = fitness?.tsb ?? ctl - atl;
    // Calculate weekly TSS and duration
    const completedActivities = activities.filter((a)=>a.completed);
    const plannedActivities = activities.filter((a)=>a.planned);
    const actualTSS = completedActivities.reduce((sum, a)=>sum + (a.icu_training_load || 0), 0);
    const plannedTSS = plannedActivities.reduce((sum, a)=>sum + (a.tss || 0), 0);
    const actualDuration = completedActivities.reduce((sum, a)=>sum + (a.moving_time || 0), 0) / 60; // convert to minutes
    const plannedDuration = plannedActivities.reduce((sum, a)=>sum + (a.moving_time || 0), 0) / 60; // convert to minutes
    // Build week days array
    const today = new Date().toISOString().split("T")[0];
    const ws = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$intervals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekStart"])(); // returns "YYYY-MM-DD" string
    const weekDays = [];
    const dayLabels = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];
    for(let i = 0; i < 7; i++){
        const d = new Date(ws + "T00:00:00"); // convert string to Date with explicit time
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        const dayActivities = activities.filter((a)=>a.date === dateStr);
        weekDays.push({
            date: dateStr,
            label: dayLabels[i],
            isToday: dateStr === today,
            activities: dayActivities
        });
    }
    const energyValues = Object.values(energyLogs).filter((l)=>l.energy).map((l)=>l.energy);
    const avgEnergy = energyValues.length > 0 ? (energyValues.reduce((a, b)=>a + b, 0) / energyValues.length).toFixed(1) : null;
    const workStress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$guardrails$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateWorkStress"])(calendarData);
    const hrvValues = wellnessData.filter((w)=>w.hrv).map((w)=>w.hrv);
    const avg30HRV = hrvValues.length > 0 ? hrvValues.reduce((s, v)=>s + v, 0) / hrvValues.length : null;
    const hrvLast3 = hrvValues.slice(-3);
    const avg7HRV = hrvLast3.length > 0 ? hrvLast3.reduce((s, v)=>s + v, 0) / hrvLast3.length : null;
    const recentSleep = wellnessData.slice(-3).map((w)=>{
        if (!w.sleep_duration) return null;
        return w.sleep_duration > 100 ? w.sleep_duration / 60 : w.sleep_duration;
    });
    const avgSleep = recentSleep.filter(Boolean).length > 0 ? recentSleep.filter(Boolean).reduce((s, v)=>s + v, 0) / recentSleep.filter(Boolean).length : null;
    // Get latest weight from wellness data
    const weight = wellnessData.length > 0 && wellnessData[wellnessData.length - 1]?.weight ? wellnessData[wellnessData.length - 1].weight : athlete?.weight || 76.2;
    const burnout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$guardrails$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateBurnoutSignals"])({
        atl,
        ctl,
        tsb,
        avg7HRV,
        avg30HRV,
        avgSleep,
        workStress,
        avgEnergy: avgEnergy ? parseFloat(avgEnergy) : null,
        calendarConnected
    });
    const burnoutTotal = burnout.total;
    // Update guardrails when key data changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            if (loading) return;
            const todayDate = new Date().toISOString().split("T")[0];
            const todayDensity = calendarData[todayDate]?.density || "rest";
            const todayPlannedItems = activities.filter({
                "DashboardPage.useEffect.todayPlannedItems": (a)=>a.date === todayDate && a.planned
            }["DashboardPage.useEffect.todayPlannedItems"]);
            const todayPlanned = todayPlannedItems.length > 0 ? todayPlannedItems[0] : null;
            const todayEnergyLog = energyLogs[todayDate];
            const alerts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$guardrails$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runGuardrails"])({
                atl,
                ctl,
                tsb,
                hrvLast3,
                avg30HRV,
                recentSleep,
                todayWorkDensity: todayDensity,
                kneeStatus: todayEnergyLog?.knee_status || 0,
                todayPlanned,
                energyLog: todayEnergyLog,
                burnoutTotal
            });
            setGuardrailAlerts(alerts);
        }
    }["DashboardPage.useEffect"], [
        loading,
        activities,
        calendarData,
        energyLogs,
        wellnessData,
        ctl,
        atl,
        tsb
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 max-w-[1400px]",
        children: [
            checkInDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DailyCheckIn, {
                date: checkInDate,
                existing: energyLogs[checkInDate],
                onSave: handleSaveCheckIn,
                onClose: ()=>setCheckInDate(null)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 524,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-white",
                                children: "Weekly Command Center"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 528,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 mt-1",
                                children: [
                                    weekStart ? (()=>{
                                        const start = new Date(weekStart + "T00:00:00");
                                        const end = new Date(start.getTime() + 6 * 86400000);
                                        return `Week of ${start.toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short"
                                        })} – ${end.toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}`;
                                    })() : "Loading...",
                                    intervalsConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-emerald-400 ml-2",
                                        children: "● Training"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 535,
                                        columnNumber: 36
                                    }, this),
                                    calendarConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-blue-400 ml-2",
                                        children: "● Calendar"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 536,
                                        columnNumber: 35
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 529,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 527,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            avgEnergy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-400 bg-surface-850 border border-white/5 rounded-full px-3 py-1.5",
                                children: [
                                    "Energy: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-yellow-400 font-medium",
                                        children: avgEnergy
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 540,
                                        columnNumber: 134
                                    }, this),
                                    "/5"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 540,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBurnoutBg"])(burnoutTotal)}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `w-2 h-2 rounded-full ${burnoutTotal < 40 ? "bg-emerald-500" : burnoutTotal < 55 ? "bg-yellow-400" : burnoutTotal < 75 ? "bg-amber-500" : "bg-red-500"}`
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 542,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBurnoutColor"])(burnoutTotal),
                                        children: [
                                            "Burnout: ",
                                            burnoutTotal,
                                            "/100"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 543,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 541,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 539,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 526,
                columnNumber: 7
            }, this),
            guardrailAlerts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-medium text-gray-400",
                                children: "Active Alerts"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 552,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400",
                                children: guardrailAlerts.length
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 553,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/briefing",
                                className: "text-[10px] text-brand-400 ml-auto hover:underline",
                                children: "View full briefing"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 554,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 551,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            guardrailAlerts.slice(0, 2).map((alert)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `flex items-start gap-3 p-3 rounded-xl border ${alert.severity === "danger" ? "border-red-500/30 bg-red-500/5" : "border-amber-500/30 bg-amber-500/5"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-base",
                                            children: alert.icon
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.js",
                                            lineNumber: 561,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `text-xs font-medium ${alert.severity === "danger" ? "text-red-400" : "text-amber-400"}`,
                                                    children: alert.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.js",
                                                    lineNumber: 563,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-gray-400 mt-0.5",
                                                    children: alert.action
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.js",
                                                    lineNumber: 564,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.js",
                                            lineNumber: 562,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, alert.id, true, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 558,
                                    columnNumber: 15
                                }, this)),
                            guardrailAlerts.length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/briefing",
                                className: "text-[10px] text-gray-500 hover:text-brand-400 block text-center",
                                children: [
                                    "+",
                                    guardrailAlerts.length - 2,
                                    " more alerts"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 569,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 556,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 550,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TSSProgressBar, {
                        actual: actualTSS,
                        planned: plannedTSS,
                        label: "Weekly TSS"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 576,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TSSProgressBar, {
                        actual: Math.round(actualDuration),
                        planned: Math.round(plannedDuration),
                        label: "Weekly Duration (min)"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 577,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 575,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-7 gap-3 mb-6",
                children: weekDays.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DayCard, {
                        day: day,
                        isToday: day.isToday,
                        energyLog: energyLogs[day.date],
                        calendarDay: calendarData[day.date],
                        onCheckIn: setCheckInDate
                    }, day.date, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 582,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 580,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-12 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "col-span-8 space-y-4",
                        children: [
                            calendarConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkWeekSummary, {
                                calendarData: calendarData
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 588,
                                columnNumber: 33
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VolumeBreakdown, {
                                activities: activities,
                                planned: planned
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 589,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActivityAnalysis, {
                                activities: activities,
                                onAnalyze: handleAnalyzeActivity,
                                analysis: activityAnalysis
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 590,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-medium text-gray-400 mb-3",
                                        children: "Race Countdowns"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 592,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-4 gap-3",
                                        children: races.map((race)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RaceCountdown, {
                                                race: race,
                                                ctl: ctl
                                            }, race.id, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 594,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 593,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 591,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 587,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "col-span-4 space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-medium text-gray-400 mb-3",
                                children: [
                                    "Quick Stats ",
                                    intervalsConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-emerald-400 text-[10px]",
                                        children: "● live"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 599,
                                        columnNumber: 101
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 599,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-surface-850 border border-white/5 rounded-xl p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-gray-500 mb-1",
                                        children: "Fitness (CTL)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 600,
                                        columnNumber: 80
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-white",
                                        children: Math.round(ctl)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 600,
                                        columnNumber: 147
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 600,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-surface-850 border border-white/5 rounded-xl p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-gray-500 mb-1",
                                        children: "Fatigue (ATL)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 601,
                                        columnNumber: 80
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-white",
                                        children: Math.round(atl)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 601,
                                        columnNumber: 147
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 601,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-surface-850 border border-white/5 rounded-xl p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-gray-500 mb-1",
                                        children: "Form (TSB)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 602,
                                        columnNumber: 80
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `text-2xl font-bold ${tsb >= 0 ? "text-emerald-400" : "text-amber-400"}`,
                                        children: [
                                            tsb > 0 ? "+" : "",
                                            Math.round(tsb)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 602,
                                        columnNumber: 144
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 602,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-surface-850 border border-white/5 rounded-xl p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-gray-500 mb-1",
                                        children: "Weight"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 603,
                                        columnNumber: 80
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-white",
                                        children: [
                                            weight,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-normal text-gray-500",
                                                children: "kg"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 603,
                                                columnNumber: 195
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 603,
                                        columnNumber: 140
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-gray-500 mt-1",
                                        children: [
                                            "Target: ",
                                            athlete?.target_weight || 71,
                                            "kg"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 603,
                                        columnNumber: 262
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 603,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WeightForecast, {
                                races: races,
                                currentWeight: weight,
                                targetWeight: athlete?.target_weight || 71,
                                onLoadForecast: loadWeightForecast,
                                forecast: weightForecast
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 604,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 598,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 586,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.js",
        lineNumber: 523,
        columnNumber: 5
    }, this);
}
_s1(DashboardPage, "PDT9ncF9My08r1I8XTXDd63zVpQ=");
_c10 = DashboardPage;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "EnergyStars");
__turbopack_context__.k.register(_c1, "RatingRow");
__turbopack_context__.k.register(_c2, "DailyCheckIn");
__turbopack_context__.k.register(_c3, "DayCard");
__turbopack_context__.k.register(_c4, "TSSProgressBar");
__turbopack_context__.k.register(_c5, "VolumeBreakdown");
__turbopack_context__.k.register(_c6, "RaceCountdown");
__turbopack_context__.k.register(_c7, "WorkWeekSummary");
__turbopack_context__.k.register(_c8, "WeightForecast");
__turbopack_context__.k.register(_c9, "ActivityAnalysis");
__turbopack_context__.k.register(_c10, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_94b0ea5d._.js.map