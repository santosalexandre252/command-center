"use client";
import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, ReferenceLine } from "recharts";
import { getIntervalsAllWellness } from "../../lib/intervals";
import { getAthleteProfile } from "../../lib/db";
import { getBurnoutColor, getBurnoutBg } from "../../lib/utils";

function PMCTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
          <span className="text-gray-300">{p.name}:</span>
          <span className="font-medium text-white">{p.value !== null ? Math.round(p.value * 10) / 10 : "—"}</span>
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

function StatCard({ label, value, unit, color }) {
  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
      <div className="text-[10px] text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color || "text-white"}`}>
        {value !== null && value !== undefined ? Math.round(value * 10) / 10 : "—"}
        {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </div>
    </div>
  );
}

export default function LoadPage() {
  const [allWellness, setAllWellness] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(90);
  const [athlete, setAthlete] = useState(null);

  // Fetch ALL data once on mount
  useEffect(() => {
    async function load() {
      const [wellness, profile] = await Promise.all([
        getIntervalsAllWellness(),
        getAthleteProfile(),
      ]);
      setAllWellness(wellness || []);
      setAthlete(profile);
      setLoading(false);
    }
    load();
  }, []);

  // Filter by time range client-side (0 = all data)
  const filteredWellness = useMemo(() => {
    if (timeRange === 0) return allWellness;
    const cutoff = new Date(Date.now() - timeRange * 86400000).toISOString().split("T")[0];
    return allWellness.filter((w) => w.date >= cutoff);
  }, [allWellness, timeRange]);

  // Latest values
  const latest = allWellness.length > 0 ? allWellness[allWellness.length - 1] : {};
  const ctl = latest.ctl;
  const atl = latest.atl;
  const tsb = ctl && atl ? ctl - atl : null;

  // Prepare PMC chart data
  const chartData = filteredWellness
    .filter((w) => w.ctl || w.atl)
    .map((w) => ({
      date: w.date,
      label: new Date(w.date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      CTL: w.ctl ? Math.round(w.ctl * 10) / 10 : null,
      ATL: w.atl ? Math.round(w.atl * 10) / 10 : null,
      TSB: w.ctl && w.atl ? Math.round((w.ctl - w.atl) * 10) / 10 : null,
    }));

  // Weight chart data
  const weightData = filteredWellness
    .filter((w) => w.weight)
    .map((w) => ({
      date: w.date,
      label: new Date(w.date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      weight: w.weight,
    }));

  // Calculate burnout from real data
  const burnoutTraining = atl ? Math.min(100, Math.round((atl / 80) * 100)) : 40;
  const burnoutTSB = tsb !== null ? Math.max(0, Math.min(100, 50 - tsb * 3)) : 40;
  const burnoutTotal = Math.round(burnoutTraining * 0.5 + burnoutTSB * 0.5);
  const burnoutLevel = burnoutTotal < 40 ? "LOW" : burnoutTotal < 55 ? "MODERATE" : burnoutTotal < 75 ? "HIGH" : "CRITICAL";

  // X-axis tick interval based on data size
  const tickInterval = chartData.length > 200 ? Math.floor(chartData.length / 10) : chartData.length > 60 ? Math.floor(chartData.length / 8) : Math.floor(chartData.length / 6);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Loading all training data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Load Monitor</h1>
          <p className="text-sm text-gray-500 mt-1">
            Performance Management Chart · {allWellness.length} days of data
            {allWellness.length > 0 && <span className="text-emerald-400 ml-2">● live</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { label: "30d", value: 30 },
            { label: "90d", value: 90 },
            { label: "180d", value: 180 },
            { label: "1y", value: 365 },
            { label: "All", value: 0 },
          ].map((d) => (
            <button
              key={d.value}
              onClick={() => setTimeRange(d.value)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                timeRange === d.value
                  ? "bg-brand-600/20 text-brand-400 border-brand-500/30"
                  : "bg-surface-850 text-gray-400 border-white/5 hover:text-white"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <StatCard label="Fitness (CTL)" value={ctl} color="text-blue-400" />
        <StatCard label="Fatigue (ATL)" value={atl} color="text-pink-400" />
        <StatCard label="Form (TSB)" value={tsb} color={tsb >= 0 ? "text-emerald-400" : "text-amber-400"} />
        <StatCard label="Weight" value={latest.weight} unit="kg" />
        <StatCard label="Resting HR" value={latest.resting_hr} unit="bpm" />
      </div>

      {/* PMC Chart */}
      <div className="bg-surface-850 border border-white/5 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-medium text-gray-300 mb-4">Performance Management Chart — {timeRange === 0 ? "All Time" : `Last ${timeRange} days`}</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#6b7280", fontSize: 10 }}
                tickLine={false}
                interval={tickInterval}
              />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} />
              <Tooltip content={<PMCTooltip />} />
              <ReferenceLine y={0} stroke="#374151" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="TSB" name="Form (TSB)" fill="#22c55e" fillOpacity={0.08} stroke="none" />
              <Line type="monotone" dataKey="CTL" name="Fitness (CTL)" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ATL" name="Fatigue (ATL)" stroke="#ec4899" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="TSB" name="Form (TSB)" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500 text-sm">No PMC data available for this period</div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Burnout Score */}
        <div className="col-span-4">
          <div className={`rounded-xl border p-6 ${getBurnoutBg(burnoutTotal)}`}>
            <div className="text-sm text-gray-400 mb-2">Burnout Risk Score</div>
            <div className={`text-5xl font-bold ${getBurnoutColor(burnoutTotal)}`}>{burnoutTotal}</div>
            <div className={`text-sm mt-1 ${getBurnoutColor(burnoutTotal)}`}>{burnoutLevel}</div>
            <div className="text-[10px] text-gray-500 mt-3">Calculated from training load + form</div>
          </div>

          <div className="mt-4 bg-surface-850 border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Signal Breakdown</h3>
            <SignalBar label="Training Load (ATL)" value={burnoutTraining} weight={50} color="bg-blue-500" />
            <SignalBar label="Form (TSB)" value={burnoutTSB} weight={50} color="bg-emerald-500" />
            <p className="text-[10px] text-gray-600 mt-2 italic">Work stress + sleep signals added when Google Calendar + wellness logging connected</p>
          </div>
        </div>

        {/* Weight chart */}
        <div className="col-span-8">
          {weightData.length > 0 && (
            <div className="bg-surface-850 border border-white/5 rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-300">Weight Trend</h2>
                <div className="text-xs text-gray-500">Target: {athlete?.target_weight || 71}kg</div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <ComposedChart data={weightData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                  <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} interval={Math.floor(weightData.length / 6)} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} domain={["auto", "auto"]} />
                  <Tooltip content={<PMCTooltip />} />
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
