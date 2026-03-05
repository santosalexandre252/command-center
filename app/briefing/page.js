"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getEnergyLog } from "../../lib/db";
import { runGuardrails, calculateBurnoutSignals, calculateWorkStress } from "../../lib/guardrails";
import { getBurnoutColor, getBurnoutBg } from "../../lib/utils";

function AlertCard({ alert }) {
  const borderColor = alert.severity === "danger"
    ? "border-red-500/30 bg-red-500/5"
    : alert.severity === "warning"
    ? "border-amber-500/30 bg-amber-500/5"
    : "border-blue-500/30 bg-blue-500/5";
  const textColor = alert.severity === "danger"
    ? "text-red-400"
    : alert.severity === "warning"
    ? "text-amber-400"
    : "text-blue-400";

  return (
    <div className={`rounded-xl border p-4 ${borderColor}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{alert.icon}</span>
        <div className="flex-1">
          <div className={`text-sm font-medium ${textColor}`}>{alert.title}</div>
          <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
          <div className="mt-2 px-3 py-1.5 bg-surface-900 rounded-lg">
            <p className="text-xs text-gray-200">{alert.action}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WellnessCard({ label, value, unit, icon, color, subtext }) {
  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <span className="text-[10px] text-gray-500">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color || "text-white"}`}>
        {value !== null && value !== undefined ? (typeof value === "number" ? Math.round(value * 10) / 10 : value) : "—"}
        {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </div>
      {subtext && <div className="text-[10px] text-gray-500 mt-1">{subtext}</div>}
    </div>
  );
}

function CalendarPreview({ events, density }) {
  const densityColors = {
    rest: "bg-emerald-500/20 text-emerald-400",
    light: "bg-sky-500/20 text-sky-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    heavy: "bg-orange-500/20 text-orange-400",
    travel: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-300">Today's Calendar</h3>
        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${densityColors[density] || densityColors.light}`}>
          {density}
        </span>
      </div>
      {events && events.length > 0 ? (
        <div className="space-y-1.5">
          {events.map((evt, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-surface-900 rounded-lg">
              <span className="text-[10px] text-gray-500 font-mono w-12">{evt.start}</span>
              <span className="text-xs text-gray-300 truncate">{evt.title}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-gray-500 italic">No meetings today</div>
      )}
    </div>
  );
}

function PlannedWorkoutCard({ workout }) {
  if (!workout) {
    return (
      <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">😴</span>
          <h3 className="text-sm font-medium text-gray-300">Today's Training</h3>
        </div>
        <div className="text-lg text-gray-400">Rest Day</div>
        <p className="text-xs text-gray-500 mt-1">No planned session — focus on recovery, mobility, and sleep.</p>
      </div>
    );
  }

  const isGym = /gym|weight|leg|back|chest|arm/i.test(workout.name || workout.category || "");
  const icon = isGym ? "🏋️" : /run/i.test(workout.name || "") ? "🏃" : /ride|bike|cycl/i.test(workout.name || "") ? "🚴" : "🏅";
  const duration = workout.duration ? Math.round(workout.duration / 60) : null;

  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-medium text-gray-300">Today's Training</h3>
      </div>
      <div className="text-lg font-semibold text-white">{workout.name}</div>
      <div className="flex gap-4 mt-2 text-xs text-gray-400">
        {duration && <span>{duration} min</span>}
        {workout.load_target && <span>TSS ~{Math.round(workout.load_target)}</span>}
        {workout.category && <span>{workout.category}</span>}
      </div>
    </div>
  );
}

function AIRecommendation({ text, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-brand-600/10 border border-brand-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🤖</span>
          <h3 className="text-sm font-medium text-brand-400">AI Coach Recommendation</h3>
          <span className="text-[10px] text-gray-500">Llama 3.3</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
          <span className="text-xs text-gray-500">Analyzing your data...</span>
        </div>
      </div>
    );
  }

  if (!text) return null;

  return (
    <div className="bg-brand-600/10 border border-brand-500/20 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🤖</span>
        <h3 className="text-sm font-medium text-brand-400">AI Coach Recommendation</h3>
        <span className="text-[10px] text-gray-500">Llama 3.3</span>
      </div>
      <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{text}</div>
    </div>
  );
}

export default function BriefingPage() {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [burnout, setBurnout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [energyLog, setEnergyLog] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const todayDisplay = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    async function load() {
      const [briefingRes, todayEnergy] = await Promise.all([
        fetch("/api/briefing").then((r) => r.ok ? r.json() : null),
        getEnergyLog(today),
      ]);

      if (!briefingRes) {
        setLoading(false);
        return;
      }

      setData(briefingRes);
      setEnergyLog(todayEnergy);

      // Calculate burnout
      const { ctl, atl, tsb } = briefingRes.wellness;
      const { hrvLast3, avg30HRV } = briefingRes.hrvAnalysis;
      const avg7HRV = hrvLast3.length > 0 ? hrvLast3.reduce((s, v) => s + v, 0) / hrvLast3.length : null;
      const avgSleep = briefingRes.recentSleep.filter(Boolean).length > 0
        ? briefingRes.recentSleep.filter(Boolean).reduce((s, v) => s + v, 0) / briefingRes.recentSleep.filter(Boolean).length
        : null;
      const workStress = calculateWorkStress({
        [today]: { density: briefingRes.calendar.density, count: briefingRes.calendar.eventCount },
      });

      const burnoutResult = calculateBurnoutSignals({
        atl, ctl, tsb,
        avg7HRV, avg30HRV,
        avgSleep,
        workStress,
        avgEnergy: todayEnergy?.energy || null,
        calendarConnected: briefingRes.calendar.eventCount > 0 || briefingRes.calendar.density !== "rest",
      });
      setBurnout(burnoutResult);

      // Run guardrails
      const guardrailAlerts = runGuardrails({
        atl, ctl, tsb,
        hrvLast3,
        avg30HRV,
        recentSleep: briefingRes.recentSleep,
        todayWorkDensity: briefingRes.calendar.density,
        kneeStatus: todayEnergy?.knee_status || 0,
        todayPlanned: briefingRes.todayPlanned,
        energyLog: todayEnergy,
        burnoutTotal: burnoutResult.total,
      });
      setAlerts(guardrailAlerts);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-[1100px]">
        <h1 className="text-2xl font-bold text-white mb-2">Morning Briefing</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 text-sm">Loading your morning briefing...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 max-w-[1100px]">
        <h1 className="text-2xl font-bold text-white mb-2">Morning Briefing</h1>
        <div className="bg-surface-850 border border-white/5 rounded-xl p-6 text-center">
          <p className="text-gray-400">Could not load briefing data. Check your API connections in <Link href="/settings" className="text-brand-400">Settings</Link>.</p>
        </div>
      </div>
    );
  }

  const { wellness, calendar, todayPlanned, aiRecommendation } = data;
  const sleepDisplay = wellness.sleepLast
    ? (wellness.sleepLast > 100 ? (wellness.sleepLast / 60).toFixed(1) : wellness.sleepLast.toFixed(1))
    : null;
  const tsbColor = wellness.tsb >= 5 ? "text-emerald-400" : wellness.tsb >= -5 ? "text-yellow-400" : wellness.tsb >= -15 ? "text-amber-400" : "text-red-400";
  const tsbLabel = wellness.tsb >= 5 ? "Fresh" : wellness.tsb >= -5 ? "Neutral" : wellness.tsb >= -15 ? "Fatigued" : "Very fatigued";

  return (
    <div className="p-6 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Morning Briefing</h1>
          <p className="text-sm text-gray-500 mt-1">{todayDisplay}</p>
        </div>
        <div className="flex items-center gap-3">
          {burnout && (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${getBurnoutBg(burnout.total)}`}>
              <span className={`w-2 h-2 rounded-full ${burnout.total < 40 ? "bg-emerald-500" : burnout.total < 55 ? "bg-yellow-400" : burnout.total < 75 ? "bg-amber-500" : "bg-red-500"}`}></span>
              <span className={getBurnoutColor(burnout.total)}>Burnout: {burnout.total}/100</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendation — top of page */}
      <div className="mb-6">
        <AIRecommendation text={aiRecommendation} isLoading={!aiRecommendation && loading} />
      </div>

      {/* Guardrail Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-400 mb-3">
            Active Alerts
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400">{alerts.length}</span>
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left: Wellness + Training */}
        <div className="col-span-7 space-y-4">
          {/* Wellness Snapshot */}
          <div>
            <h2 className="text-sm font-medium text-gray-400 mb-3">Overnight Recovery</h2>
            <div className="grid grid-cols-3 gap-3">
              <WellnessCard label="Sleep" value={sleepDisplay} unit="hrs" icon="😴" color={sleepDisplay && sleepDisplay >= 7.5 ? "text-emerald-400" : sleepDisplay && sleepDisplay >= 6.5 ? "text-yellow-400" : "text-red-400"} />
              <WellnessCard label="HRV" value={wellness.hrv} unit="ms" icon="💓" color="text-violet-400" subtext={data.hrvAnalysis.avg30HRV ? `30d avg: ${Math.round(data.hrvAnalysis.avg30HRV)}ms` : null} />
              <WellnessCard label="Resting HR" value={wellness.restingHR} unit="bpm" icon="❤️" color="text-cyan-400" />
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-sm font-medium text-gray-400 mb-3">Current Form</h2>
            <div className="grid grid-cols-4 gap-3">
              <WellnessCard label="Fitness" value={wellness.ctl ? Math.round(wellness.ctl) : null} icon="📈" color="text-blue-400" />
              <WellnessCard label="Fatigue" value={wellness.atl ? Math.round(wellness.atl) : null} icon="📉" color="text-pink-400" />
              <WellnessCard label="Form" value={wellness.tsb !== null ? Math.round(wellness.tsb) : null} icon="⚡" color={tsbColor} subtext={tsbLabel} />
              <WellnessCard label="Weight" value={wellness.weight} unit="kg" icon="⚖️" subtext="Target: 71kg" />
            </div>
          </div>

          {/* Planned Workout */}
          <PlannedWorkoutCard workout={todayPlanned} />
        </div>

        {/* Right: Calendar + Quick Actions */}
        <div className="col-span-5 space-y-4">
          <CalendarPreview events={calendar.events} density={calendar.density} />

          {/* Recent Activity */}
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Recent Training</h3>
            {data.recentActivities && data.recentActivities.length > 0 ? (
              <div className="space-y-1.5">
                {data.recentActivities.slice(-5).reverse().map((act, i) => {
                  const typeIcons = { Run: "🏃", Ride: "🚴", WeightTraining: "🏋️", VirtualRide: "🚴", Walk: "🚶" };
                  return (
                    <div key={i} className="flex items-center justify-between p-2 bg-surface-900 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{typeIcons[act.type] || "🏅"}</span>
                        <div>
                          <div className="text-xs text-gray-300 truncate max-w-[160px]">{act.name || act.type}</div>
                          <div className="text-[9px] text-gray-500">{act.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400">{act.duration_min ? act.duration_min + "m" : ""} {act.distance_km ? act.distance_km + "km" : ""}</div>
                        {act.tss && <div className="text-[9px] text-gray-500">TSS {Math.round(act.tss)}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic">No recent activities</div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Actions</h3>
            <div className="space-y-1.5">
              <Link href="/chat" className="flex items-center gap-2 p-2.5 bg-surface-900 rounded-lg hover:bg-surface-800 transition-colors">
                <span>🤖</span><span className="text-xs text-gray-300">Ask AI Coach for details</span>
              </Link>
              <Link href="/load" className="flex items-center gap-2 p-2.5 bg-surface-900 rounded-lg hover:bg-surface-800 transition-colors">
                <span>💓</span><span className="text-xs text-gray-300">View full load analysis</span>
              </Link>
              <Link href="/fuelling" className="flex items-center gap-2 p-2.5 bg-surface-900 rounded-lg hover:bg-surface-800 transition-colors">
                <span>⚡</span><span className="text-xs text-gray-300">Today's fuelling plan</span>
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 p-2.5 bg-surface-900 rounded-lg hover:bg-surface-800 transition-colors">
                <span>📊</span><span className="text-xs text-gray-300">Full weekly dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
