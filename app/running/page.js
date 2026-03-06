"use client";
import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, BarChart, Bar, ScatterChart, Scatter } from "recharts";
import { getIntervalsActivities } from "../../lib/intervals";
import { getAthleteProfile } from "../../lib/db";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
          <span className="text-gray-300">{p.name}:</span>
          <span className="font-medium text-white">{p.value !== null ? (typeof p.value === "number" ? Math.round(p.value * 100) / 100 : p.value) : "—"}</span>
          {p.unit && <span className="text-gray-500 ml-1">{p.unit}</span>}
        </div>
      ))}
    </div>
  );
}

function PBTable({ pbs }) {
  const distances = [
    { key: "5k", label: "5K", distance: 5 },
    { key: "10k", label: "10K", distance: 10 },
    { key: "15k", label: "15K", distance: 15 },
    { key: "20k", label: "20K", distance: 20 },
    { key: "half", label: "Half Marathon", distance: 21.1 },
    { key: "marathon", label: "Marathon", distance: 42.2 },
  ];

  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-300 mb-4">Personal Bests</h3>
      <div className="grid grid-cols-2 gap-4">
        {distances.map((dist) => {
          const pb = pbs[dist.key];
          return (
            <div key={dist.key} className="bg-surface-900 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">{dist.label}</div>
              {pb ? (
                <div>
                  <div className="text-lg font-bold text-white">{pb.time}</div>
                  <div className="text-[10px] text-gray-500">{pb.pace}/km • {pb.date}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">No PB yet</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RunningPowerChart({ activities }) {
  const powerData = useMemo(() => {
    return activities
      .filter(a => (a.type === "Run" || a.type === "VirtualRun") && a.icu_weighted_avg_watts)
      .sort((a, b) => new Date(a.start_date_local) - new Date(b.start_date_local))
      .map(activity => ({
        date: new Date(activity.start_date_local).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        power: Math.round(activity.icu_weighted_avg_watts),
        distance: activity.distance ? Math.round(activity.distance / 1000 * 10) / 10 : 0,
        fullDate: activity.start_date_local
      }));
  }, [activities]);

  if (powerData.length === 0) {
    return (
      <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Running Power</h3>
        <div className="text-center py-8">
          <div className="text-gray-600 text-sm">No running power data available</div>
          <div className="text-gray-500 text-xs mt-1">Requires Stryd pod or Apple Watch running power</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-300 mb-4">Running Power Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={powerData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis yAxisId="power" orientation="left" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis yAxisId="distance" orientation="right" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <Tooltip content={<ChartTooltip />} />
          <Bar yAxisId="distance" dataKey="distance" name="Distance" fill="#22c55e" opacity={0.3} />
          <Line yAxisId="power" type="monotone" dataKey="power" name="Running Power" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function EfficiencyScatter({ activities }) {
  const efficiencyData = useMemo(() => {
    return activities
      .filter(a => (a.type === "Run" || a.type === "VirtualRun") && a.average_heartrate && a.icu_weighted_avg_watts && a.distance)
      .map(activity => {
        const speed = activity.moving_time && activity.distance ? (activity.distance / 1000) / (activity.moving_time / 3600) : 0; // km/h
        const power = activity.icu_weighted_avg_watts;
        const hr = activity.average_heartrate;
        const efficiency = power && hr ? power / hr : 0; // Power per HR

        return {
          speed: Math.round(speed * 10) / 10,
          efficiency: Math.round(efficiency * 100) / 100,
          hr,
          power,
          date: new Date(activity.start_date_local).toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
        };
      })
      .filter(d => d.efficiency > 0);
  }, [activities]);

  if (efficiencyData.length === 0) {
    return (
      <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Running Efficiency</h3>
        <div className="text-center py-8">
          <div className="text-gray-600 text-sm">Insufficient data for efficiency analysis</div>
          <div className="text-gray-500 text-xs mt-1">Requires both heart rate and running power data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-300 mb-4">Running Efficiency (Power/HR)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart data={efficiencyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="speed" name="Speed" unit=" km/h" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis dataKey="efficiency" name="Efficiency" unit="" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-surface-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg">
                  <div className="text-gray-400 mb-1">{data.date}</div>
                  <div className="text-white">Speed: {data.speed} km/h</div>
                  <div className="text-white">Efficiency: {data.efficiency}</div>
                  <div className="text-gray-400">HR: {data.hr} bpm • Power: {data.power}W</div>
                </div>
              );
            }}
          />
          <Scatter dataKey="efficiency" fill="#3b82f6" />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="text-xs text-gray-500 mt-2">
        Higher efficiency (power per heart rate) indicates better running economy
      </div>
    </div>
  );
}

export default function RunningPage() {
  const [activities, setActivities] = useState([]);
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [activitiesData, athleteData] = await Promise.all([
        getIntervalsActivities(),
        getAthleteProfile(),
      ]);

      setActivities(activitiesData || []);
      setAthlete(athleteData);
      setLoading(false);
    }

    loadData();
  }, []);

  const personalBests = useMemo(() => {
    if (!activities) return {};

    const runningActivities = activities.filter(a =>
      (a.type === "Run" || a.type === "VirtualRun") &&
      a.distance &&
      a.moving_time &&
      a.distance > 1000 // At least 1km
    );

    const pbs = {};

    // Calculate PBs for different distances
    const distances = [
      { key: "5k", min: 4900, max: 5100 },
      { key: "10k", min: 9900, max: 10100 },
      { key: "15k", min: 14900, max: 15100 },
      { key: "20k", min: 19900, max: 20100 },
      { key: "half", min: 21000, max: 21200 },
      { key: "marathon", min: 42100, max: 42300 },
    ];

    distances.forEach(({ key, min, max }) => {
      const candidates = runningActivities.filter(a =>
        a.distance >= min && a.distance <= max
      );

      if (candidates.length > 0) {
        const best = candidates.reduce((best, current) =>
          current.moving_time < best.moving_time ? current : best
        );

        const pace = (best.moving_time / 60) / (best.distance / 1000); // min/km
        const paceMin = Math.floor(pace);
        const paceSec = Math.round((pace - paceMin) * 60);

        pbs[key] = {
          time: new Date(best.moving_time * 1000).toISOString().substr(11, 8),
          pace: `${paceMin}:${paceSec.toString().padStart(2, '0')}`,
          date: new Date(best.start_date_local).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" }),
          distance: Math.round(best.distance / 10) / 100,
        };
      }
    });

    return pbs;
  }, [activities]);

  const pbProgression = useMemo(() => {
    if (!activities) return [];

    const runningActivities = activities.filter(a =>
      (a.type === "Run" || a.type === "VirtualRun") &&
      a.distance &&
      a.moving_time
    );

    // Group by month and find best times for common distances
    const monthlyBests = {};

    runningActivities.forEach(activity => {
      const month = activity.start_date_local.substring(0, 7);
      const distance = Math.round(activity.distance / 1000 * 10) / 10; // Round to 0.1km

      if (!monthlyBests[month]) monthlyBests[month] = {};
      if (!monthlyBests[month][distance] || activity.moving_time < monthlyBests[month][distance]) {
        monthlyBests[month][distance] = activity.moving_time;
      }
    });

    return Object.entries(monthlyBests)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, distances]) => {
        const monthData = {
          month: new Date(month + "-01").toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
        };

        // Find best times for standard distances
        if (distances[5]) monthData["5k"] = Math.round((distances[5] / 60) * 10) / 10; // minutes
        if (distances[10]) monthData["10k"] = Math.round((distances[10] / 60) * 10) / 10;

        return monthData;
      })
      .filter(m => m["5k"] || m["10k"]);
  }, [activities]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Loading running analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Running Performance</h1>
        <p className="text-sm text-gray-500">Personal bests, progression, and running metrics</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Personal Bests */}
        <div className="col-span-12 mb-6">
          <PBTable pbs={personalBests} />
        </div>

        {/* PB Progression */}
        <div className="col-span-8">
          <div className="bg-surface-850 border border-white/5 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-medium text-gray-300 mb-4">PB Progression</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pbProgression} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} label={{ value: "Time (minutes)", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: "#6b7280", fontSize: 12 } }} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="5k" name="5K Time" stroke="#22c55e" strokeWidth={3} dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="10k" name="10K Time" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Running Power */}
          <RunningPowerChart activities={activities} />
        </div>

        {/* Efficiency Analysis */}
        <div className="col-span-4">
          <EfficiencyScatter activities={activities} />

          {/* Running Stats */}
          <div className="bg-surface-850 border border-white/5 rounded-xl p-5 mt-6">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Running Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Total Runs</span>
                <span className="text-sm text-white">{activities.filter(a => a.type === "Run" || a.type === "VirtualRun").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Total Distance</span>
                <span className="text-sm text-white">
                  {Math.round(activities
                    .filter(a => a.type === "Run" || a.type === "VirtualRun")
                    .reduce((sum, a) => sum + (a.distance || 0), 0) / 1000)}km
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Avg Pace</span>
                <span className="text-sm text-white">
                  {(() => {
                    const runs = activities.filter(a => (a.type === "Run" || a.type === "VirtualRun") && a.distance && a.moving_time);
                    if (runs.length === 0) return "—";
                    const totalTime = runs.reduce((sum, a) => sum + a.moving_time, 0);
                    const totalDist = runs.reduce((sum, a) => sum + a.distance, 0);
                    const avgPace = (totalTime / 60) / (totalDist / 1000); // min/km
                    const paceMin = Math.floor(avgPace);
                    const paceSec = Math.round((avgPace - paceMin) * 60);
                    return `${paceMin}:${paceSec.toString().padStart(2, '0')}`;
                  })()}/km
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Best 5K</span>
                <span className="text-sm text-white">{personalBests["5k"]?.time || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}