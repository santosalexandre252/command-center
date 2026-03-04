"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getRaceById, getAthleteProfile } from "../../../lib/db";
import { getIntervalsProfile } from "../../../lib/intervals";
import { daysUntil, formatDate, getRaceTypeIcon } from "../../../lib/utils";

function PlanButton({ label, emoji, planType, race, onGenerate, isActive, isLoading }) {
  return (
    <button
      onClick={() => onGenerate(planType)}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${
        isActive
          ? "bg-brand-600 text-white"
          : "bg-surface-900 text-gray-400 border border-white/5 hover:text-white hover:border-brand-500/30"
      } disabled:opacity-50`}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

export default function RaceDetailPage() {
  const params = useParams();
  const [race, setRace] = useState(null);
  const [athlete, setAthlete] = useState(null);
  const [fitness, setFitness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [planType, setPlanType] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      const [r, a, f] = await Promise.all([getRaceById(params.id), getAthleteProfile(), getIntervalsProfile()]);
      setRace(r);
      setAthlete(a);
      setFitness(f);
      setLoading(false);
    }
    load();
  }, [params.id]);

  const generatePlan = async (type) => {
    setPlanType(type);
    setPlan(null);
    setGenerating(true);
    try {
      const res = await fetch("/api/race-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ race, planType: type }),
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      console.error("Plan generation error:", err);
      setPlan("Error generating plan. Please try again.");
    }
    setGenerating(false);
  };

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading race...</div>;
  if (!race) return (
    <div className="p-6">
      <p className="text-gray-400">Race not found.</p>
      <Link href="/races" className="text-brand-400 text-sm mt-2 inline-block">← Back to races</Link>
    </div>
  );

  const days = daysUntil(race.date);
  const ctl = fitness?.ctl || athlete?.ctl || 42;
  const atl = fitness?.atl || 38;
  const tsb = fitness?.tsb ?? (ctl - atl);
  const fitnessPercent = Math.min(100, Math.round((ctl / race.target_ctl) * 100));
  const isOnTrack = fitnessPercent >= 80;

  return (
    <div className="p-6 max-w-[1400px]">
      <Link href="/races" className="text-xs text-gray-500 hover:text-gray-300 mb-4 inline-block">← Back to Race Hub</Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{getRaceTypeIcon(race.type)}</span>
          <div>
            <h1 className="text-2xl font-bold text-white">{race.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{race.location} · {formatDate(race.date)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-white">{days}</div>
          <div className="text-xs text-gray-500">days to go</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-4 space-y-4">
          <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Race Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-xs text-gray-500">Distance</span><span className="text-sm text-white">{race.distance} km</span></div>
              <div className="flex justify-between"><span className="text-xs text-gray-500">Elevation</span><span className="text-sm text-white">{race.elevation}m D+</span></div>
              <div className="flex justify-between"><span className="text-xs text-gray-500">Priority</span><span className="text-sm text-white">{race.priority}-Race</span></div>
              <div className="flex justify-between"><span className="text-xs text-gray-500">Type</span><span className="text-sm text-white">{race.type === "road_run" ? "Road" : race.type === "trail" ? "Trail" : "Cycling"}</span></div>
            </div>
          </div>

          <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Fitness Target</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-white">{Math.round(ctl)}</span>
              <span className="text-gray-500 text-sm mb-1">/ {race.target_ctl} CTL</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
              <div className={`h-2 rounded-full ${isOnTrack ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${fitnessPercent}%` }}></div>
            </div>
            <p className="text-xs text-gray-500">{fitnessPercent}% of target fitness</p>
          </div>

          <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Current Form</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-xs text-gray-500">CTL (Fitness)</span><span className="text-sm text-blue-400 font-medium">{Math.round(ctl)}</span></div>
              <div className="flex justify-between"><span className="text-xs text-gray-500">ATL (Fatigue)</span><span className="text-sm text-pink-400 font-medium">{Math.round(atl)}</span></div>
              <div className="flex justify-between"><span className="text-xs text-gray-500">TSB (Form)</span><span className={`text-sm font-medium ${tsb >= 0 ? "text-emerald-400" : "text-amber-400"}`}>{tsb > 0 ? "+" : ""}{Math.round(tsb)}</span></div>
              <div className="flex justify-between"><span className="text-xs text-gray-500">Weight</span><span className="text-sm text-white">{fitness?.weight || athlete?.weight || "?"}kg</span></div>
            </div>
          </div>
        </div>

        {/* Right Column — Race Plans */}
        <div className="col-span-8 space-y-4">
          {/* Plan Generator */}
          <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-4">AI Race Planner <span className="text-emerald-400 text-[10px] ml-1">● Llama 3.3</span></h3>
            <p className="text-xs text-gray-500 mb-4">Generate a personalized plan based on your current fitness data and recent training.</p>

            <div className="flex gap-3 mb-4">
              <PlanButton label="Full Race Plan" emoji="📋" planType="full" race={race} onGenerate={generatePlan} isActive={planType === "full"} isLoading={generating} />
              <PlanButton label="Pacing Strategy" emoji="⏱️" planType="pacing" race={race} onGenerate={generatePlan} isActive={planType === "pacing"} isLoading={generating} />
              <PlanButton label="Fuelling Timeline" emoji="⚡" planType="fuelling" race={race} onGenerate={generatePlan} isActive={planType === "fuelling"} isLoading={generating} />
            </div>

            {generating && (
              <div className="flex items-center gap-3 py-8 justify-center">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <span className="text-sm text-gray-400">Analyzing your fitness data and generating {planType === "full" ? "race plan" : planType === "pacing" ? "pacing strategy" : "fuelling timeline"}...</span>
              </div>
            )}

            {plan && !generating && (
              <div className="bg-surface-900 rounded-lg p-5 max-h-[500px] overflow-y-auto">
                <div className="prose prose-sm prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-gray-200 leading-relaxed">
                    {plan}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                  <button
                    onClick={() => navigator.clipboard.writeText(plan)}
                    className="px-3 py-1.5 bg-surface-850 text-gray-400 text-xs rounded-lg border border-white/5 hover:text-white"
                  >
                    📋 Copy to clipboard
                  </button>
                  <button
                    onClick={() => generatePlan(planType)}
                    className="px-3 py-1.5 bg-surface-850 text-gray-400 text-xs rounded-lg border border-white/5 hover:text-white"
                  >
                    🔄 Regenerate
                  </button>
                </div>
              </div>
            )}

            {!plan && !generating && (
              <div className="text-center py-8">
                <div className="text-gray-600 text-xs">Click a button above to generate your personalized race plan</div>
              </div>
            )}
          </div>

          {/* GPX placeholder */}
          <div className="bg-surface-850 border border-white/5 rounded-xl p-6 h-48 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-2">Interactive Race Map</div>
              <div className="text-gray-600 text-xs">Upload GPX file in Settings to render the course</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
