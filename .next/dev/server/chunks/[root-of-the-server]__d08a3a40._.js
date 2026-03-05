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
"[project]/app/api/calendar/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/server.js [app-route] (ecmascript)");
;
const ICAL_URL = process.env.GOOGLE_CALENDAR_ICAL_URL;
function parseICalDate(str) {
    if (!str) return null;
    // Handle YYYYMMDD format
    if (str.length === 8) {
        return new Date(`${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}T00:00:00`);
    }
    // Handle YYYYMMDDTHHMMSSZ or YYYYMMDDTHHMMSS
    if (str.includes("T")) {
        const d = str.replace(/Z$/, "");
        return new Date(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${d.slice(9, 11)}:${d.slice(11, 13)}:${d.slice(13, 15)}${str.endsWith("Z") ? "Z" : ""}`);
    }
    return null;
}
function parseICal(text) {
    const events = [];
    const lines = [];
    // Unfold lines (iCal wraps long lines with leading space/tab)
    for (const raw of text.split(/\r?\n/)){
        if (raw.startsWith(" ") || raw.startsWith("\t")) {
            if (lines.length > 0) lines[lines.length - 1] += raw.slice(1);
        } else {
            lines.push(raw);
        }
    }
    let current = null;
    for (const line of lines){
        if (line === "BEGIN:VEVENT") {
            current = {};
        } else if (line === "END:VEVENT" && current) {
            events.push(current);
            current = null;
        } else if (current) {
            const colonIdx = line.indexOf(":");
            if (colonIdx === -1) continue;
            const keyPart = line.slice(0, colonIdx);
            const value = line.slice(colonIdx + 1);
            const key = keyPart.split(";")[0]; // strip params like DTSTART;VALUE=DATE
            switch(key){
                case "SUMMARY":
                    current.title = value;
                    break;
                case "DTSTART":
                    current.start = parseICalDate(value);
                    break;
                case "DTEND":
                    current.end = parseICalDate(value);
                    break;
                case "LOCATION":
                    current.location = value;
                    break;
                case "DESCRIPTION":
                    current.description = value?.slice(0, 200);
                    break;
                case "UID":
                    current.uid = value;
                    break;
            }
        }
    }
    return events;
}
function classifyDensity(events) {
    // Classify a day's density based on number and duration of meetings
    const totalHours = events.reduce((sum, e)=>{
        if (e.start && e.end) {
            return sum + (e.end - e.start) / (1000 * 60 * 60);
        }
        return sum + 1; // assume 1h for all-day or unknown
    }, 0);
    const hasTravel = events.some((e)=>e.title && /travel|flight|airport|train|drive to|trip/i.test(e.title) || e.location && e.location.length > 30);
    if (hasTravel) return "travel";
    if (totalHours >= 6 || events.length >= 6) return "heavy";
    if (totalHours >= 3 || events.length >= 3) return "medium";
    if (events.length >= 1) return "light";
    return "rest";
}
async function GET(request) {
    if (!ICAL_URL) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Google Calendar iCal URL not configured"
        }, {
            status: 500
        });
    }
    try {
        const { searchParams } = new URL(request.url);
        const oldest = searchParams.get("oldest") || new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
        const newest = searchParams.get("newest") || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
        const res = await fetch(ICAL_URL, {
            next: {
                revalidate: 300
            }
        }); // cache 5 min
        if (!res.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to fetch calendar"
            }, {
                status: 502
            });
        }
        const text = await res.text();
        const allEvents = parseICal(text);
        // Filter to date range
        const startDate = new Date(oldest + "T00:00:00");
        const endDate = new Date(newest + "T23:59:59");
        const filtered = allEvents.filter((e)=>e.start && e.start >= startDate && e.start <= endDate).map((e)=>({
                uid: e.uid,
                title: e.title || "Busy",
                start: e.start?.toISOString(),
                end: e.end?.toISOString(),
                date: e.start?.toISOString().split("T")[0],
                startTime: e.start?.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }),
                endTime: e.end?.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }),
                location: e.location || null,
                isAllDay: e.start && !e.end ? true : e.end - e.start >= 23 * 60 * 60 * 1000
            })).sort((a, b)=>new Date(a.start) - new Date(b.start));
        // Group by date and calculate density
        const byDate = {};
        filtered.forEach((e)=>{
            if (!byDate[e.date]) byDate[e.date] = [];
            byDate[e.date].push(e);
        });
        const dailySummary = {};
        Object.entries(byDate).forEach(([date, events])=>{
            dailySummary[date] = {
                events,
                count: events.length,
                density: classifyDensity(events)
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            events: filtered,
            dailySummary
        });
    } catch (err) {
        console.error("Calendar error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d08a3a40._.js.map