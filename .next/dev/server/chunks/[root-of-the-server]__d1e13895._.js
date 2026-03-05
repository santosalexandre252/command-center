module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/intervals.js [app-route] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/lib/supabase.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$98$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+supabase-js@2.98.0/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://wfnwvtrrccfazgwejrlm.supabase.co") || "https://placeholder.supabase.co";
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmbnd2dHJyY2NmYXpnd2VqcmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDI2ODIsImV4cCI6MjA4ODIxODY4Mn0.olssTnjNqzmAWy_mkriVwAu2fmoNLaAo6hzj7TQWFkw") || "placeholder";
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$98$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
}),
"[project]/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.js [app-route] (ecmascript)");
;
async function getAthleteProfile() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("athlete_profile").select("*").limit(1).single();
    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
    return data;
}
async function updateAthleteProfile(updates) {
    const { data: current } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("athlete_profile").select("id").limit(1).single();
    if (!current) return null;
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("athlete_profile").update(updates).eq("id", current.id).select().single();
    if (error) console.error("Error updating profile:", error);
    return data;
}
async function getRaces() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("races").select("*").order("date", {
        ascending: true
    });
    if (error) {
        console.error("Error fetching races:", error);
        return [];
    }
    return data;
}
async function getRaceById(id) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("races").select("*").eq("id", id).single();
    if (error) {
        console.error("Error fetching race:", error);
        return null;
    }
    return data;
}
async function getEnergyLog(date) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("energy_logs").select("*").eq("date", date).single();
    if (error && error.code !== "PGRST116") console.error("Error fetching energy:", error);
    return data;
}
async function getEnergyLogsRange(startDate, endDate) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("energy_logs").select("*").gte("date", startDate).lte("date", endDate).order("date");
    if (error) {
        console.error("Error fetching energy range:", error);
        return [];
    }
    return data;
}
async function upsertEnergyLog(log) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("energy_logs").upsert(log, {
        onConflict: "date"
    }).select().single();
    if (error) console.error("Error saving energy:", error);
    return data;
}
async function getLatestBurnout() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("burnout_scores").select("*").order("date", {
        ascending: false
    }).limit(1).single();
    if (error && error.code !== "PGRST116") console.error("Error fetching burnout:", error);
    return data;
}
async function upsertBurnoutScore(score) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("burnout_scores").upsert(score, {
        onConflict: "date"
    }).select().single();
    if (error) console.error("Error saving burnout:", error);
    return data;
}
async function getChatMessages(limit = 50) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("chat_messages").select("*").order("created_at", {
        ascending: true
    }).limit(limit);
    if (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
    return data;
}
async function addChatMessage(message) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("chat_messages").insert(message).select().single();
    if (error) console.error("Error saving message:", error);
    return data;
}
async function getSupplementLog(date) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("supplement_logs").select("*").eq("date", date).single();
    if (error && error.code !== "PGRST116") console.error("Error fetching supplements:", error);
    return data;
}
async function upsertSupplementLog(log) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("supplement_logs").upsert(log, {
        onConflict: "date"
    }).select().single();
    if (error) console.error("Error saving supplement log:", error);
    return data;
}
async function addGymSession(session) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("gym_sessions").insert(session).select().single();
    if (error) console.error("Error saving gym session:", error);
    return data;
}
}),
"[project]/app/api/forecast/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$intervals$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/intervals.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [app-route] (ecmascript)");
;
;
;
function calculateWeightTrend(weights, dates) {
    if (weights.length < 2) return {
        slope: 0,
        direction: "stable",
        rate: 0
    };
    // Simple linear regression
    const n = weights.length;
    const sumX = dates.reduce((s, d, i)=>s + i, 0);
    const sumY = weights.reduce((s, w)=>s + w, 0);
    const sumXY = dates.reduce((s, d, i)=>s + i * weights[i], 0);
    const sumXX = dates.reduce((s, d, i)=>s + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const rate = slope * 7; // kg per week
    let direction = "stable";
    if (Math.abs(rate) < 0.1) direction = "stable";
    else if (rate > 0) direction = "gaining";
    else direction = "losing";
    return {
        slope,
        direction,
        rate: Math.abs(rate)
    };
}
function forecastWeight(currentWeight, trend, targetWeight, raceDate) {
    const daysToRace = Math.ceil((new Date(raceDate) - new Date()) / (1000 * 60 * 60 * 24));
    const weeksToRace = daysToRace / 7;
    // Project weight at race date
    const projectedWeight = currentWeight + trend.rate * weeksToRace * (trend.direction === "gaining" ? 1 : -1);
    // Calculate if target will be met
    const willMeetTarget = trend.direction === "losing" ? projectedWeight <= targetWeight : projectedWeight >= targetWeight;
    // Calculate required weekly rate to meet target
    const weightDiff = targetWeight - currentWeight;
    const requiredRate = Math.abs(weightDiff) / weeksToRace;
    return {
        projectedWeight: Math.round(projectedWeight * 10) / 10,
        willMeetTarget,
        requiredWeeklyRate: Math.round(requiredRate * 10) / 10,
        daysToRace,
        currentTrend: trend
    };
}
function generateRecommendations(forecast, athlete) {
    const recommendations = [];
    if (!forecast.willMeetTarget) {
        const direction = forecast.projectedWeight > athlete.target_weight ? "lose" : "gain";
        const weeklyNeeded = forecast.requiredWeeklyRate;
        if (direction === "lose") {
            recommendations.push({
                type: "caloric_deficit",
                title: "Caloric Deficit Required",
                action: `Need to create ~${Math.round(weeklyNeeded * 7700)} kcal weekly deficit (${Math.round(weeklyNeeded * 1100)} kcal/day)`,
                priority: "high"
            });
            if (athlete.current_weight > athlete.target_weight + 5) {
                recommendations.push({
                    type: "training_adjustment",
                    title: "Consider Training Load",
                    action: "High training volume may hinder weight loss. Consider 1-2 easier weeks",
                    priority: "medium"
                });
            }
        } else {
            recommendations.push({
                type: "caloric_surplus",
                title: "Caloric Surplus Required",
                action: `Need to create ~${Math.round(weeklyNeeded * 7700)} kcal weekly surplus (${Math.round(weeklyNeeded * 1100)} kcal/day)`,
                priority: "high"
            });
        }
    }
    // General recommendations
    if (forecast.currentTrend.direction === "stable") {
        recommendations.push({
            type: "monitoring",
            title: "Weight Stable",
            action: "Continue current nutrition and training. Monitor weekly weigh-ins",
            priority: "low"
        });
    }
    if (forecast.daysToRace < 30) {
        recommendations.push({
            type: "race_prep",
            title: "Race Prep Focus",
            action: "Focus on race-specific training. Weight goals secondary to performance",
            priority: "medium"
        });
    }
    return recommendations;
}
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const raceId = searchParams.get("raceId");
        if (!raceId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Race ID required"
            }, {
                status: 400
            });
        }
        // Get athlete profile and race data
        const athlete = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAthleteProfile"])();
        const races = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAthleteProfile"])(); // This should be getRaces() but using profile for now
        const race = races?.races?.find((r)=>r.id === raceId);
        if (!race || !athlete) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Race or athlete data not found"
            }, {
                status: 404
            });
        }
        // Get recent weight data (last 4 weeks)
        const wellness = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$intervals$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIntervalsWellness"])();
        const recentWeights = wellness.filter((w)=>w.weight && w.date).sort((a, b)=>new Date(b.date) - new Date(a.date)).slice(0, 28) // Last 28 days
        .reverse(); // Chronological order
        if (recentWeights.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No weight data available",
                forecast: null,
                recommendations: [
                    {
                        type: "data_collection",
                        title: "Weight Data Needed",
                        action: "Start logging weight daily in Intervals.icu for accurate forecasting",
                        priority: "high"
                    }
                ]
            });
        }
        const weights = recentWeights.map((w)=>w.weight);
        const dates = recentWeights.map((w, i)=>i); // Days from start
        const trend = calculateWeightTrend(weights, dates);
        const currentWeight = weights[weights.length - 1];
        const targetWeight = athlete.target_weight || race.target_weight || athlete.weight - 5;
        const forecast = forecastWeight(currentWeight, trend, targetWeight, race.date);
        const recommendations = generateRecommendations(forecast, {
            ...athlete,
            target_weight: targetWeight,
            current_weight: currentWeight
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            race: {
                id: race.id,
                name: race.name,
                date: race.date,
                target_weight: targetWeight
            },
            currentWeight,
            trend,
            forecast,
            recommendations,
            dataPoints: recentWeights.length,
            lastUpdated: recentWeights[recentWeights.length - 1]?.date
        });
    } catch (err) {
        console.error("Forecast error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to generate forecast"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d1e13895._.js.map