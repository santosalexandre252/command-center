"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart, Area } from "recharts";
import { getRaceById, getAthleteProfile } from "../../../lib/db";
import { getIntervalsProfile } from "../../../lib/intervals";
import { daysUntil, formatDate, getRaceTypeIcon } from "../../../lib/utils";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p) => (
        <div key={`${p.dataKey}-${p.color}`} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
          <span className="text-gray-300">{p.name}:</span>
          <span className="font-medium text-white">{p.value !== null ? Math.round(p.value * 10) / 10 : "—"}</span>
        </div>
      ))}
    </div>
  );
}

function ReadinessGauge({ score, label }) {
  const color = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-yellow-400" : score >= 40 ? "text-amber-400" : "text-red-400";
  const bg = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-yellow-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${color}`}>{score}%</div>
      <div className="text-[10px] text-gray-500 mt-1">{label}</div>
      <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
        <div className={`h-1.5 rounded-full ${bg}`} style={{ width: `${Math.min(100, score)}%` }}></div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, weight }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-yellow-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-500">{score}% ({weight}%)</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(100, score)}%` }}></div>
      </div>
    </div>
  );
}

function PlanButton({ label, emoji, planType, onGenerate, isActive, isLoading }) {
  return (
    <button onClick={() => onGenerate(planType)} disabled={isLoading} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${isActive ? "bg-brand-600 text-white" : "bg-surface-900 text-gray-400 border border-white/5 hover:text-white hover:border-brand-500/30"} disabled:opacity-50`}>
      <span>{emoji}</span><span>{label}</span>
    </button>
  );
}

export default function RaceDetailPage() {
  const params = useParams();
  const [race, setRace] = useState(null);
  const [athlete, setAthlete] = useState(null);
  const [fitness, setFitness] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readinessLoading, setReadinessLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [planType, setPlanType] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("readiness");

  useEffect(() => {
    async function load() {
      const [r, a, f] = await Promise.all([getRaceById(params.id), getAthleteProfile(), getIntervalsProfile()]);
      setRace(r);
      setAthlete(a);
      setFitness(f);
      setLoading(false);
      if (r) {
        setReadinessLoading(true);
        try {
          const res = await fetch("/api/race-readiness", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ race: r }) });
          if (res.ok) setReadiness(await res.json());
        } catch (err) { console.error(err); }
        setReadinessLoading(false);
      }
    }
    load();
  }, [params.id]);

  const generatePlan = async (type) => {
    setPlanType(type); setPlan(null); setGenerating(true);
    try {
      const res = await fetch("/api/race-plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ race, planType: type }) });
      if (res.ok) { const data = await res.json(); setPlan(data.plan); }
    } catch (err) { console.error(err); }
    setGenerating(false);
  };

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading race...</div>;
  if (!race) return <div className="p-6"><p className="text-gray-400">Race not found.</p><Link href="/races" className="text-brand-400 text-sm mt-2 inline-block">← Back</Link></div>;

  const days = daysUntil(race.date);
  const ctl = readiness?.ctl || fitness?.ctl || 42;
  const scores = readiness?.scores;

  return (
    <div className="p-6 max-w-[1400px]">
      <Link href="/races" className="text-xs text-gray-500 hover:text-gray-300 mb-4 inline-block">← Back to Race Hub</Link>

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
          {readiness && <div className="text-xs text-gray-500 mt-1">{readiness.weeksToRace} weeks</div>}
        </div>
      </div>

      {scores && (
        <div className={`rounded-xl border p-5 mb-6 ${scores.overall >= 80 ? "bg-emerald-500/5 border-emerald-500/20" : scores.overall >= 60 ? "bg-yellow-500/5 border-yellow-500/20" : "bg-amber-500/5 border-amber-500/20"}`}>
          <div className="grid grid-cols-6 gap-6">
            <ReadinessGauge score={scores.overall} label="Overall Readiness" />
            <ReadinessGauge score={scores.fitness} label="Fitness (CTL)" />
            <ReadinessGauge score={scores.volume} label="Volume" />
            <ReadinessGauge score={scores.longRun} label={race.type === "cycling" ? "Long Ride" : "Long Run"} />
            <ReadinessGauge score={scores.form} label="Form (TSB)" />
            <ReadinessGauge score={scores.weight} label="Weight" />
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {[{ id: "readiness", label: "📊 Readiness" }, { id: "plan", label: "📋 Race Plan" }, { id: "info", label: "ℹ️ Race Info" }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm rounded-lg transition-all ${activeTab === tab.id ? "bg-brand-600/20 text-brand-400 border border-brand-500/30" : "bg-surface-850 text-gray-400 border border-white/5 hover:text-white"}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab === "readiness" && (
        <div className="space-y-4">
          {readinessLoading && <div className="text-center py-12 text-gray-500 text-sm">Analyzing your training data...</div>}
          {readiness && !readinessLoading && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 space-y-4">
                <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Score Breakdown</h3>
                  <ScoreBar label="Fitness (CTL)" score={scores.fitness} weight={30} />
                  <ScoreBar label="Volume Consistency" score={scores.volume} weight={20} />
                  <ScoreBar label={race.type === "cycling" ? "Long Ride %" : "Long Run %"} score={scores.longRun} weight={25} />
                  <ScoreBar label="Form (TSB)" score={scores.form} weight={10} />
                  <ScoreBar label="Race Weight" score={scores.weight} weight={15} />
                </div>
                <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Key Numbers</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-xs text-gray-500">CTL Now → Target</span><span className="text-sm text-white">{readiness.ctl} → {race.target_ctl}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-gray-500">CTL Gap</span><span className={`text-sm font-medium ${readiness.ctlGap <= 0 ? "text-emerald-400" : "text-amber-400"}`}>{readiness.ctlGap <= 0 ? "✓ Reached" : `+${readiness.ctlGap}`}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-gray-500">Ramp Needed</span><span className="text-sm text-white">{readiness.weeklyRampNeeded > 0 ? `+${readiness.weeklyRampNeeded}/wk` : "Maintain"}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-gray-500">Longest {race.type === "cycling" ? "Ride" : "Run"}</span><span className="text-sm text-white">{readiness.longestSession ? `${readiness.longestSession.distance}km (${readiness.longestDistPct}%)` : "—"}</span></div>
                    {(race.type === "trail" || race.type === "cycling") && <div className="flex justify-between"><span className="text-xs text-gray-500">Elevation (12wk)</span><span className="text-sm text-white">{readiness.totalElevation}m</span></div>}
                    <div className="flex justify-between"><span className="text-xs text-gray-500">Weight</span><span className="text-sm text-white">{readiness.weight}kg</span></div>
                    {readiness.weightTrend && <div className="flex justify-between"><span className="text-xs text-gray-500">Race Day Projection</span><span className="text-sm text-white">{readiness.weightTrend.projectedRaceDay}kg</span></div>}
                  </div>
                </div>
              </div>
              <div className="col-span-8 space-y-4">
                {readiness.ctlByWeek.length > 0 && (
                  <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">CTL Progression → Target {race.target_ctl}</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <ComposedChart data={readiness.ctlByWeek} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                        <XAxis dataKey="week" tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(w) => `W${w}`} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} domain={["auto", "auto"]} />
                        <Tooltip content={<ChartTooltip />} />
                        <ReferenceLine y={race.target_ctl} stroke="#22c55e" strokeDasharray="6 3" label={{ value: `Target`, fill: "#22c55e", fontSize: 10, position: "right" }} />
                        <Area type="monotone" dataKey="ctl" fill="#3b82f6" fillOpacity={0.1} stroke="none" />
                        <Line type="monotone" dataKey="ctl" name="CTL" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {readiness.weeklyTSS.length > 0 && (
                  <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">Weekly Training Load</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={readiness.weeklyTSS} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                        <XAxis dataKey="week" tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(w) => `W${w}`} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="tss" name="TSS" fill="#8b5cf6" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {readiness.longSessions.length > 0 && (
                  <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">{race.type === "cycling" ? "Long Ride" : "Long Run"} Progression → {race.distance}km</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <ComposedChart data={readiness.longSessions} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                        <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 9 }} tickFormatter={(d) => new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })} interval={Math.max(0, Math.floor(readiness.longSessions.length / 6))} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
                        <Tooltip content={<ChartTooltip />} />
                        <ReferenceLine y={race.distance} stroke="#f59e0b" strokeDasharray="6 3" label={{ value: `Race`, fill: "#f59e0b", fontSize: 10, position: "right" }} />
                        <Bar dataKey="distance" name="Distance (km)" fill="#06b6d4" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "plan" && (
        <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">AI Race Planner <span className="text-emerald-400 text-[10px] ml-1">● Llama 3.3</span></h3>
          <div className="flex gap-3 mb-4">
            <PlanButton label="Full Plan" emoji="📋" planType="full" onGenerate={generatePlan} isActive={planType === "full"} isLoading={generating} />
            <PlanButton label="Pacing" emoji="⏱️" planType="pacing" onGenerate={generatePlan} isActive={planType === "pacing"} isLoading={generating} />
            <PlanButton label="Fuelling" emoji="⚡" planType="fuelling" onGenerate={generatePlan} isActive={planType === "fuelling"} isLoading={generating} />
          </div>
          {generating && <div className="flex items-center gap-3 py-8 justify-center"><div className="flex gap-1"><div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div><div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div></div><span className="text-sm text-gray-400">Generating...</span></div>}
          {plan && !generating && (
            <div className="bg-surface-900 rounded-lg p-5 max-h-[500px] overflow-y-auto">
              <div className="whitespace-pre-wrap text-sm text-gray-200 leading-relaxed">{plan}</div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                <button onClick={() => navigator.clipboard.writeText(plan)} className="px-3 py-1.5 bg-surface-850 text-gray-400 text-xs rounded-lg border border-white/5 hover:text-white">📋 Copy</button>
                <button onClick={() => generatePlan(planType)} className="px-3 py-1.5 bg-surface-850 text-gray-400 text-xs rounded-lg border border-white/5 hover:text-white">🔄 Regenerate</button>
              </div>
            </div>
          )}
          {!plan && !generating && <div className="text-center py-8 text-gray-600 text-xs">Click a button above to generate your plan</div>}
        </div>
      )}

      {activeTab === "info" && (
        <div className="grid grid-cols-12 gap-6">
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
              <h3 className="text-sm font-medium text-gray-300 mb-4">Current Form</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-xs text-gray-500">CTL</span><span className="text-sm text-blue-400 font-medium">{Math.round(ctl)}</span></div>
                <div className="flex justify-between"><span className="text-xs text-gray-500">ATL</span><span className="text-sm text-pink-400 font-medium">{Math.round(readiness?.atl || fitness?.atl || 38)}</span></div>
                <div className="flex justify-between"><span className="text-xs text-gray-500">TSB</span><span className={`text-sm font-medium ${(readiness?.tsb || 0) >= 0 ? "text-emerald-400" : "text-amber-400"}`}>{Math.round(readiness?.tsb || fitness?.tsb || 0)}</span></div>
              </div>
            </div>
          </div>
          <div className="col-span-8">
            <div className="bg-surface-850 border border-white/5 rounded-xl p-6 h-64 flex items-center justify-center">
              <div className="text-center"><div className="text-gray-500 text-sm mb-2">Interactive Race Map</div><div className="text-gray-600 text-xs">GPX maps coming in Build 7</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
