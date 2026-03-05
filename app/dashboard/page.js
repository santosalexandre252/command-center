"use client";
import { useState, useEffect } from "react";
import { getAthleteProfile, getRaces, upsertEnergyLog, getEnergyLogsRange } from "../../lib/db";
import { getIntervalsProfile, getIntervalsActivities, getIntervalsPlannedWorkouts, getWeekStart, getWeekEnd } from "../../lib/intervals";
import { getCalendarEvents } from "../../lib/calendar";
import { daysUntil, getBurnoutColor, getBurnoutBg, getRaceTypeIcon, getWorkDensityColor } from "../../lib/utils";
import { calculateBurnoutSignals, calculateWorkStress, runGuardrails } from "../../lib/guardrails";
import { getIntervalsWellness } from "../../lib/intervals";
import Link from "next/link";

function EnergyStars({ value, onChange, size = "text-lg" }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onChange(star)} className={`energy-star ${size} ${star <= value ? "text-yellow-400" : "text-gray-600"}`}>★</button>
      ))}
    </div>
  );
}

function RatingRow({ label, value, onChange, labels }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-300 w-28">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((v) => (
          <button key={v} onClick={() => onChange(v)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${v === value ? "bg-brand-600 text-white" : "bg-surface-900 text-gray-500 hover:text-white hover:bg-surface-800"}`}>{v}</button>
        ))}
      </div>
      <span className="text-[10px] text-gray-500 w-20 text-right">{labels?.[value - 1] || ""}</span>
    </div>
  );
}

function DailyCheckIn({ date, existing, onSave, onClose }) {
  const [energy, setEnergy] = useState(existing?.energy || 0);
  const [sleepHours, setSleepHours] = useState(existing?.sleep_hours || "");
  const [sleepQuality, setSleepQuality] = useState(existing?.sleep_quality || 0);
  const [mood, setMood] = useState(existing?.mood || 0);
  const [soreness, setSoreness] = useState(existing?.soreness || 0);
  const [kneeStatus, setKneeStatus] = useState(existing?.knee_status || 0);
  const [notes, setNotes] = useState(existing?.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ date, energy: energy || null, sleep_hours: sleepHours ? parseFloat(sleepHours) : null, sleep_quality: sleepQuality || null, mood: mood || null, soreness: soreness || null, knee_status: kneeStatus || null, notes: notes || null });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface-850 border border-white/10 rounded-2xl p-6 w-[440px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Daily Check-In</h2>
            <p className="text-xs text-gray-500">{new Date(date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="space-y-1">
          <div className="py-2 flex items-center justify-between"><span className="text-sm text-gray-300">Energy</span><EnergyStars value={energy} onChange={setEnergy} size="text-xl" /></div>
          <div className="py-2 flex items-center justify-between"><span className="text-sm text-gray-300">Sleep</span><div className="flex items-center gap-2"><input type="number" step="0.5" min="0" max="14" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} placeholder="hrs" className="w-16 text-sm text-center text-gray-200 bg-surface-900 border border-white/5 rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-500/50" /><span className="text-xs text-gray-500">hours</span></div></div>
          <RatingRow label="Sleep Quality" value={sleepQuality} onChange={setSleepQuality} labels={["Terrible", "Poor", "OK", "Good", "Great"]} />
          <RatingRow label="Mood" value={mood} onChange={setMood} labels={["Awful", "Low", "Neutral", "Good", "Great"]} />
          <RatingRow label="Soreness" value={soreness} onChange={setSoreness} labels={["None", "Light", "Moderate", "Heavy", "Severe"]} />
          <RatingRow label="Right Knee" value={kneeStatus} onChange={setKneeStatus} labels={["Perfect", "Mild", "Moderate", "Sore", "Painful"]} />
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes? (optional)" rows={2} className="w-full mt-3 text-sm text-gray-200 bg-surface-900 border border-white/5 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500/50 resize-none placeholder-gray-600" />
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm text-gray-400 bg-surface-900 rounded-lg hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 text-sm text-white bg-brand-600 rounded-lg hover:bg-brand-700 font-medium disabled:opacity-50">{saving ? "Saving..." : "Save Check-In"}</button>
        </div>
      </div>
    </div>
  );
}

function DayCard({ day, isToday, energyLog, calendarDay, onCheckIn }) {
  const activity = day.activities[0];
  const typeIcons = { Run: "🏃", Ride: "🚴", WeightTraining: "🏋️", VirtualRide: "🚴", Walk: "🚶", Swim: "🏊", Hike: "⛰️" };
  const savedEnergy = energyLog?.energy || 0;
  const density = calendarDay?.density || "rest";

  return (
    <div className={`rounded-xl border p-3 transition-all ${
      isToday ? "bg-brand-600/10 border-brand-500/30 ring-1 ring-brand-500/20" : "bg-surface-850 border-white/5"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-medium ${isToday ? "text-brand-400" : "text-gray-500"}`}>
          {isToday ? "TODAY" : day.label}
        </span>
        <div className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${getWorkDensityColor(density)}`}>{density}</div>
      </div>

      {/* Work events */}
      {calendarDay && calendarDay.events.length > 0 && (
        <div className="mb-2 space-y-0.5">
          {calendarDay.events.slice(0, 2).map((evt, i) => (
            <div key={i} className="text-[9px] text-gray-500 truncate">
              <span className="text-gray-600">{evt.startTime}</span> {evt.title}
            </div>
          ))}
          {calendarDay.events.length > 2 && <div className="text-[9px] text-gray-600">+{calendarDay.events.length - 2} more</div>}
        </div>
      )}

      {/* Activities */}
      {day.activities.map((act, i) => {
        const icon = typeIcons[act.type] || "🏅";
        const minutes = act.moving_time ? Math.round(act.moving_time / 60) : 0;
        return (
          <div key={i} className="mb-1.5">
            <div className="flex items-center gap-1 text-xs">
              <span>{icon}</span>
              <span className={`font-medium truncate ${act.completed ? "text-gray-200" : "text-gray-400"}`}>{act.name}</span>
              {act.completed && <span className="text-emerald-500 text-[10px] ml-auto">✓</span>}
              {act.planned && !act.completed && <span className="text-blue-400 text-[9px] ml-auto">PLAN</span>}
            </div>
            <div className="flex gap-2 text-[9px] text-gray-500 mt-0.5">
              {minutes > 0 && <span>{minutes}m</span>}
              {act.tss && <span>TSS {Math.round(act.tss)}</span>}
              {act.load_target && !act.tss && <span>~{Math.round(act.load_target)}</span>}
            </div>
          </div>
        );
      })}

      {day.activities.length === 0 && (
        <div className="text-[10px] text-gray-600 italic mb-1.5">Rest day</div>
      )}

      {/* Check-in */}
      <button onClick={() => onCheckIn(day.date)} className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-brand-400 transition-colors mt-1">
        {savedEnergy > 0 ? (
          <><span className="text-yellow-400">{"★".repeat(savedEnergy)}{"☆".repeat(5 - savedEnergy)}</span><span className="text-gray-600 ml-0.5">edit</span></>
        ) : (
          <span>+ Check in</span>
        )}
      </button>
    </div>
  );
}

function TSSProgressBar({ actual, planned, label }) {
  const pct = planned > 0 ? Math.min(100, Math.round((actual / planned) * 100)) : 0;
  const isOver = actual > planned && planned > 0;
  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <div className="text-sm text-gray-400"><span className="text-white font-medium">{Math.round(actual)}</span>{planned > 0 && <span> / {Math.round(planned)}</span>}</div>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full transition-all ${isOver ? "bg-amber-500" : pct >= 80 ? "bg-emerald-500" : "bg-brand-500"}`} style={{ width: `${Math.min(100, pct)}%` }}></div>
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-gray-500">
        <span>{pct}%</span>
        {planned > 0 && !isOver && <span>{Math.round(planned - actual)} remaining</span>}
        {isOver && <span className="text-amber-400">+{Math.round(actual - planned)} over</span>}
      </div>
    </div>
  );
}

function VolumeBreakdown({ activities, planned }) {
  const types = {};
  activities.filter((a) => a.completed).forEach((a) => { const t = a.type || "Other"; if (!types[t]) types[t] = { actual: 0, count: 0 }; types[t].actual += a.tss || 0; types[t].count += 1; });
  const plannedTypes = {};
  planned.forEach((p) => { const t = p.type || p.category || "Other"; if (!plannedTypes[t]) plannedTypes[t] = { planned: 0, count: 0 }; plannedTypes[t].planned += p.load_target || 0; plannedTypes[t].count += 1; });
  const typeIcons = { Run: "🏃", Ride: "🚴", WeightTraining: "🏋️", VirtualRide: "🚴", Swim: "🏊" };
  const allTypes = [...new Set([...Object.keys(types), ...Object.keys(plannedTypes)])];
  if (allTypes.length === 0) return null;
  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Volume by Discipline</h3>
      <div className="space-y-2">
        {allTypes.map((t) => (
          <div key={t} className="flex items-center justify-between p-2 bg-surface-900 rounded-lg">
            <div className="flex items-center gap-2"><span>{typeIcons[t] || "🏅"}</span><span className="text-sm text-gray-300">{t}</span></div>
            <div className="text-right">
              <div className="text-sm text-white font-medium">{Math.round(types[t]?.actual || 0)} TSS <span className="text-gray-500 font-normal">({types[t]?.count || 0}x)</span></div>
              {(plannedTypes[t]?.planned || 0) > 0 && <div className="text-[10px] text-gray-500">Planned: {Math.round(plannedTypes[t].planned)} ({plannedTypes[t].count}x)</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RaceCountdown({ race, ctl }) {
  const days = daysUntil(race.date);
  const fitnessPercent = Math.min(100, Math.round((ctl / race.target_ctl) * 100));
  const isOnTrack = fitnessPercent >= 80;
  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-4 card-hover">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span>{getRaceTypeIcon(race.type)}</span><span className="text-sm font-medium text-gray-200">{race.short_name}</span></div>
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${race.priority === "A" ? "bg-brand-600/20 text-brand-400" : "bg-gray-700/50 text-gray-400"}`}>{race.priority}</span>
      </div>
      <div className="text-2xl font-bold text-white">{days}<span className="text-sm font-normal text-gray-500 ml-1">days</span></div>
      <div className="mt-2">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>CTL {Math.round(ctl)}/{race.target_ctl}</span><span className={isOnTrack ? "text-emerald-400" : "text-amber-400"}>{isOnTrack ? "On track" : "Behind"}</span></div>
        <div className="w-full bg-gray-800 rounded-full h-1.5"><div className={`h-1.5 rounded-full transition-all ${isOnTrack ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${fitnessPercent}%` }}></div></div>
      </div>
    </div>
  );
}

function WorkWeekSummary({ calendarData }) {
  if (!calendarData || Object.keys(calendarData).length === 0) return null;
  const totalMeetings = Object.values(calendarData).reduce((s, d) => s + d.count, 0);
  const heavyDays = Object.values(calendarData).filter((d) => d.density === "heavy" || d.density === "travel").length;
  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Work This Week</h3>
      <div className="flex gap-4 text-center">
        <div><div className="text-xl font-bold text-white">{totalMeetings}</div><div className="text-[10px] text-gray-500">meetings</div></div>
        <div><div className="text-xl font-bold text-white">{heavyDays}</div><div className="text-[10px] text-gray-500">heavy days</div></div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [athlete, setAthlete] = useState(null);
  const [races, setRaces] = useState([]);
  const [fitness, setFitness] = useState(null);
  const [activities, setActivities] = useState([]);
  const [planned, setPlanned] = useState([]);
  const [energyLogs, setEnergyLogs] = useState({});
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [intervalsConnected, setIntervalsConnected] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [checkInDate, setCheckInDate] = useState(null);
  const [guardrailAlerts, setGuardrailAlerts] = useState([]);
  const [wellnessData, setWellnessData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const weekStart = getWeekStart();
      const weekEnd = getWeekEnd();

      const [profileData, racesData, fitnessData, activitiesData, plannedData, energyData, calData, recentWellness] = await Promise.all([
        getAthleteProfile(),
        getRaces(),
        getIntervalsProfile(),
        getIntervalsActivities(weekStart, weekEnd),
        getIntervalsPlannedWorkouts(weekStart, weekEnd),
        getEnergyLogsRange(weekStart, weekEnd),
        getCalendarEvents(weekStart, weekEnd),
        getIntervalsWellness(new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0], new Date().toISOString().split("T")[0]),
      ]);

      setAthlete(profileData);
      setRaces(racesData);

      if (fitnessData && fitnessData.ctl !== undefined) { setFitness(fitnessData); setIntervalsConnected(true); }

      const completed = (activitiesData || []).map((a) => ({ ...a, completed: true }));
      const completedDates = new Set(completed.map((a) => a.date));
      const futurePlanned = (plannedData || []).filter((p) => !completedDates.has(p.date)).map((p) => ({
        ...p, name: p.name || p.category || "Planned workout", completed: false, planned: true, tss: null, moving_time: p.duration,
      }));
      setActivities([...completed, ...futurePlanned]);
      setPlanned(plannedData || []);

      const logsMap = {};
      (energyData || []).forEach((log) => { logsMap[log.date] = log; });
      setEnergyLogs(logsMap);

      if (calData?.dailySummary && Object.keys(calData.dailySummary).length > 0) {
        setCalendarData(calData.dailySummary);
        setCalendarConnected(true);
      }

      setWellnessData(recentWellness || []);

      setLoading(false);
    }
    loadData();
  }, []);

  const handleSaveCheckIn = async (log) => {
    const saved = await upsertEnergyLog(log);
    if (saved) setEnergyLogs((prev) => ({ ...prev, [log.date]: saved }));
  };

  if (loading) return <div className="p-6 flex items-center justify-center h-64"><div className="text-gray-500 text-sm">Loading dashboard...</div></div>;

  const ctl = fitness?.ctl || athlete?.ctl || 42;
  const atl = fitness?.atl || athlete?.atl || 38;
  const tsb = fitness?.tsb ?? (ctl - atl);
  const weight = fitness?.weight || athlete?.weight || 76.2;

  const weekStart = new Date(getWeekStart());
  const today = new Date().toISOString().split("T")[0];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekDays = dayLabels.map((label, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    return { label, date: dateStr, activities: activities.filter((a) => a.date === dateStr), isToday: dateStr === today };
  });

  const actualTSS = activities.filter((a) => a.completed).reduce((sum, a) => sum + (a.tss || 0), 0);
  const plannedTSS = planned.reduce((sum, p) => sum + (p.load_target || 0), 0);
  const actualDuration = activities.filter((a) => a.completed).reduce((sum, a) => sum + (a.moving_time ? a.moving_time / 60 : 0), 0);
  const plannedDuration = planned.reduce((sum, p) => sum + (p.duration ? p.duration / 60 : 0), 0);

  const energyValues = Object.values(energyLogs).filter((l) => l.energy).map((l) => l.energy);
  const avgEnergy = energyValues.length > 0 ? (energyValues.reduce((a, b) => a + b, 0) / energyValues.length).toFixed(1) : null;

  // Compute burnout with shared guardrails engine
  const workStress = calculateWorkStress(calendarData);
  const hrvValues = wellnessData.filter((w) => w.hrv).map((w) => w.hrv);
  const avg30HRV = hrvValues.length > 0 ? hrvValues.reduce((s, v) => s + v, 0) / hrvValues.length : null;
  const hrvLast3 = hrvValues.slice(-3);
  const avg7HRV = hrvLast3.length > 0 ? hrvLast3.reduce((s, v) => s + v, 0) / hrvLast3.length : null;
  const recentSleep = wellnessData.slice(-3).map((w) => {
    if (!w.sleep_duration) return null;
    return w.sleep_duration > 100 ? w.sleep_duration / 60 : w.sleep_duration;
  });
  const avgSleep = recentSleep.filter(Boolean).length > 0 ? recentSleep.filter(Boolean).reduce((s, v) => s + v, 0) / recentSleep.filter(Boolean).length : null;

  const burnout = calculateBurnoutSignals({
    atl, ctl, tsb,
    avg7HRV, avg30HRV,
    avgSleep,
    workStress,
    avgEnergy: avgEnergy ? parseFloat(avgEnergy) : null,
    calendarConnected,
  });
  const burnoutTotal = burnout.total;

  // Run guardrails on load
  useEffect(() => {
    if (loading) return;
    const todayDate = new Date().toISOString().split("T")[0];
    const todayDensity = calendarData[todayDate]?.density || "rest";
    const todayPlannedItems = activities.filter((a) => a.date === todayDate && a.planned);
    const todayPlanned = todayPlannedItems.length > 0 ? todayPlannedItems[0] : null;
    const todayEnergyLog = energyLogs[todayDate];

    const alerts = runGuardrails({
      atl, ctl, tsb,
      hrvLast3,
      avg30HRV,
      recentSleep,
      todayWorkDensity: todayDensity,
      kneeStatus: todayEnergyLog?.knee_status || 0,
      todayPlanned,
      energyLog: todayEnergyLog,
      burnoutTotal,
    });
    setGuardrailAlerts(alerts);
  }, [loading, activities, calendarData, energyLogs, wellnessData]);

  return (
    <div className="p-6 max-w-[1400px]">
      {checkInDate && <DailyCheckIn date={checkInDate} existing={energyLogs[checkInDate]} onSave={handleSaveCheckIn} onClose={() => setCheckInDate(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Weekly Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">
            Week of {weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            {intervalsConnected && <span className="text-emerald-400 ml-2">● Training</span>}
            {calendarConnected && <span className="text-blue-400 ml-2">● Calendar</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {avgEnergy && <div className="text-xs text-gray-400 bg-surface-850 border border-white/5 rounded-full px-3 py-1.5">Energy: <span className="text-yellow-400 font-medium">{avgEnergy}</span>/5</div>}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${getBurnoutBg(burnoutTotal)}`}>
            <span className={`w-2 h-2 rounded-full ${burnoutTotal < 40 ? "bg-emerald-500" : burnoutTotal < 55 ? "bg-yellow-400" : burnoutTotal < 75 ? "bg-amber-500" : "bg-red-500"}`}></span>
            <span className={getBurnoutColor(burnoutTotal)}>Burnout: {burnoutTotal}/100</span>
          </div>
        </div>
      </div>

      {/* Guardrail Alerts */}
      {guardrailAlerts.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-400">Active Alerts</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">{guardrailAlerts.length}</span>
            <Link href="/briefing" className="text-[10px] text-brand-400 ml-auto hover:underline">View full briefing</Link>
          </div>
          <div className="space-y-2">
            {guardrailAlerts.slice(0, 2).map((alert) => (
              <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-xl border ${
                alert.severity === "danger" ? "border-red-500/30 bg-red-500/5" : "border-amber-500/30 bg-amber-500/5"
              }`}>
                <span className="text-base">{alert.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium ${alert.severity === "danger" ? "text-red-400" : "text-amber-400"}`}>{alert.title}</div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{alert.action}</p>
                </div>
              </div>
            ))}
            {guardrailAlerts.length > 2 && (
              <Link href="/briefing" className="text-[10px] text-gray-500 hover:text-brand-400 block text-center">+{guardrailAlerts.length - 2} more alerts</Link>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <TSSProgressBar actual={actualTSS} planned={plannedTSS} label="Weekly TSS" />
        <TSSProgressBar actual={Math.round(actualDuration)} planned={Math.round(plannedDuration)} label="Weekly Duration (min)" />
      </div>

      <div className="grid grid-cols-7 gap-3 mb-6">
        {weekDays.map((day) => (
          <DayCard key={day.date} day={day} isToday={day.isToday} energyLog={energyLogs[day.date]} calendarDay={calendarData[day.date]} onCheckIn={setCheckInDate} />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 space-y-4">
          {calendarConnected && <WorkWeekSummary calendarData={calendarData} />}
          <VolumeBreakdown activities={activities} planned={planned} />
          <div>
            <h2 className="text-sm font-medium text-gray-400 mb-3">Race Countdowns</h2>
            <div className="grid grid-cols-4 gap-3">
              {races.map((race) => (<RaceCountdown key={race.id} race={race} ctl={ctl} />))}
            </div>
          </div>
        </div>
        <div className="col-span-4 space-y-3">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Quick Stats {intervalsConnected && <span className="text-emerald-400 text-[10px]">● live</span>}</h2>
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4"><div className="text-[10px] text-gray-500 mb-1">Fitness (CTL)</div><div className="text-2xl font-bold text-white">{Math.round(ctl)}</div></div>
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4"><div className="text-[10px] text-gray-500 mb-1">Fatigue (ATL)</div><div className="text-2xl font-bold text-white">{Math.round(atl)}</div></div>
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4"><div className="text-[10px] text-gray-500 mb-1">Form (TSB)</div><div className={`text-2xl font-bold ${tsb >= 0 ? "text-emerald-400" : "text-amber-400"}`}>{tsb > 0 ? "+" : ""}{Math.round(tsb)}</div></div>
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4"><div className="text-[10px] text-gray-500 mb-1">Weight</div><div className="text-2xl font-bold text-white">{weight}<span className="text-sm font-normal text-gray-500">kg</span></div><div className="text-[10px] text-gray-500 mt-1">Target: {athlete?.target_weight || 71}kg</div></div>
        </div>
      </div>
    </div>
  );
}
