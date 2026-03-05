"use client";
import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, BarChart, Bar, Area, ReferenceLine } from "recharts";
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
          <span className="font-medium text-white">{p.value !== null ? Math.round(p.value) : "—"}</span>
          {p.unit && <span className="text-gray-500 ml-1">{p.unit}</span>}
        </div>
      ))}
    </div>
  );
}

function PowerCurveTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const duration = label;
  const power = payload[0]?.value;
  return (
    <div className="bg-surface-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="text-gray-400 mb-1">{duration} seconds</div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        <span className="text-gray-300">Best Power:</span>
        <span className="font-medium text-white">{power}W</span>
      </div>
    </div>
  );
}

function ZoneDistribution({ activities, ftp }) {
  const zoneData = useMemo(() => {
    if (!activities || !ftp) return [];

    const zones = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0, z6: 0 };
    let totalTime = 0;

    activities.forEach(activity => {
      if (activity.type === "Ride" && activity.average_watts) {
        const avgPower = activity.average_watts;
        const duration = activity.moving_time || 0;
        totalTime += duration;

        // FTP-based zones
        if (avgPower < ftp * 0.55) zones.z1 += duration;
        else if (avgPower < ftp * 0.75) zones.z2 += duration;
        else if (avgPower < ftp * 0.90) zones.z3 += duration;
        else if (avgPower < ftp * 1.05) zones.z4 += duration;
        else if (avgPower < ftp * 1.20) zones.z5 += duration;
        else zones.z6 += duration;
      }
    });

    return [
      { zone: "Z1", name: "Recovery", power: "< 55% FTP", time: zones.z1, percent: totalTime > 0 ? (zones.z1 / totalTime * 100) : 0, color: "#22c55e" },
      { zone: "Z2", name: "Endurance", power: "55-75% FTP", time: zones.z2, percent: totalTime > 0 ? (zones.z2 / totalTime * 100) : 0, color: "#3b82f6" },
      { zone: "Z3", name: "Tempo", power: "75-90% FTP", time: zones.z3, percent: totalTime > 0 ? (zones.z3 / totalTime * 100) : 0, color: "#eab308" },
      { zone: "Z4", name: "Threshold", power: "90-105% FTP", time: zones.z4, percent: totalTime > 0 ? (zones.z4 / totalTime * 100) : 0, color: "#f97316" },
      { zone: "Z5", name: "VO2 Max", power: "105-120% FTP", time: zones.z5, percent: totalTime > 0 ? (zones.z5 / totalTime * 100) : 0, color: "#ef4444" },
      { zone: "Z6", name: "Anaerobic", power: "> 120% FTP", time: zones.z6, percent: totalTime > 0 ? (zones.z6 / totalTime * 100) : 0, color: "#dc2626" },
    ];
  }, [activities, ftp]);

  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-300 mb-4">Power Zone Distribution</h3>
      <div className="space-y-3">
        {zoneData.map((zone) => (
          <div key={zone.zone} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: zone.color }}></div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-200">{zone.zone} - {zone.name}</div>
                <div className="text-[10px] text-gray-500">{zone.power}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-white">{zone.percent.toFixed(1)}%</div>
              <div className="text-[10px] text-gray-500">{Math.round(zone.time / 3600 * 10) / 10}h</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PowerPage() {
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

  const ftpProgression = useMemo(() => {
    if (!activities) return [];

    // Group activities by month and find max power efforts
    const monthlyMax = {};
    activities.forEach(activity => {
      if (activity.type === "Ride" && activity.max_watts && activity.start_date_local) {
        const month = activity.start_date_local.substring(0, 7); // YYYY-MM
        if (!monthlyMax[month] || activity.max_watts > monthlyMax[month].maxPower) {
          monthlyMax[month] = {
            month,
            maxPower: activity.max_watts,
            date: activity.start_date_local,
            activity: activity.name
          };
        }
      }
    });

    return Object.values(monthlyMax)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(item => ({
        month: new Date(item.month + "-01").toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
        ftp: Math.round(item.maxPower * 0.95), // Estimate FTP as 95% of max power
        maxPower: item.maxPower,
        fullDate: item.date
      }));
  }, [activities]);

  const powerCurve = useMemo(() => {
    if (!activities) return [];

    // Collect all power data points
    const allPowerData = [];
    activities.forEach(activity => {
      if (activity.type === "Ride" && activity.power_curve) {
        // Parse power curve data (assuming it's stored as JSON or array)
        try {
          const curve = typeof activity.power_curve === "string" ?
            JSON.parse(activity.power_curve) : activity.power_curve;
          if (Array.isArray(curve)) {
            curve.forEach(point => {
              if (point.duration && point.power) {
                allPowerData.push({
                  duration: point.duration,
                  power: point.power,
                  activity: activity.name,
                  date: activity.start_date_local
                });
              }
            });
          }
        } catch (e) {
          // Fallback: use max power for different durations
          if (activity.max_watts) {
            allPowerData.push({
              duration: activity.moving_time || 300,
              power: activity.max_watts,
              activity: activity.name,
              date: activity.start_date_local
            });
          }
        }
      }
    });

    // Group by duration and find max power
    const durationGroups = {};
    allPowerData.forEach(point => {
      const duration = Math.round(point.duration / 10) * 10; // Round to nearest 10 seconds
      if (!durationGroups[duration] || point.power > durationGroups[duration]) {
        durationGroups[duration] = point.power;
      }
    });

    return Object.entries(durationGroups)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([duration, power]) => ({
        duration: parseInt(duration),
        power: Math.round(power),
        durationLabel: duration < 60 ? `${duration}s` :
                      duration < 3600 ? `${Math.round(duration/60)}m` :
                      `${Math.round(duration/3600)}h`
      }))
      .filter(point => point.duration >= 30 && point.duration <= 3600); // 30s to 1 hour
  }, [activities]);

  const wkData = useMemo(() => {
    if (!activities || !athlete?.weight) return [];

    return activities
      .filter(a => a.type === "Ride" && a.average_watts && a.moving_time)
      .sort((a, b) => new Date(b.start_date_local) - new Date(a.start_date_local))
      .slice(0, 20)
      .reverse()
      .map(activity => ({
        date: new Date(activity.start_date_local).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        wkg: Math.round((activity.average_watts / athlete.weight) * 10) / 10,
        power: activity.average_watts,
        fullDate: activity.start_date_local
      }));
  }, [activities, athlete]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Loading power analytics...</div>
      </div>
    );
  }

  const currentFTP = ftpProgression.length > 0 ? ftpProgression[ftpProgression.length - 1].ftp : null;
  const currentWeight = athlete?.weight || 76.2;
  const currentWkg = currentFTP ? Math.round((currentFTP / currentWeight) * 10) / 10 : null;

  return (
    <div className="p-6 max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Power Analytics</h1>
        <p className="text-sm text-gray-500">FTP progression, power curves, and training zones</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
          <div className="text-[10px] text-gray-500 mb-1">Current FTP</div>
          <div className="text-2xl font-bold text-white">{currentFTP || "—"}<span className="text-sm font-normal text-gray-500 ml-1">W</span></div>
          <div className="text-[10px] text-gray-500 mt-1">Estimated from max efforts</div>
        </div>
        <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
          <div className="text-[10px] text-gray-500 mb-1">W/kg</div>
          <div className="text-2xl font-bold text-white">{currentWkg || "—"}<span className="text-sm font-normal text-gray-500 ml-1">W/kg</span></div>
          <div className="text-[10px] text-gray-500 mt-1">Power-to-weight ratio</div>
        </div>
        <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
          <div className="text-[10px] text-gray-500 mb-1">Weight</div>
          <div className="text-2xl font-bold text-white">{currentWeight}<span className="text-sm font-normal text-gray-500 ml-1">kg</span></div>
          <div className="text-[10px] text-gray-500 mt-1">Current body weight</div>
        </div>
        <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
          <div className="text-[10px] text-gray-500 mb-1">Best 20min Power</div>
          <div className="text-2xl font-bold text-white">
            {powerCurve.find(p => p.duration >= 1200)?.power || "—"}
            <span className="text-sm font-normal text-gray-500 ml-1">W</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1">FTP test equivalent</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* FTP Progression */}
        <div className="col-span-8">
          <div className="bg-surface-850 border border-white/5 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-medium text-gray-300 mb-4">FTP Progression</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ftpProgression} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="ftp" name="FTP" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="maxPower" name="Max Power" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Power Curve */}
          <div className="bg-surface-850 border border-white/5 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Power Duration Curve</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={powerCurve} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="durationLabel" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip content={<PowerCurveTooltip />} />
                <Line type="monotone" dataKey="power" name="Power" stroke="#3b82f6" strokeWidth={3} dot={false} />
                {currentFTP && <ReferenceLine y={currentFTP} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "FTP", position: "topRight", fill: "#ef4444", fontSize: 12 }} />}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* W/kg Trend */}
          <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Power-to-Weight Ratio (W/kg)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={wkData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis yAxisId="wkg" orientation="left" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis yAxisId="power" orientation="right" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar yAxisId="power" dataKey="power" name="Avg Power" fill="#3b82f6" opacity={0.3} />
                <Line yAxisId="wkg" type="monotone" dataKey="wkg" name="W/kg" stroke="#eab308" strokeWidth={3} dot={{ fill: "#eab308", strokeWidth: 2, r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Distribution */}
        <div className="col-span-4">
          <ZoneDistribution activities={activities} ftp={currentFTP} />
        </div>
      </div>
    </div>
  );
}