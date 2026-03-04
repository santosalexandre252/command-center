"use client";
import { useState, useEffect } from "react";
import { mockWeek, burnoutScore, weeklyTSS } from "../../lib/mockData";
import { getAthleteProfile, getRaces, getEnergyLog, upsertEnergyLog } from "../../lib/db";
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

function DayCard({ day, isToday, onEnergyChange }) {
  const [energy, setEnergy] = useState(day.energy);
  const workoutIcons = { run: "🏃", bike: "🚴", gym: "🏋️" };

  const handleEnergy = (val) => {
    setEnergy(val);
    if (onEnergyChange) onEnergyChange(day.date, val);
  };

  return (
    <div className={`rounded-xl border p-4 transition-all ${
      isToday ? "bg-brand-600/10 border-brand-500/30 ring-1 ring-brand-500/20"
        : day.completed ? "bg-surface-850 border-white/5 opacity-80"
        : "bg-surface-850 border-white/5"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className={`text-xs font-medium ${isToday ? "text-brand-400" : "text-gray-500"}`}>{isToday ? "TODAY" : day.day}</span>
          <div className="text-[10px] text-gray-600">{day.date.split("-").slice(1).join("/")}</div>
        </div>
        {day.completed && <span className="text-emerald-500 text-sm">✓</span>}
      </div>
      <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium mb-2 ${getWorkDensityColor(day.workDensity)}`}>{day.workDensity}</div>
      <div className="mt-2 mb-3">
        <div className="flex items-center gap-1.5 text-sm">
          <span>{workoutIcons[day.workout.icon]}</span>
          <span className="font-medium text-gray-200">{day.workout.name}</span>
        </div>
        <div className="flex gap-3 mt-1 text-[10px] text-gray-500">
          <span>{day.workout.duration}min</span>
          <span>TSS {day.workout.tss}</span>
          <span>{day.workout.zone}</span>
        </div>
      </div>
      <div>
        <div className="text-[10px] text-gray-500 mb-1">Energy</div>
        <EnergyStars value={energy || 0} onChange={handleEnergy} />
      </div>
    </div>
  );
}

function RaceCountdown({ race, athlete }) {
  const days = daysUntil(race.date);
  const ctl = athlete?.ctl || 42;
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
          <span>Fitness: CTL {ctl}/{race.target_ctl}</span>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [profileData, racesData] = await Promise.all([
        getAthleteProfile(),
        getRaces(),
      ]);
      setAthlete(profileData);
      setRaces(racesData);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleEnergyChange = async (date, value) => {
    await upsertEnergyLog({ date, energy: value });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Loading dashboard...</div>
      </div>
    );
  }

  // Use DB athlete or fallback
  const ath = athlete || { weight: 76.2, target_weight: 71, body_fat: 22, target_body_fat: 15, ctl: 42, atl: 38, tsb: 4 };

  return (
    <div className="p-6 max-w-[1400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Weekly Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">Week of March 2–8, 2026 · Build Phase — Week 3</p>
        </div>
        <BurnoutBadge score={burnoutScore} />
      </div>

      <div className="bg-surface-850 border border-white/5 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Weekly TSS</span>
          <span className="text-sm text-gray-400">{weeklyTSS.actual} / {weeklyTSS.planned}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${weeklyTSS.percentage}%` }}></div>
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-500">
          <span>{weeklyTSS.percentage}% complete</span>
          <span>{weeklyTSS.planned - weeklyTSS.actual} TSS remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 mb-6">
        {mockWeek.map((day) => (
          <DayCard key={day.day} day={day} isToday={day.isToday} onEnergyChange={handleEnergyChange} />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Race Countdowns</h2>
          <div className="grid grid-cols-4 gap-3">
            {races.map((race) => (
              <RaceCountdown key={race.id} race={race} athlete={ath} />
            ))}
          </div>
        </div>

        <div className="col-span-4 space-y-3">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Quick Stats</h2>
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="text-[10px] text-gray-500 mb-1">Fitness (CTL)</div>
            <div className="text-2xl font-bold text-white">{ath.ctl || 42}</div>
          </div>
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="text-[10px] text-gray-500 mb-1">Fatigue (ATL)</div>
            <div className="text-2xl font-bold text-white">{ath.atl || 38}</div>
          </div>
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="text-[10px] text-gray-500 mb-1">Form (TSB)</div>
            <div className={`text-2xl font-bold ${(ath.tsb || 4) >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
              {(ath.tsb || 4) > 0 ? "+" : ""}{ath.tsb || 4}
            </div>
          </div>
          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="text-[10px] text-gray-500 mb-1">Weight</div>
            <div className="text-2xl font-bold text-white">{ath.weight}<span className="text-sm font-normal text-gray-500">kg</span></div>
            <div className="text-[10px] text-gray-500 mt-1">Target: {ath.target_weight}kg · {ath.body_fat}% → {ath.target_body_fat}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
