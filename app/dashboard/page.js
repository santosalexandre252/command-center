"use client";
import { useState } from "react";
import { mockWeek, athlete, races, burnoutScore, weeklyTSS } from "../../lib/mockData";
import { daysUntil, getBurnoutColor, getBurnoutBg, getWorkDensityColor, getRaceTypeIcon } from "../../lib/utils";

function EnergyStars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className={`energy-star text-lg ${star <= value ? "text-yellow-400" : "text-gray-600"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function BurnoutBadge({ score }) {
  const labels = { low: "Low", moderate: "Moderate", high: "High", critical: "Critical" };
  const level = score.total < 40 ? "low" : score.total < 55 ? "moderate" : score.total < 75 ? "high" : "critical";
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${getBurnoutBg(score.total)} ${score.total >= 75 ? "burnout-critical" : ""}`}>
      <span className={`w-2 h-2 rounded-full ${score.total < 40 ? "bg-emerald-500" : score.total < 55 ? "bg-yellow-400" : score.total < 75 ? "bg-amber-500" : "bg-red-500"}`}></span>
      <span className={getBurnoutColor(score.total)}>Burnout: {score.total}/100 — {labels[level]}</span>
    </div>
  );
}

function DayCard({ day, isToday }) {
  const [energy, setEnergy] = useState(day.energy);
  const workoutIcons = { run: "🏃", bike: "🚴", gym: "🏋️" };

  return (
    <div className={`rounded-xl border p-4 transition-all ${
      isToday
        ? "bg-brand-600/10 border-brand-500/30 ring-1 ring-brand-500/20"
        : day.completed
        ? "bg-surface-850 border-white/5 opacity-80"
        : "bg-surface-850 border-white/5"
    }`}>
      {/* Day header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className={`text-xs font-medium ${isToday ? "text-brand-400" : "text-gray-500"}`}>
            {isToday ? "TODAY" : day.day}
          </span>
          <div className="text-[10px] text-gray-600">{day.date.split("-").slice(1).join("/")}</div>
        </div>
        {day.completed && <span className="text-emerald-500 text-sm">✓</span>}
      </div>

      {/* Work density tag */}
      <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium mb-2 ${getWorkDensityColor(day.workDensity)}`}>
        {day.workDensity}
      </div>

      {/* Workout */}
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

      {/* Energy */}
      <div>
        <div className="text-[10px] text-gray-500 mb-1">Energy</div>
        <EnergyStars value={energy || 0} onChange={setEnergy} />
      </div>
    </div>
  );
}

function RaceCountdown({ race }) {
  const days = daysUntil(race.date);
  const fitnessPercent = Math.min(100, Math.round((athlete.ctl / race.targetCTL) * 100));
  const isOnTrack = fitnessPercent >= 80;

  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-4 card-hover">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>{getRaceTypeIcon(race.type)}</span>
          <span className="text-sm font-medium text-gray-200">{race.shortName}</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${race.priority === "A" ? "bg-brand-600/20 text-brand-400" : "bg-gray-700/50 text-gray-400"}`}>
          {race.priority}
        </span>
      </div>
      <div className="text-2xl font-bold text-white">{days}<span className="text-sm font-normal text-gray-500 ml-1">days</span></div>
      <div className="mt-2">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
          <span>Fitness: CTL {athlete.ctl}/{race.targetCTL}</span>
          <span className={isOnTrack ? "text-emerald-400" : "text-amber-400"}>{isOnTrack ? "On track" : "Behind"}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${isOnTrack ? "bg-emerald-500" : "bg-amber-500"}`}
            style={{ width: `${fitnessPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Weekly Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">Week of March 2–8, 2026 · Build Phase — Week 3</p>
        </div>
        <BurnoutBadge score={burnoutScore} />
      </div>

      {/* TSS Progress */}
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

      {/* Weekly Grid */}
      <div className="grid grid-cols-7 gap-3 mb-6">
        {mockWeek.map((day) => (
          <DayCard key={day.day} day={day} isToday={day.isToday} />
        ))}
      </div>

      {/* Bottom Row: Race Countdowns + Stats */}
      <div className="grid grid-cols-12 gap-4">
        {/* Race Countdowns */}
        <div className="col-span-8">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Race Countdowns</h2>
          <div className="grid grid-cols-4 gap-3">
            {races.map((race) => (
              <RaceCountdown key={race.id} race={race} />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-span-4 space-y-3">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Quick Stats</h2>

          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="text-[10px] text-gray-500 mb-1">Fitness (CTL)</div>
            <div className="text-2xl font-bold text-white">{athlete.ctl}</div>
          </div>

          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="text-[10px] text-gray-500 mb-1">Fatigue (ATL)</div>
            <div className="text-2xl font-bold text-white">{athlete.atl}</div>
          </div>

          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="text-[10px] text-gray-500 mb-1">Form (TSB)</div>
            <div className={`text-2xl font-bold ${athlete.tsb >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
              {athlete.tsb > 0 ? "+" : ""}{athlete.tsb}
            </div>
          </div>

          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="text-[10px] text-gray-500 mb-1">Weight</div>
            <div className="text-2xl font-bold text-white">{athlete.weight}<span className="text-sm font-normal text-gray-500">kg</span></div>
            <div className="text-[10px] text-gray-500 mt-1">Target: {athlete.targetWeight}kg · {athlete.bodyFat}% → {athlete.targetBodyFat}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
