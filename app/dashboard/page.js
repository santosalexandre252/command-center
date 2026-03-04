"use client";
import { useState, useEffect } from "react";
import { burnoutScore, weeklyTSS as mockTSS } from "../../lib/mockData";
import { getAthleteProfile, getRaces, upsertEnergyLog } from "../../lib/db";
import { getIntervalsProfile, getIntervalsActivities, getWeekStart, getWeekEnd } from "../../lib/intervals";
import { daysUntil, getBurnoutColor, getBurnoutBg, getWorkDensityColor, getRaceTypeIcon } from "../../lib/utils";

function EnergyStars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onChange(star)} className={`energy-star text-lg ${star <= value ? "text-yellow-400" : "text-gray-600"}`}>★</button>
      ))}
    </div>
  );
}

function BurnoutBadge({ score }) {
  const level = score.total < 40 ? "low" : score.total < 55 ? "moderate" : score.total < 75 ? "high" : "critical";
  const labels = { low: "Low", moderate: "Moderate", high: "High", critical: "Critical" };
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${getBurnoutBg(score.total)} ${score.total >= 75 ? "burnout-critical" : ""}`}>
      <span className={`w-2 h-2 rounded-full ${score.total < 40 ? "bg-emerald-500" : score.total < 55 ? "bg-yellow-400" : score.total < 75 ? "bg-amber-500" : "bg-red-500"}`}></span>
      <span className={getBurnoutColor(score.total)}>Burnout: {score.total}/100 — {labels[level]}</span>
    </div>
  );
}

function ActivityCard({ activity, isToday }) {
  const [energy, setEnergy] = useState(0);
  const typeIcons = { Run: "🏃", Ride: "🚴", WeightTraining: "🏋️", VirtualRide: "🚴", Walk: "🚶", Swim: "🏊", Hike: "⛰️" };
  const icon = typeIcons[activity.type] || "🏅";
  const minutes = activity.moving_time ? Math.round(activity.moving_time / 60) : 0;

  const handleEnergy = async (val) => {
    setEnergy(val);
    await upsertEnergyLog({ date: activity.date, energy: val });
  };

  return (
    <div className={`rounded-xl border p-4 transition-all ${
      isToday ? "bg-brand-600/10 border-brand-500/30 ring-1 ring-brand-500/20" : "bg-surface-850 border-white/5"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium ${isToday ? "text-brand-400" : "text-gray-500"}`}>
          {isToday ? "TODAY" : new Date(activity.date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short" })}
        </span>
        <span className="text-emerald-500 text-sm">✓</span>
      </div>
      <div className="flex items-center gap-1.5 text-sm mb-1">
        <span>{icon}</span>
        <span className="font-medium text-gray-200 truncate">{activity.name}</span>
      </div>
      <div className="flex gap-3 mt-1 text-[10px] text-gray-500 flex-wrap">
        {minutes > 0 && <span>{minutes}min</span>}
        {activity.tss && <span>TSS {Math.round(activity.tss)}</span>}
        {activity.distance && <span>{parseFloat(activity.distance).toFixed(1)}km</span>}
        {activity.avg_hr && <span>♥ {activity.avg_hr}</span>}
      </div>
      <div className="mt-3">
        <div className="text-[10px] text-gray-500 mb-1">Energy</div>
        <EnergyStars value={energy} onChange={handleEnergy} />
      </div>
    </div>
  );
}

function EmptyDayCard({ date, dayLabel }) {
  const isToday = date === new Date().toISOString().split("T")[0];
  return (
    <div className={`rounded-xl border p-4 ${
      isToday ? "bg-brand-600/10 border-brand-500/30 ring-1 ring-brand-500/20" : "bg-surface-850 border-white/5 opacity-60"
    }`}>
      <span className={`text-xs font-medium ${isToday ? "text-brand-400" : "text-gray-500"}`}>
        {isToday ? "TODAY" : dayLabel}
      </span>
      <div className="text-[10px] text-gray-600 mt-1">{date.split("-").slice(1).join("/")}</div>
      <div className="mt-3 text-xs text-gray-600 italic">Rest day</div>
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
        <div className="flex items-center gap-2">
          <span>{getRaceTypeIcon(race.type)}</span>
          <span className="text-sm font-medium text-gray-200">{race.short_name}</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${race.priority === "A" ? "bg-brand-600/20 text-brand-400" : "bg-gray-700/50 text-gray-400"}`}>{race.priority}</span>
      </div>
      <div className="text-2xl font-bold text-white">{days}<span className="text-sm font-normal text-gray-500 ml-1">days</span></div>
      <div className="mt-2">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
          <span>CTL {Math.round(ctl)}/{race.target_ctl}</span>
          <span className={isOnTrack ? "text-emerald-400" : "text-amber-400"}>{isOnTrack ? "On track" : "Behind"}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full transition-all ${isOnTrack ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${fitnessPercent}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [athlete, setAthlete] = useState(null);
  const [races, setRaces] = useState([]);
  const [fitness, setFitness] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [intervalsConnected, setIntervalsConnected] = useState(false);

  useEffect(() => {
    async function loadData() {
      // Load from Supabase
      const [profileData, racesData] = await Promise.all([
        getAthleteProfile(),
        getRaces(),
      ]);
      setAthlete(profileData);
      setRaces(racesData);

      // Load from Intervals.icu
      const [fitnessData, activitiesData] = await Promise.all([
        getIntervalsProfile(),
        getIntervalsActivities(getWeekStart(), getWeekEnd()),
      ]);

      if (fitnessData && fitnessData.ctl !== undefined) {
        setFitness(fitnessData);
        setIntervalsConnected(true);
      }
      if (activitiesData && activitiesData.length > 0) {
        setActivities(activitiesData);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Loading dashboard...</div>
      </div>
    );
  }

  const ctl = fitness?.ctl || athlete?.ctl || 42;
  const atl = fitness?.atl || athlete?.atl || 38;
  const tsb = fitness?.tsb ?? (ctl - atl);
  const weight = fitness?.weight || athlete?.weight || 76.2;

  // Build week grid — fill in days with activities
  const weekStart = new Date(getWeekStart());
  const today = new Date().toISOString().split("T")[0];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekDays = dayLabels.map((label, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayActivities = activities.filter((a) => a.date === dateStr);
    return { label, date: dateStr, activities: dayActivities, isToday: dateStr === today };
  });

  // Calculate weekly TSS
  const actualTSS = activities.reduce((sum, a) => sum + (a.tss || 0), 0);

  return (
    <div className="p-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Weekly Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">
            Week of {weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            {intervalsConnected && <span className="text-emerald-400 ml-2">● Intervals.icu live</span>}
          </p>
        </div>
        <BurnoutBadge score={burnoutScore} />
      </div>

      {/* Weekly TSS */}
      <div className="bg-surface-850 border border-white/5 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Weekly TSS</span>
          <span className="text-sm text-gray-400">{Math.round(actualTSS)}{intervalsConnected ? "" : " (mock)"}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (actualTSS / 360) * 100)}%` }}></div>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-7 gap-3 mb-6">
        {weekDays.map((day) => {
          if (day.activities.length > 0) {
            return day.activities.map((act, i) => (
              <ActivityCard key={act.id || `${day.date}-${i}`} activity={act} isToday={day.isToday} />
            ));
          }
          return <EmptyDayCard key={day.date} date={day.date} dayLabel={day.label} />;
        })}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Race Countdowns</h2>
          <div className="grid grid-cols-4 gap-3">
            {races.map((race) => (
              <RaceCountdown key={race.id} race={race} ctl={ctl} />
            ))}
          </div>
        </div>

        <div className="col-span-4 space-y-3">
          <h2 className="text-sm font-medium text-gray-400 mb-3">
            Quick Stats {intervalsConnected && <span className="text-emerald-400 text-[10px]">● live</span>}
          </h2>
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="text-[10px] text-gray-500 mb-1">Fitness (CTL)</div>
            <div className="text-2xl font-bold text-white">{Math.round(ctl)}</div>
          </div>
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="text-[10px] text-gray-500 mb-1">Fatigue (ATL)</div>
            <div className="text-2xl font-bold text-white">{Math.round(atl)}</div>
          </div>
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="text-[10px] text-gray-500 mb-1">Form (TSB)</div>
            <div className={`text-2xl font-bold ${tsb >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
              {tsb > 0 ? "+" : ""}{Math.round(tsb)}
            </div>
          </div>
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="text-[10px] text-gray-500 mb-1">Weight</div>
            <div className="text-2xl font-bold text-white">{weight}<span className="text-sm font-normal text-gray-500">kg</span></div>
            <div className="text-[10px] text-gray-500 mt-1">Target: {athlete?.target_weight || 71}kg</div>
          </div>
        </div>
      </div>
    </div>
  );
}
