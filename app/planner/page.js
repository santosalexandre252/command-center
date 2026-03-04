"use client";
import { useState, useEffect, useMemo } from "react";
import { getIntervalsActivities, getIntervalsPlannedWorkouts } from "../../lib/intervals";
import { getRaces, getEnergyLogsRange } from "../../lib/db";

const typeIcons = { Run: "🏃", Ride: "🚴", WeightTraining: "🏋️", VirtualRide: "🚴", Walk: "🚶", Swim: "🏊", Hike: "⛰️" };
const typeColors = {
  Run: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Ride: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  WeightTraining: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  VirtualRide: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Swim: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

function MonthNav({ month, year, onChange }) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const prev = () => {
    if (month === 0) onChange(11, year - 1);
    else onChange(month - 1, year);
  };
  const next = () => {
    if (month === 11) onChange(0, year + 1);
    else onChange(month + 1, year);
  };
  const goToday = () => {
    const now = new Date();
    onChange(now.getMonth(), now.getFullYear());
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={prev} className="px-3 py-1.5 bg-surface-850 text-gray-400 text-sm rounded-lg border border-white/5 hover:text-white">←</button>
      <h2 className="text-lg font-bold text-white w-48 text-center">{monthNames[month]} {year}</h2>
      <button onClick={next} className="px-3 py-1.5 bg-surface-850 text-gray-400 text-sm rounded-lg border border-white/5 hover:text-white">→</button>
      <button onClick={goToday} className="px-3 py-1.5 bg-surface-850 text-gray-400 text-xs rounded-lg border border-white/5 hover:text-white ml-2">Today</button>
    </div>
  );
}

function DayCell({ date, activities, planned, race, energyLog, isToday, isCurrentMonth }) {
  const dayNum = new Date(date).getDate();
  const items = [...(activities || []).map((a) => ({ ...a, src: "done" })), ...(planned || []).map((p) => ({ ...p, src: "planned" }))];

  return (
    <div className={`min-h-[110px] rounded-lg border p-1.5 transition-all ${
      isToday ? "bg-brand-600/10 border-brand-500/30 ring-1 ring-brand-500/20"
        : isCurrentMonth ? "bg-surface-850 border-white/5"
        : "bg-surface-900/40 border-white/3 opacity-40"
    }`}>
      <div className="flex items-center justify-between mb-1 px-0.5">
        <span className={`text-xs font-medium ${isToday ? "text-brand-400" : isCurrentMonth ? "text-gray-400" : "text-gray-600"}`}>
          {dayNum}
        </span>
        {energyLog?.energy && (
          <span className="text-[9px] text-yellow-400">{"★".repeat(energyLog.energy)}</span>
        )}
      </div>

      {race && (
        <div className="px-1 py-0.5 mb-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 truncate">
          🏁 {race.short_name}
        </div>
      )}

      <div className="space-y-0.5">
        {items.slice(0, 3).map((item, i) => {
          const icon = typeIcons[item.type] || typeIcons[item.category] || "🏅";
          const colorClass = typeColors[item.type] || typeColors[item.category] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
          const isDone = item.src === "done";
          return (
            <div key={i} className={`px-1 py-0.5 rounded text-[9px] truncate border ${isDone ? colorClass : "bg-surface-900 text-gray-500 border-white/5"}`}>
              {icon} {item.name || item.category || "Workout"}
              {isDone && item.tss ? ` · ${Math.round(item.tss)}` : ""}
            </div>
          );
        })}
        {items.length > 3 && (
          <div className="text-[9px] text-gray-500 px-1">+{items.length - 3} more</div>
        )}
      </div>
    </div>
  );
}

function WeekSummary({ weekActivities }) {
  const tss = weekActivities.filter((a) => a.src === "done").reduce((s, a) => s + (a.tss || 0), 0);
  const count = weekActivities.filter((a) => a.src === "done").length;
  if (count === 0) return null;
  return (
    <div className="flex flex-col items-center justify-center text-[9px] text-gray-500 px-1">
      <div className="font-medium text-gray-400">{Math.round(tss)}</div>
      <div>TSS</div>
      <div className="text-gray-600">{count}x</div>
    </div>
  );
}

export default function PlannerPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [activities, setActivities] = useState([]);
  const [planned, setPlanned] = useState([]);
  const [races, setRaces] = useState([]);
  const [energyLogs, setEnergyLogs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      // Get range: previous month to next month for buffer
      const start = new Date(year, month - 1, 1).toISOString().split("T")[0];
      const end = new Date(year, month + 2, 0).toISOString().split("T")[0];

      const [acts, plan, raceData, energy] = await Promise.all([
        getIntervalsActivities(start, end),
        getIntervalsPlannedWorkouts(start, end),
        getRaces(),
        getEnergyLogsRange(start, end),
      ]);

      setActivities(acts || []);
      // Filter out planned that overlap with completed
      const completedDates = new Set((acts || []).map((a) => a.date));
      setPlanned((plan || []).filter((p) => !completedDates.has(p.date)));
      setRaces(raceData || []);

      const logsMap = {};
      (energy || []).forEach((l) => { logsMap[l.date] = l; });
      setEnergyLogs(logsMap);

      setLoading(false);
    }
    load();
  }, [month, year]);

  // Build calendar grid
  const calendarData = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Monday = 0 in our grid
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6; // Sunday

    const days = [];
    // Previous month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d.toISOString().split("T")[0], currentMonth: false });
    }
    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: d.toISOString().split("T")[0], currentMonth: true });
    }
    // Next month padding to fill grid
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({ date: d.toISOString().split("T")[0], currentMonth: false });
      }
    }

    return days;
  }, [month, year]);

  const today = new Date().toISOString().split("T")[0];

  // Index data by date
  const actsByDate = {};
  activities.forEach((a) => {
    if (!actsByDate[a.date]) actsByDate[a.date] = [];
    actsByDate[a.date].push(a);
  });
  const planByDate = {};
  planned.forEach((p) => {
    if (!planByDate[p.date]) planByDate[p.date] = [];
    planByDate[p.date].push(p);
  });
  const raceByDate = {};
  races.forEach((r) => { raceByDate[r.date] = r; });

  // Weekly TSS summaries
  const weeks = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    const weekDays = calendarData.slice(i, i + 7);
    const weekItems = [];
    weekDays.forEach((d) => {
      (actsByDate[d.date] || []).forEach((a) => weekItems.push({ ...a, src: "done" }));
      (planByDate[d.date] || []).forEach((p) => weekItems.push({ ...p, src: "planned" }));
    });
    weeks.push(weekItems);
  }

  // Monthly totals
  const monthActivities = activities.filter((a) => {
    const d = new Date(a.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  const monthTSS = monthActivities.reduce((s, a) => s + (a.tss || 0), 0);
  const monthCount = monthActivities.length;
  const monthDuration = monthActivities.reduce((s, a) => s + (a.moving_time ? a.moving_time / 3600 : 0), 0);

  const handleMonthChange = (m, y) => { setMonth(m); setYear(y); };

  return (
    <div className="p-6 max-w-[1400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Monthly Planner</h1>
          <p className="text-sm text-gray-500 mt-1">
            Training calendar with activities & race dates
            {!loading && <span className="text-emerald-400 ml-2">● live</span>}
          </p>
        </div>
        <MonthNav month={month} year={year} onChange={handleMonthChange} />
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-surface-850 border border-white/5 rounded-xl p-3">
          <div className="text-[10px] text-gray-500">Monthly TSS</div>
          <div className="text-xl font-bold text-white">{Math.round(monthTSS)}</div>
        </div>
        <div className="bg-surface-850 border border-white/5 rounded-xl p-3">
          <div className="text-[10px] text-gray-500">Sessions</div>
          <div className="text-xl font-bold text-white">{monthCount}</div>
        </div>
        <div className="bg-surface-850 border border-white/5 rounded-xl p-3">
          <div className="text-[10px] text-gray-500">Hours</div>
          <div className="text-xl font-bold text-white">{monthDuration.toFixed(1)}</div>
        </div>
        <div className="bg-surface-850 border border-white/5 rounded-xl p-3">
          <div className="text-[10px] text-gray-500">Races This Month</div>
          <div className="text-xl font-bold text-white">
            {races.filter((r) => { const d = new Date(r.date); return d.getMonth() === month && d.getFullYear() === year; }).length}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500 text-sm">Loading calendar...</div>
      ) : (
        <div className="bg-surface-850 border border-white/5 rounded-xl p-3">
          {/* Day headers */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_50px] gap-1.5 mb-1.5">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-center text-[10px] text-gray-500 py-1 font-medium">{d}</div>
            ))}
            <div className="text-center text-[10px] text-gray-600 py-1">Σ</div>
          </div>

          {/* Calendar grid with weekly summary column */}
          {weeks.map((weekItems, wi) => {
            const weekDays = calendarData.slice(wi * 7, wi * 7 + 7);
            return (
              <div key={wi} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_50px] gap-1.5 mb-1.5">
                {weekDays.map((day) => (
                  <DayCell
                    key={day.date}
                    date={day.date}
                    activities={actsByDate[day.date]}
                    planned={planByDate[day.date]}
                    race={raceByDate[day.date]}
                    energyLog={energyLogs[day.date]}
                    isToday={day.date === today}
                    isCurrentMonth={day.currentMonth}
                  />
                ))}
                <WeekSummary weekActivities={weekItems} />
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-[10px] text-gray-500">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30"></span> Run</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/30"></span> Ride</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500/30"></span> Gym</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30"></span> Race Day</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-surface-900 border border-white/5"></span> Planned</div>
        <div className="flex items-center gap-1"><span className="text-yellow-400">★</span> Energy logged</div>
      </div>
    </div>
  );
}
