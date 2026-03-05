"use client";
import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, ReferenceLine, BarChart, Bar } from "recharts";
import { getIntervalsAllWellness } from "../../lib/intervals";
import { getAthleteProfile, getEnergyLogsRange } from "../../lib/db";
import { getCalendarEvents } from "../../lib/calendar";
import { getBurnoutColor, getBurnoutBg } from "../../lib/utils";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
          <span className="text-gray-300">{p.name}:</span>
          <span className="font-medium text-white">{p.value !== null && p.value !== undefined ? (typeof p.value === "number" ? Math.round(p.value * 10) / 10 : p.value) : "—"}</span>
        </div>
      ))}
    </div>
  );
}

function SignalBar({ label, value, weight, color }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-500">{value}/100 ({weight}%)</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, color, subtext }) {
  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
      <div className="text-[10px] text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color || "text-white"}`}>
        {value !== null && value !== undefined ? (typeof value === "number" ? Math.round(value * 10) / 10 : value) : "—"}
        {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </div>
      {subtext && <div className="text-[10px] text-gray-500 mt-1">{subtext}</div>}
    </div>
  );
}

function MiniChart({ data, dataKey, color, height = 60, name }) {
  if (!data || data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} name={name} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function LoadPage() {
  const [allWellness, setAllWellness] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(90);
  const [athlete, setAthlete] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [avgEnergy, setAvgEnergy] = useState(null);

  useEffect(() => {
    async function load() {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const ws = weekStart.toISOString().split("T")[0];
      const we = weekEnd.toISOString().split("T")[0];

      const [wellness, profile, calData, energyData] = await Promise.all([
        getIntervalsAllWellness(),
        getAthleteProfile(),
        getCalendarEvents(ws, we),
        getEnergyLogsRange(ws, we),
      ]);
      setAllWellness(wellness || []);
      setAthlete(profile);

      if (calData?.dailySummary && Object.keys(calData.dailySummary).length > 0) {
        setCalendarData(calData.dailySummary);
        setCalendarConnected(true);
      }

      const energyValues = (energyData || []).filter((l) => l.energy).map((l) => l.energy);
      if (energyValues.length > 0) {
        setAvgEnergy((energyValues.reduce((a, b) => a + b, 0) / energyValues.length).toFixed(1));
      }

      setLoading(false);
    }
    load();
  }, []);

  const filteredWellness = useMemo(() => {
    if (timeRange === 0) return allWellness;
    const cutoff = new Date(Date.now() - timeRange * 86400000).toISOString().split("T")[0];
    return allWellness.filter((w) => w.date >= cutoff);
  }, [allWellness, timeRange]);

  // Latest values
  // Get the most recent entry that has each value (not all fields arrive on the same day)
  const latest = allWellness.length > 0 ? allWellness[allWellness.length - 1] : {};
  const findLatest = (field) => {
    for (let i = allWellness.length - 1; i >= 0; i--) {
      if (allWellness[i][field] !== null && allWellness[i][field] !== undefined) return allWellness[i][field];
    }
    return null;
  };
  const ctl = findLatest("ctl");
  const atl = findLatest("atl");
  const tsb = ctl && atl ? ctl - atl : null;
  const latestHRV = findLatest("hrv");
  const latestRHR = findLatest("resting_hr");
  const latestWeight = findLatest("weight");

  // PMC chart data
  const chartData = filteredWellness
    .filter((w) => w.ctl || w.atl)
    .map((w) => ({
      date: w.date,
      label: new Date(w.date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      CTL: w.ctl ? Math.round(w.ctl * 10) / 10 : null,
      ATL: w.atl ? Math.round(w.atl * 10) / 10 : null,
      TSB: w.ctl && w.atl ? Math.round((w.ctl - w.atl) * 10) / 10 : null,
    }));

  // HRV chart data
  const hrvData = filteredWellness
    .filter((w) => w.hrv)
    .map((w) => ({
      date: w.date,
      label: new Date(w.date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      hrv: w.hrv,
    }));

  // Resting HR chart data
  const rhrData = filteredWellness
    .filter((w) => w.resting_hr)
    .map((w) => ({
      date: w.date,
      label: new Date(w.date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      rhr: w.resting_hr,
    }));

  // Sleep chart data
  const sleepData = filteredWellness
    .filter((w) => w.sleep_duration)
    .map((w) => ({
      date: w.date,
      label: new Date(w.date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      sleep: typeof w.sleep_duration === "number" ? (w.sleep_duration > 100 ? Math.round(w.sleep_duration / 60 * 10) / 10 : w.sleep_duration) : null,
    }));

  // Weight chart data
  const weightData = filteredWellness
    .filter((w) => w.weight)
    .map((w) => ({
      date: w.date,
      label: new Date(w.date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      weight: w.weight,
    }));

  // Averages for the period
  const avgHRV = hrvData.length > 0 ? Math.round(hrvData.reduce((s, d) => s + d.hrv, 0) / hrvData.length) : null;
  const avgRHR = rhrData.length > 0 ? Math.round(rhrData.reduce((s, d) => s + d.rhr, 0) / rhrData.length) : null;
  const avgSleep = sleepData.length > 0 ? Math.round(sleepData.reduce((s, d) => s + (d.sleep || 0), 0) / sleepData.length * 10) / 10 : null;

  // 7-day HRV trend vs 30-day avg
  const last7HRV = hrvData.slice(-7);
  const avg7HRV = last7HRV.length > 0 ? Math.round(last7HRV.reduce((s, d) => s + d.hrv, 0) / last7HRV.length) : null;
  const hrvTrend = avgHRV && avg7HRV ? (avg7HRV > avgHRV ? "improving" : avg7HRV < avgHRV * 0.9 ? "declining" : "stable") : null;

  // Burnout from real data
  const burnoutTraining = atl ? Math.round(Math.min(100, (atl / 80) * 100)) : 40;
  const burnoutTSB = tsb !== null ? Math.round(Math.max(0, Math.min(100, 50 - tsb * 3))) : 40;
  const burnoutHRV = avgHRV && avg7HRV ? Math.round(Math.max(0, Math.min(100, 70 - (avg7HRV - avgHRV)))) : 40;
  const burnoutSleep = avgSleep ? Math.round(Math.max(0, Math.min(100, avgSleep < 7 ? 80 : avgSleep < 7.5 ? 55 : avgSleep < 8 ? 35 : 20))) : 40;
  const heavyWorkDays = Object.values(calendarData).filter((d) => d.density === "heavy" || d.density === "travel").length;
  const totalMeetings = Object.values(calendarData).reduce((s, d) => s + d.count, 0);
  const burnoutWork = calendarConnected ? Math.round(Math.min(100, heavyWorkDays * 20 + totalMeetings * 5)) : 40;
  const burnoutEnergy = avgEnergy ? Math.round(Math.max(0, Math.min(100, (5 - avgEnergy) * 25))) : 40;
  const burnoutTotal = Math.round(burnoutTraining * 0.25 + burnoutTSB * 0.15 + burnoutHRV * 0.15 + burnoutSleep * 0.15 + burnoutWork * 0.15 + burnoutEnergy * 0.15);
  const burnoutLevel = burnoutTotal < 40 ? "LOW" : burnoutTotal < 55 ? "MODERATE" : burnoutTotal < 75 ? "HIGH" : "CRITICAL";

  const tickInterval = chartData.length > 200 ? Math.floor(chartData.length / 10) : chartData.length > 60 ? Math.floor(chartData.length / 8) : Math.max(1, Math.floor(chartData.length / 6));

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-64"><div className="text-gray-500 text-sm">Loading training data...</div></div>;
  }

  return (
    <div className="p-6 max-w-[1400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Load Monitor</h1>
          <p className="text-sm text-gray-500 mt-1">
            PMC · HRV · Sleep · Weight · Work Stress · {allWellness.length} days
            {allWellness.length > 0 && <span className="text-emerald-400 ml-2">● Training</span>}
            {calendarConnected && <span className="text-blue-400 ml-2">● Calendar</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {[{ label: "30d", value: 30 }, { label: "90d", value: 90 }, { label: "180d", value: 180 }, { label: "1y", value: 365 }, { label: "All", value: 0 }].map((d) => (
            <button
              key={d.value}
              onClick={() => setTimeRange(d.value)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                timeRange === d.value ? "bg-brand-600/20 text-brand-400 border-brand-500/30" : "bg-surface-850 text-gray-400 border-white/5 hover:text-white"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        <StatCard label="Fitness (CTL)" value={ctl} color="text-blue-400" />
        <StatCard label="Fatigue (ATL)" value={atl} color="text-pink-400" />
        <StatCard label="Form (TSB)" value={tsb} color={tsb >= 0 ? "text-emerald-400" : "text-amber-400"} />
        <StatCard label="HRV" value={latestHRV} unit="ms" color="text-violet-400" subtext={hrvTrend === "improving" ? "↗ Trending up" : hrvTrend === "declining" ? "↘ Trending down" : hrvTrend === "stable" ? "→ Stable" : null} />
        <StatCard label="Resting HR" value={latestRHR} unit="bpm" color="text-cyan-400" />
        <StatCard label="Sleep" value={avgSleep} unit="hrs avg" color="text-indigo-400" />
      </div>

      {/* PMC Chart */}
      <div className="bg-surface-850 border border-white/5 rounded-xl p-5 mb-4">
        <h2 className="text-sm font-medium text-gray-300 mb-4">Performance Management Chart</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
              <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} interval={tickInterval} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={0} stroke="#374151" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="TSB" name="Form (TSB)" fill="#22c55e" fillOpacity={0.08} stroke="none" />
              <Line type="monotone" dataKey="CTL" name="Fitness (CTL)" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ATL" name="Fatigue (ATL)" stroke="#ec4899" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="TSB" name="Form (TSB)" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 text-sm">No PMC data for this period</div>
        )}
      </div>

      {/* HRV + Sleep + RHR Charts Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* HRV */}
        <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-300">HRV</h2>
            <div className="text-xs text-gray-500">
              {avg7HRV && <span className="text-violet-400 font-medium">{avg7HRV}ms</span>}
              {avgHRV && <span className="text-gray-600 ml-1">/ avg {avgHRV}ms</span>}
            </div>
          </div>
          {hrvData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <ComposedChart data={hrvData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 9 }} tickLine={false} interval={Math.max(1, Math.floor(hrvData.length / 5))} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 9 }} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip content={<ChartTooltip />} />
                {avgHRV && <ReferenceLine y={avgHRV} stroke="#7c3aed" strokeDasharray="4 4" strokeOpacity={0.5} />}
                <Bar dataKey="hrv" name="HRV" fill="#7c3aed" fillOpacity={0.6} radius={[2, 2, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[150px] flex items-center justify-center text-gray-600 text-xs">No HRV data</div>
          )}
        </div>

        {/* Sleep */}
        <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-300">Sleep Duration</h2>
            <div className="text-xs text-gray-500">
              {avgSleep && <span className="text-indigo-400 font-medium">{avgSleep}h</span>}
              <span className="text-gray-600 ml-1">avg</span>
            </div>
          </div>
          {sleepData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <ComposedChart data={sleepData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 9 }} tickLine={false} interval={Math.max(1, Math.floor(sleepData.length / 5))} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 9 }} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={8} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: "8h", fill: "#22c55e", fontSize: 9, position: "right" }} />
                <Bar dataKey="sleep" name="Sleep" fill="#6366f1" fillOpacity={0.6} radius={[2, 2, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[150px] flex items-center justify-center text-gray-600 text-xs">No sleep data</div>
          )}
        </div>

        {/* Resting HR */}
        <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-300">Resting HR</h2>
            <div className="text-xs text-gray-500">
              {latestRHR && <span className="text-cyan-400 font-medium">{latestRHR}bpm</span>}
              {avgRHR && <span className="text-gray-600 ml-1">/ avg {avgRHR}</span>}
            </div>
          </div>
          {rhrData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <ComposedChart data={rhrData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 9 }} tickLine={false} interval={Math.max(1, Math.floor(rhrData.length / 5))} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 9 }} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="rhr" name="Resting HR" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[150px] flex items-center justify-center text-gray-600 text-xs">No resting HR data</div>
          )}
        </div>
      </div>

      {/* Bottom Row: Burnout + Weight */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className={`rounded-xl border p-6 ${getBurnoutBg(burnoutTotal)}`}>
            <div className="text-sm text-gray-400 mb-2">Burnout Risk Score</div>
            <div className={`text-5xl font-bold ${getBurnoutColor(burnoutTotal)}`}>{burnoutTotal}</div>
            <div className={`text-sm mt-1 ${getBurnoutColor(burnoutTotal)}`}>{burnoutLevel}</div>
            <div className="text-[10px] text-gray-500 mt-3">6-signal composite score</div>
          </div>

          <div className="mt-4 bg-surface-850 border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Signal Breakdown</h3>
            <SignalBar label="Training Load (ATL)" value={burnoutTraining} weight={25} color="bg-blue-500" />
            <SignalBar label="Form (TSB)" value={burnoutTSB} weight={15} color="bg-emerald-500" />
            <SignalBar label="HRV Trend" value={burnoutHRV} weight={15} color="bg-violet-500" />
            <SignalBar label="Sleep Quality" value={burnoutSleep} weight={15} color="bg-indigo-500" />
            <SignalBar label={`Work Stress${calendarConnected ? "" : " (no cal)"}`} value={burnoutWork} weight={15} color="bg-orange-500" />
            <SignalBar label={`Self-Reported Energy${avgEnergy ? "" : " (no data)"}`} value={burnoutEnergy} weight={15} color="bg-yellow-500" />
          </div>
        </div>

        <div className="col-span-8">
          {weightData.length > 0 && (
            <div className="bg-surface-850 border border-white/5 rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-300">Weight Trend</h2>
                <div className="text-xs text-gray-500">Target: {athlete?.target_weight || 71}kg</div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <ComposedChart data={weightData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                  <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} interval={Math.max(1, Math.floor(weightData.length / 6))} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} domain={["auto", "auto"]} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={athlete?.target_weight || 71} stroke="#22c55e" strokeDasharray="6 3" label={{ value: "Target", fill: "#22c55e", fontSize: 10, position: "right" }} />
                  <Line type="monotone" dataKey="weight" name="Weight" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Override Tracker</h3>
                <p className="text-xs text-gray-500 mt-1">You have overridden 0 warnings this month</p>
              </div>
              <div className="text-xs text-gray-500">Last hard block: never · Streak without warning: 5 days ✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
