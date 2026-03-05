"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { getRaceById, getAthleteProfile } from "../../../lib/db";
import { getIntervalsProfile, getIntervalsActivities, getIntervalsWellness } from "../../../lib/intervals";
import { daysUntil, formatDate, getRaceTypeIcon } from "../../../lib/utils";
import { calculateRaceReadiness } from "../../../lib/guardrails";

function PlanButton({ label, emoji, planType, onGenerate, isActive, isLoading }) {
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

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
          <span className="text-gray-300">{p.name}:</span>
          <span className="font-medium text-white">{p.value !== null ? Math.round(p.value) : "—"}</span>
        </div>
      ))}
    </div>
  );
}

function ReadinessGauge({ label, percent, color, subtext }) {
  return (
    <div className="bg-surface-900 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-400">{label}</span>
        <span className={`text-xs font-medium ${color}`}>{percent}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all ${
          percent >= 90 ? "bg-emerald-500" : percent >= 70 ? "bg-blue-500" : percent >= 50 ? "bg-amber-500" : "bg-red-500"
        }`} style={{ width: `${Math.min(100, percent)}%` }}></div>
      </div>
      {subtext && <div className="text-[9px] text-gray-500 mt-1">{subtext}</div>}
    </div>
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
  const [activities, setActivities] = useState([]);
  const [wellness, setWellness] = useState([]);

  useEffect(() => {
    async function load() {
      const oldest = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];
      const newest = new Date().toISOString().split("T")[0];

      const [r, a, f, acts, well] = await Promise.all([
        getRaceById(params.id),
        getAthleteProfile(),
        getIntervalsProfile(),
        getIntervalsActivities(oldest, newest),
        getIntervalsWellness(oldest, newest),
      ]);
      setRace(r);
      setAthlete(a);
      setFitness(f);
      setActivities(acts || []);
      setWellness(well || []);
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

  // Weekly volume data for chart
  const weeklyVolumeData = useMemo(() => {
    if (!activities || activities.length === 0) return [];
    const weeks = {};
    activities.forEach((a) => {
      if (!a.date) return;
      const d = new Date(a.date + "T12:00:00");
      const weekStart = new Date(d);
      const day = weekStart.getDay();
      weekStart.setDate(weekStart.getDate() - day + (day === 0 ? -6 : 1));
      const key = weekStart.toISOString().split("T")[0];
      if (!weeks[key]) weeks[key] = { tss: 0, duration: 0, count: 0 };
      weeks[key].tss += a.tss || 0;
      weeks[key].duration += a.moving_time ? a.moving_time / 3600 : 0;
      weeks[key].count += 1;
    });
    return Object.entries(weeks)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        week: new Date(date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        tss: Math.round(data.tss),
        hours: Math.round(data.duration * 10) / 10,
        sessions: data.count,
      }));
  }, [activities]);

  // Long sessions for the race type
  const longSessions = useMemo(() => {
    if (!race || !activities) return [];
    const isRunRace = race.type === "road_run" || race.type === "trail";
    const isCycleRace = race.type === "cycling";
    return activities
      .filter((a) => {
        if (isRunRace) return a.type === "Run";
        if (isCycleRace) return a.type === "Ride" || a.type === "VirtualRide";
        return false;
      })
      .filter((a) => a.distance && parseFloat(a.distance) > 0)
      .map((a) => ({ date: a.date, distance: parseFloat(a.distance), duration: a.moving_time ? a.moving_time / 60 : 0, name: a.name }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [activities, race]);

  // Race readiness
  const readiness = useMemo(() => {
    if (!race) return null;
    const days = daysUntil(race.date);
    const weeksRemaining = Math.max(0, Math.ceil(days / 7));
    const weeklyVolumes = weeklyVolumeData.map((w) => w.tss);
    const currentWeight = fitness?.weight || athlete?.weight || null;

    return calculateRaceReadiness({
      race: { ...race, target_weight: athlete?.target_weight || 71 },
      currentCTL: fitness?.ctl || athlete?.ctl || 0,
      weeksRemaining,
      weeklyVolumes,
      longSessions,
      currentWeight,
    });
  }, [race, fitness, athlete, weeklyVolumeData, longSessions]);

  // Weight data for mini chart
  const weightData = useMemo(() => {
    return wellness
      .filter((w) => w.weight)
      .map((w) => ({ date: w.date, weight: w.weight }))
      .slice(-30);
  }, [wellness]);

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
  const readinessColors = { ready: "text-emerald-400", on_track: "text-blue-400", behind: "text-amber-400", at_risk: "text-red-400" };
  const readinessLabels = { ready: "Race Ready", on_track: "On Track", behind: "Behind Schedule", at_risk: "At Risk" };

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
            {readiness && readiness.ctlRampNeeded > 0 && (
              <p className="text-[10px] text-gray-500 mt-2">Need +{readiness.ctlRampNeeded}/week for {readiness.weeksRemaining} weeks</p>
            )}
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

        {/* Right Column */}
        <div className="col-span-8 space-y-4">
          {/* Race Readiness Tracker */}
          {readiness && (
            <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-300">Race Readiness</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  readiness.readiness === "ready" ? "bg-emerald-500/10 text-emerald-400" :
                  readiness.readiness === "on_track" ? "bg-blue-500/10 text-blue-400" :
                  readiness.readiness === "behind" ? "bg-amber-500/10 text-amber-400" :
                  "bg-red-500/10 text-red-400"
                }`}>
                  {readinessLabels[readiness.readiness]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <ReadinessGauge
                  label="CTL vs Target"
                  percent={readiness.ctlPercent}
                  color={readinessColors[readiness.readiness]}
                  subtext={readiness.ctlGap > 0 ? `${readiness.ctlGap} CTL gap · ${readiness.weeksRemaining} weeks left` : "Target reached"}
                />
                {readiness.longRunProgress && (
                  <ReadinessGauge
                    label={race.type === "cycling" ? "Long Ride vs Target" : "Long Run vs Target"}
                    percent={readiness.longRunProgress.percent}
                    color={readiness.longRunProgress.percent >= 80 ? "text-emerald-400" : "text-amber-400"}
                    subtext={`Longest: ${readiness.longRunProgress.longest.toFixed(1)}km / ${readiness.longRunProgress.target}km target`}
                  />
                )}
                {readiness.weightStatus && (
                  <ReadinessGauge
                    label="Weight Target"
                    percent={Math.max(0, Math.min(100, 100 - Math.round((readiness.weightStatus.gap / (readiness.weightStatus.current - readiness.weightStatus.target + 0.01)) * 100)))}
                    color={readiness.weightStatus.onTrack ? "text-emerald-400" : "text-amber-400"}
                    subtext={`${readiness.weightStatus.current}kg → ${readiness.weightStatus.target}kg (${readiness.weightStatus.gap > 0 ? "-" + readiness.weightStatus.gap + "kg to go" : "Target reached"})`}
                  />
                )}
                <ReadinessGauge
                  label="Volume Trend"
                  percent={readiness.volumeTrend === "building" ? 85 : readiness.volumeTrend === "flat" ? 50 : 25}
                  color={readiness.volumeTrend === "building" ? "text-emerald-400" : readiness.volumeTrend === "flat" ? "text-yellow-400" : "text-red-400"}
                  subtext={readiness.volumeTrend === "building" ? "Weekly volume increasing" : readiness.volumeTrend === "flat" ? "Volume plateau — consider ramping" : readiness.volumeTrend === "declining" ? "Volume declining" : "Need more data"}
                />
              </div>

              {/* Weekly Volume Chart */}
              {weeklyVolumeData.length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-400 mb-2">Weekly TSS (Last {weeklyVolumeData.length} weeks)</h4>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={weeklyVolumeData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <XAxis dataKey="week" tick={{ fill: "#6b7280", fontSize: 9 }} tickLine={false} interval={Math.max(0, Math.floor(weeklyVolumeData.length / 6))} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 9 }} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="tss" name="Weekly TSS" fill="#3b82f6" fillOpacity={0.6} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Long Sessions List */}
              {longSessions.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xs text-gray-400 mb-2">{race.type === "cycling" ? "Long Rides" : "Long Runs"} (Last 90 days)</h4>
                  <div className="space-y-1">
                    {longSessions.slice(-5).reverse().map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-surface-900 rounded-lg">
                        <div className="text-xs text-gray-300">{s.name || (race.type === "cycling" ? "Ride" : "Run")}</div>
                        <div className="text-xs text-gray-400">
                          <span className="text-white font-medium">{s.distance.toFixed(1)}km</span>
                          <span className="text-gray-500 ml-2">{Math.round(s.duration)}min</span>
                          <span className="text-gray-600 ml-2">{s.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Plan Generator */}
          <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-4">AI Race Planner <span className="text-emerald-400 text-[10px] ml-1">● Llama 3.3</span></h3>
            <p className="text-xs text-gray-500 mb-4">Generate a personalized plan based on your current fitness data and recent training.</p>

            <div className="flex gap-3 mb-4">
              <PlanButton label="Full Race Plan" emoji="📋" planType="full" onGenerate={generatePlan} isActive={planType === "full"} isLoading={generating} />
              <PlanButton label="Pacing Strategy" emoji="⏱️" planType="pacing" onGenerate={generatePlan} isActive={planType === "pacing"} isLoading={generating} />
              <PlanButton label="Fuelling Timeline" emoji="⚡" planType="fuelling" onGenerate={generatePlan} isActive={planType === "fuelling"} isLoading={generating} />
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
                  <div className="whitespace-pre-wrap text-sm text-gray-200 leading-relaxed">{plan}</div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                  <button onClick={() => navigator.clipboard.writeText(plan)} className="px-3 py-1.5 bg-surface-850 text-gray-400 text-xs rounded-lg border border-white/5 hover:text-white">📋 Copy to clipboard</button>
                  <button onClick={() => generatePlan(planType)} className="px-3 py-1.5 bg-surface-850 text-gray-400 text-xs rounded-lg border border-white/5 hover:text-white">🔄 Regenerate</button>
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
