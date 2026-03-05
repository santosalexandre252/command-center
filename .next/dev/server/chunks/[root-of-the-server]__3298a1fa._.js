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
"[project]/app/api/briefing/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/server.js [app-route] (ecmascript)");
;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const INTERVALS_API_KEY = process.env.INTERVALS_API_KEY;
const INTERVALS_ATHLETE_ID = process.env.INTERVALS_ATHLETE_ID;
const ICAL_URL = process.env.GOOGLE_CALENDAR_ICAL_URL;
async function intervalsRequest(endpoint) {
    if (!INTERVALS_API_KEY || !INTERVALS_ATHLETE_ID) return null;
    const auth = Buffer.from(`API_KEY:${INTERVALS_API_KEY}`).toString("base64");
    try {
        const res = await fetch(`https://intervals.icu/api/v1${endpoint}`, {
            headers: {
                Authorization: `Basic ${auth}`,
                Accept: "application/json"
            },
            next: {
                revalidate: 300
            }
        });
        if (!res.ok) return null;
        return res.json();
    } catch  {
        return null;
    }
}
function getToday() {
    return new Date().toISOString().split("T")[0];
}
function getDateOffset(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
}
// Parse iCal (simplified — same logic as calendar/route.js)
function parseICalDate(str) {
    if (!str) return null;
    if (str.length === 8) return new Date(`${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}T00:00:00`);
    if (str.includes("T")) {
        const d = str.replace(/Z$/, "");
        return new Date(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${d.slice(9, 11)}:${d.slice(11, 13)}:${d.slice(13, 15)}${str.endsWith("Z") ? "Z" : ""}`);
    }
    return null;
}
function parseICal(text, targetDate) {
    const events = [];
    const lines = [];
    for (const raw of text.split(/\r?\n/)){
        if (raw.startsWith(" ") || raw.startsWith("\t")) {
            if (lines.length > 0) lines[lines.length - 1] += raw.slice(1);
        } else lines.push(raw);
    }
    let current = null;
    for (const line of lines){
        if (line === "BEGIN:VEVENT") current = {};
        else if (line === "END:VEVENT" && current) {
            events.push(current);
            current = null;
        } else if (current) {
            const ci = line.indexOf(":");
            if (ci === -1) continue;
            const key = line.slice(0, ci).split(";")[0];
            const val = line.slice(ci + 1);
            if (key === "SUMMARY") current.title = val;
            else if (key === "DTSTART") current.start = parseICalDate(val);
            else if (key === "DTEND") current.end = parseICalDate(val);
        }
    }
    return events.filter((e)=>e.start && e.start.toISOString().split("T")[0] === targetDate);
}
function classifyDensity(events) {
    const totalHours = events.reduce((sum, e)=>{
        if (e.start && e.end) return sum + (e.end - e.start) / 3600000;
        return sum + 1;
    }, 0);
    const hasTravel = events.some((e)=>e.title && /travel|flight|airport|train|drive to|trip/i.test(e.title));
    if (hasTravel) return "travel";
    if (totalHours >= 6 || events.length >= 6) return "heavy";
    if (totalHours >= 3 || events.length >= 3) return "medium";
    if (events.length >= 1) return "light";
    return "rest";
}
async function GET() {
    const today = getToday();
    // Fetch all data in parallel
    const [wellness30, wellness3, activitiesWeek, plannedToday, calendarText] = await Promise.all([
        intervalsRequest(`/athlete/${INTERVALS_ATHLETE_ID}/wellness?oldest=${getDateOffset(-30)}&newest=${today}`),
        intervalsRequest(`/athlete/${INTERVALS_ATHLETE_ID}/wellness?oldest=${getDateOffset(-3)}&newest=${today}`),
        intervalsRequest(`/athlete/${INTERVALS_ATHLETE_ID}/activities?oldest=${getDateOffset(-7)}&newest=${today}`),
        intervalsRequest(`/athlete/${INTERVALS_ATHLETE_ID}/events?oldest=${today}&newest=${getDateOffset(1)}`),
        ICAL_URL ? fetch(ICAL_URL, {
            next: {
                revalidate: 300
            }
        }).then((r)=>r.ok ? r.text() : null).catch(()=>null) : null
    ]);
    // Latest wellness
    const latest = wellness30 && wellness30.length > 0 ? wellness30[wellness30.length - 1] : {};
    const findLatest = (field)=>{
        if (!wellness30) return null;
        for(let i = wellness30.length - 1; i >= 0; i--){
            if (wellness30[i][field] !== null && wellness30[i][field] !== undefined) return wellness30[i][field];
        }
        return null;
    };
    const ctl = findLatest("ctl");
    const atl = findLatest("atl");
    const tsb = ctl && atl ? ctl - atl : null;
    const hrv = findLatest("hrv");
    const restingHR = findLatest("restingHR");
    const weight = findLatest("weight");
    const sleepLast = findLatest("sleepTime");
    // HRV: 3-day values and 30-day avg
    const hrvValues30 = (wellness30 || []).filter((w)=>w.hrv).map((w)=>w.hrv);
    const avg30HRV = hrvValues30.length > 0 ? hrvValues30.reduce((s, v)=>s + v, 0) / hrvValues30.length : null;
    const hrvLast3 = (wellness3 || []).filter((w)=>w.hrv).map((w)=>w.hrv).slice(-3);
    // Sleep: last 3 nights
    const recentSleep = (wellness3 || []).map((w)=>{
        if (!w.sleepTime) return null;
        return w.sleepTime > 100 ? w.sleepTime / 60 : w.sleepTime;
    }).slice(-3);
    // Calendar
    let todayEvents = [];
    let todayDensity = "rest";
    if (calendarText) {
        todayEvents = parseICal(calendarText, today);
        todayDensity = classifyDensity(todayEvents);
    }
    // Planned workout
    const planned = (plannedToday || []).filter((e)=>{
        const d = e.start_date_local?.split("T")[0];
        return d === today;
    });
    const todayPlanned = planned.length > 0 ? {
        name: planned[0].name || planned[0].category || "Workout",
        category: planned[0].category,
        duration: planned[0].moving_time,
        load_target: planned[0].icu_training_load
    } : null;
    // Recent activities for context
    const recentActivities = (activitiesWeek || []).map((a)=>({
            date: a.start_date_local?.split("T")[0],
            name: a.name,
            type: a.type,
            duration_min: a.moving_time ? Math.round(a.moving_time / 60) : null,
            distance_km: a.distance ? (a.distance / 1000).toFixed(1) : null,
            tss: a.icu_training_load,
            avg_hr: a.average_heartrate
        }));
    // Build briefing data
    const briefingData = {
        date: today,
        wellness: {
            ctl,
            atl,
            tsb,
            hrv,
            restingHR,
            weight,
            sleepLast
        },
        hrvAnalysis: {
            hrvLast3,
            avg30HRV
        },
        recentSleep,
        calendar: {
            events: todayEvents.map((e)=>({
                    title: e.title,
                    start: e.start?.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    }),
                    end: e.end?.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    })
                })),
            density: todayDensity,
            eventCount: todayEvents.length
        },
        todayPlanned,
        recentActivities
    };
    // Generate AI recommendation if Groq is configured
    let aiRecommendation = null;
    if (GROQ_API_KEY) {
        const todayStr = new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
        const prompt = `You are Alexandre Santos's AI training coach. Generate a brief morning briefing for ${todayStr}.

CURRENT STATE:
- CTL (Fitness): ${ctl ? Math.round(ctl) : "unknown"} | ATL (Fatigue): ${atl ? Math.round(atl) : "unknown"} | TSB (Form): ${tsb !== null ? Math.round(tsb) : "unknown"}
- Last HRV: ${hrv || "unknown"}ms | 3-day HRV avg: ${hrvLast3.length > 0 ? Math.round(hrvLast3.reduce((s, v)=>s + v, 0) / hrvLast3.length) : "unknown"}ms | 30-day HRV avg: ${avg30HRV ? Math.round(avg30HRV) : "unknown"}ms
- Resting HR: ${restingHR || "unknown"}bpm | Weight: ${weight || "unknown"}kg
- Last sleep: ${sleepLast ? (sleepLast > 100 ? (sleepLast / 60).toFixed(1) : sleepLast) + "h" : "unknown"}
- Recent sleep (last 3 nights): ${recentSleep.filter(Boolean).map((s)=>s.toFixed(1) + "h").join(", ") || "unknown"}

TODAY'S SCHEDULE:
- Work: ${todayDensity} day (${todayEvents.length} meetings${todayEvents.length > 0 ? ": " + todayEvents.map((e)=>e.title).join(", ") : ""})
- Planned training: ${todayPlanned ? `${todayPlanned.name} (~${todayPlanned.duration ? Math.round(todayPlanned.duration / 60) + "min" : "?"}, TSS ~${todayPlanned.load_target || "?"})` : "Rest day / no planned session"}

RECENT TRAINING (last 7 days):
${recentActivities.map((a)=>`- ${a.date}: ${a.name} (${a.type}) ${a.duration_min || "?"}min ${a.distance_km ? a.distance_km + "km" : ""} TSS:${a.tss || "?"}`).join("\n") || "No recent activities"}

ATHLETE CONTEXT:
- 29 years old, multi-sport (run/trail/bike/gym). FTP 181W, threshold pace 5:07-5:28/km.
- Right knee ACL surgery ~2 years ago.
- Next race: Aveiro Half Marathon, 26 Apr 2026 (A-race, target CTL 55).
- Gym rotation: A (Legs), B (Back+Shoulders), D (Legs), C (Chest+Arms+Core).
- ACL swaps on high fatigue: Bulgarian split squat → step-ups/reverse lunges. Lever leg ext → terminal knee ext/wall sits.

INSTRUCTIONS:
1. Give a ONE-PARAGRAPH recommendation (3-5 sentences max): should he train as planned, swap the session, modify intensity, or rest?
2. If it's a leg day and fatigue signals are elevated, mention specific ACL-safe exercise swaps.
3. Be direct and actionable. Start with the decision: "Train as planned", "Swap to...", "Modify: ...", or "Rest today".
4. End with one specific tip for the day (recovery, nutrition, or mindset).`;
        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.6,
                    max_tokens: 512
                })
            });
            if (res.ok) {
                const data = await res.json();
                aiRecommendation = data.choices?.[0]?.message?.content || null;
            }
        } catch (err) {
            console.error("Briefing AI error:", err);
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ...briefingData,
        aiRecommendation
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3298a1fa._.js.map