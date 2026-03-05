"use client";
import { useState, useEffect } from "react";
import { getIntervalsActivities, getIntervalsPlannedWorkouts, getWeekStart, getWeekEnd } from "../../lib/intervals";
import { getRaces, getSupplementLog, upsertSupplementLog } from "../../lib/db";
import { daysUntil } from "../../lib/utils";

const defaultSupplements = [
  { name: "Creatine (Nduranz)", time: "Post-workout", id: "creatine" },
  { name: "Nduranz Electrolytes", time: "During training", id: "electrolytes" },
  { name: "Nduranz Nrgy Unit Drink", time: "Pre/during long sessions", id: "nrgy" },
  { name: "Protein (post-workout)", time: "Within 30min post", id: "protein" },
];

const fuellingRules = {
  easy_short: {
    label: "Easy / Short Session (<60min)",
    pre: { what: "Light snack + water", when: "30-60min before", emoji: "🍌" },
    during: { what: "Water only — no fuel needed", when: "Sip as needed", emoji: "💧" },
    post: { what: "Normal meal + Nduranz creatine", when: "Within 1 hour", emoji: "🍽️" },
  },
  moderate: {
    label: "Moderate Session (60-90min, Z2-Z3)",
    pre: { what: "Nduranz Nrgy Unit Drink (45g carbs) + banana", when: "1-2h before", emoji: "🍌" },
    during: { what: "Water + electrolytes. Gel only if >75min", when: "Sip every 15min", emoji: "💧" },
    post: { what: "Nduranz Recovery mix + meal within 1h + creatine", when: "Within 30min", emoji: "🥤" },
  },
  hard: {
    label: "Hard Session (intervals, tempo, Z4+)",
    pre: { what: "Nduranz Nrgy Unit Drink (90g carbs) + toast with honey", when: "2h before", emoji: "🍯" },
    during: { what: "Nduranz Gel (45g carbs) at 30min mark. Electrolyte drink throughout", when: "Every 30min", emoji: "⚡" },
    post: { what: "Nduranz Recovery mix immediately + full meal within 1h + creatine", when: "Within 15min", emoji: "🥤" },
  },
  long: {
    label: "Long Session (>90min, endurance)",
    pre: { what: "Nduranz Nrgy Unit Drink (90g carbs) + porridge with fruit", when: "2-3h before", emoji: "🥣" },
    during: { what: "Nduranz Gel every 30min (45g carbs each) + Nrgy Unit Drink. Target 60-90g carbs/hr", when: "Start at 30min", emoji: "⚡" },
    post: { what: "Nduranz Recovery mix + large carb-rich meal + creatine + extra protein", when: "Within 15min", emoji: "🥤" },
  },
  gym: {
    label: "Gym / Strength Session",
    pre: { what: "Light snack with protein + coffee optional", when: "30-60min before", emoji: "☕" },
    during: { what: "Water + electrolytes. BCAAs optional", when: "Sip throughout", emoji: "💧" },
    post: { what: "Protein shake or meal (30g+ protein) + creatine + carbs", when: "Within 30min", emoji: "🥤" },
  },
  rest: {
    label: "Rest Day",
    pre: { what: "Normal balanced meals", when: "Throughout day", emoji: "🍽️" },
    during: { what: "Stay hydrated — 2-3L water", when: "All day", emoji: "💧" },
    post: { what: "Creatine with dinner", when: "Evening", emoji: "💊" },
  },
};

function classifySession(activity) {
  if (!activity) return "rest";
  const type = activity.type || activity.category || "";
  const tss = activity.tss || activity.load_target || 0;
  const duration = activity.moving_time ? activity.moving_time / 60 : (activity.duration ? activity.duration / 60 : 0);

  if (type === "WeightTraining" || type.toLowerCase().includes("gym") || type.toLowerCase().includes("weight")) return "gym";
  if (duration > 90 || tss > 80) return "long";
  if (tss > 50 || (activity.name && /interval|tempo|threshold|speed|vo2/i.test(activity.name))) return "hard";
  if (duration > 45 || tss > 25) return "moderate";
  return "easy_short";
}

function FuellingCard({ label, emoji, what, when }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-surface-900 rounded-lg">
      <span className="text-xl">{emoji}</span>
      <div>
        <div className="text-[10px] font-bold text-gray-500 mb-0.5">{label} · {when}</div>
        <div className="text-sm text-gray-200">{what}</div>
      </div>
    </div>
  );
}

function SupplementChecklist({ date }) {
  const [checks, setChecks] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const log = await getSupplementLog(date);
      if (log?.supplements) {
        const map = {};
        log.supplements.forEach((s) => { map[s.id] = s.taken; });
        setChecks(map);
      }
      setLoaded(true);
    }
    load();
  }, [date]);

  const toggle = async (id) => {
    const updated = { ...checks, [id]: !checks[id] };
    setChecks(updated);
    const supplements = defaultSupplements.map((s) => ({ id: s.id, name: s.name, taken: !!updated[s.id] }));
    await upsertSupplementLog({ date, supplements });
  };

  if (!loaded) return null;

  const takenCount = Object.values(checks).filter(Boolean).length;

  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-300">Daily Supplements</h2>
        <span className="text-[10px] text-gray-500">{takenCount}/{defaultSupplements.length} done</span>
      </div>
      <div className="space-y-2">
        {defaultSupplements.map((supp) => (
          <label key={supp.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
            <input
              type="checkbox"
              checked={!!checks[supp.id]}
              onChange={() => toggle(supp.id)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-brand-500 focus:ring-brand-500"
            />
            <div>
              <div className={`text-sm ${checks[supp.id] ? "text-gray-400 line-through" : "text-gray-200"}`}>{supp.name}</div>
              <div className="text-[10px] text-gray-500">{supp.time}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function WeekFuellingOverview({ weekSessions }) {
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
      <h2 className="text-sm font-medium text-gray-300 mb-4">This Week's Fuelling Load</h2>
      <div className="grid grid-cols-7 gap-2">
        {dayLabels.map((label, i) => {
          const session = weekSessions[i];
          const cls = classifySession(session);
          const colors = {
            rest: "bg-gray-800 text-gray-500",
            easy_short: "bg-emerald-500/10 text-emerald-400",
            moderate: "bg-blue-500/10 text-blue-400",
            hard: "bg-orange-500/10 text-orange-400",
            long: "bg-red-500/10 text-red-400",
            gym: "bg-purple-500/10 text-purple-400",
          };
          const carbNeeds = { rest: "Low", easy_short: "Low", moderate: "Medium", hard: "High", long: "Very High", gym: "Medium" };
          return (
            <div key={label} className={`rounded-lg p-2 text-center ${colors[cls]}`}>
              <div className="text-[10px] font-medium">{label}</div>
              <div className="text-[9px] mt-1">{session?.name ? (session.name.length > 12 ? session.name.slice(0, 12) + "…" : session.name) : "Rest"}</div>
              <div className="text-[9px] mt-1 opacity-70">{carbNeeds[cls]}</div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-3 text-[9px] text-gray-500 justify-center">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/30"></span>Low carbs</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500/30"></span>Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-orange-500/30"></span>High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500/30"></span>Very High</span>
      </div>
    </div>
  );
}

function RaceFuellingQuickLink({ race }) {
  const days = daysUntil(race.date);
  const typeLabels = { road_run: "🏃 Road", trail: "⛰️ Trail", cycling: "🚴 Cycling" };
  return (
    <a href={`/race/${race.id}`} className="flex items-center justify-between p-3 bg-surface-900 rounded-lg hover:bg-surface-800 transition-colors">
      <div>
        <div className="text-sm text-gray-200">{race.short_name}</div>
        <div className="text-[10px] text-gray-500">{typeLabels[race.type] || "🏅"} · {race.distance}km · {days} days</div>
      </div>
      <span className="text-[10px] text-brand-400">Generate plan →</span>
    </a>
  );
}

export default function FuellingPage() {
  const [todaySession, setTodaySession] = useState(null);
  const [weekSessions, setWeekSessions] = useState([]);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function load() {
      const weekStart = getWeekStart();
      const weekEnd = getWeekEnd();

      const [activities, planned, raceData] = await Promise.all([
        getIntervalsActivities(weekStart, weekEnd),
        getIntervalsPlannedWorkouts(weekStart, weekEnd),
        getRaces(),
      ]);

      // Merge completed + planned
      const completedByDate = {};
      (activities || []).forEach((a) => { completedByDate[a.date] = a; });
      const plannedByDate = {};
      (planned || []).forEach((p) => { if (!completedByDate[p.date]) plannedByDate[p.date] = p; });

      // Build week array
      const start = new Date(weekStart);
      const week = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        week.push(completedByDate[dateStr] || plannedByDate[dateStr] || null);
      }
      setWeekSessions(week);

      // Today's session
      setTodaySession(completedByDate[today] || plannedByDate[today] || null);
      setRaces(raceData || []);
      setLoading(false);
    }
    load();
  }, []);

  const sessionClass = classifySession(todaySession);
  const fuelling = fuellingRules[sessionClass];

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-64"><div className="text-gray-500 text-sm">Loading fuelling data...</div></div>;
  }

  return (
    <div className="p-6 max-w-[1400px]">
      <h1 className="text-2xl font-bold text-white mb-2">Fuelling & Nutrition</h1>
      <p className="text-sm text-gray-500 mb-6">
        Session-specific fuelling, supplements & race nutrition
        <span className="text-emerald-400 ml-2">● auto-matched to today's session</span>
      </p>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Today's fuelling */}
        <div className="col-span-7 space-y-4">
          <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-medium text-gray-300">Today's Fuelling Plan</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                sessionClass === "rest" ? "bg-gray-700/50 text-gray-400" :
                sessionClass === "easy_short" ? "bg-emerald-500/10 text-emerald-400" :
                sessionClass === "moderate" ? "bg-blue-500/10 text-blue-400" :
                sessionClass === "hard" ? "bg-orange-500/10 text-orange-400" :
                sessionClass === "long" ? "bg-red-500/10 text-red-400" :
                "bg-purple-500/10 text-purple-400"
              }`}>{fuelling.label}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {todaySession ? `${todaySession.name || todaySession.category || "Workout"} · ${todaySession.moving_time ? Math.round(todaySession.moving_time / 60) + "min" : todaySession.duration ? Math.round(todaySession.duration / 60) + "min" : ""} ${todaySession.tss ? "· TSS " + Math.round(todaySession.tss) : todaySession.load_target ? "· TSS ~" + Math.round(todaySession.load_target) : ""}` : "No session scheduled — rest day fuelling"}
            </p>

            <div className="space-y-3">
              <FuellingCard label="PRE" emoji={fuelling.pre.emoji} what={fuelling.pre.what} when={fuelling.pre.when} />
              <FuellingCard label="DURING" emoji={fuelling.during.emoji} what={fuelling.during.what} when={fuelling.during.when} />
              <FuellingCard label="POST" emoji={fuelling.post.emoji} what={fuelling.post.what} when={fuelling.post.when} />
            </div>
          </div>

          {/* Week overview */}
          <WeekFuellingOverview weekSessions={weekSessions} />
        </div>

        {/* Right: Supplements + race links */}
        <div className="col-span-5 space-y-4">
          <SupplementChecklist date={today} />

          <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-300 mb-4">Race Fuelling Plans</h2>
            <p className="text-xs text-gray-500 mb-3">Generate AI-powered race-day nutrition timelines with your Nduranz products.</p>
            <div className="space-y-2">
              {races.filter((r) => daysUntil(r.date) > 0).map((race) => (
                <RaceFuellingQuickLink key={race.id} race={race} />
              ))}
            </div>
          </div>

          <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-300 mb-3">Daily Targets</h2>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-surface-900 rounded-lg">
                <span className="text-xs text-gray-400">Water</span>
                <span className="text-xs text-gray-200">2.5-3L / day</span>
              </div>
              <div className="flex justify-between p-2 bg-surface-900 rounded-lg">
                <span className="text-xs text-gray-400">Protein</span>
                <span className="text-xs text-gray-200">1.6-2.0g/kg = 122-152g</span>
              </div>
              <div className="flex justify-between p-2 bg-surface-900 rounded-lg">
                <span className="text-xs text-gray-400">Carbs ({sessionClass === "rest" || sessionClass === "easy_short" ? "low day" : "training day"})</span>
                <span className="text-xs text-gray-200">
                  {sessionClass === "rest" || sessionClass === "easy_short" ? "3-5g/kg = 228-380g" : sessionClass === "long" ? "7-10g/kg = 533-762g" : "5-7g/kg = 380-533g"}
                </span>
              </div>
              <div className="flex justify-between p-2 bg-surface-900 rounded-lg">
                <span className="text-xs text-gray-400">Calories (est.)</span>
                <span className="text-xs text-gray-200">
                  {sessionClass === "rest" ? "~2,200" : sessionClass === "easy_short" ? "~2,400" : sessionClass === "long" ? "~3,200" : "~2,800"} kcal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
