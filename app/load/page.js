"use client";
import { burnoutScore, athlete } from "../../lib/mockData";
import { getBurnoutColor, getBurnoutBg } from "../../lib/utils";

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

export default function LoadPage() {
  const level = burnoutScore.total < 40 ? "LOW" : burnoutScore.total < 55 ? "MODERATE" : burnoutScore.total < 75 ? "HIGH" : "CRITICAL";
  return (
    <div className="p-6 max-w-[1400px]">
      <h1 className="text-2xl font-bold text-white mb-2">Load Monitor</h1>
      <p className="text-sm text-gray-500 mb-6">Burnout prevention & fatigue management</p>

      <div className="grid grid-cols-12 gap-6">
        {/* Burnout Score */}
        <div className="col-span-4">
          <div className={`rounded-xl border p-6 ${getBurnoutBg(burnoutScore.total)}`}>
            <div className="text-sm text-gray-400 mb-2">Burnout Risk Score</div>
            <div className={`text-5xl font-bold ${getBurnoutColor(burnoutScore.total)}`}>{burnoutScore.total}</div>
            <div className={`text-sm mt-1 ${getBurnoutColor(burnoutScore.total)}`}>{level}</div>
            <div className="text-xs text-gray-500 mt-3">Trend: {burnoutScore.trend === "stable" ? "→ Stable" : burnoutScore.trend === "improving" ? "↗ Improving" : "↘ Worsening"}</div>
          </div>

          <div className="mt-4 bg-surface-850 border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Signal Breakdown</h3>
            <SignalBar label="Training Load" value={burnoutScore.training} weight={35} color="bg-blue-500" />
            <SignalBar label="Work Stress" value={burnoutScore.work} weight={25} color="bg-purple-500" />
            <SignalBar label="Sleep Deficit" value={burnoutScore.sleep} weight={25} color="bg-indigo-500" />
            <SignalBar label="HR / HRV" value={burnoutScore.hrHrv} weight={15} color="bg-cyan-500" />
          </div>
        </div>

        {/* PMC Chart placeholder */}
        <div className="col-span-8">
          <div className="bg-surface-850 border border-white/5 rounded-xl p-6 h-80 flex flex-col items-center justify-center">
            <div className="text-gray-500 text-sm mb-2">Performance Management Chart</div>
            <div className="text-gray-600 text-xs">CTL / ATL / TSB will render here with Intervals.icu data</div>
            <div className="flex gap-8 mt-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">{athlete.ctl}</div>
                <div className="text-[10px] text-gray-500">CTL (Fitness)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400">{athlete.atl}</div>
                <div className="text-[10px] text-gray-500">ATL (Fatigue)</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${athlete.tsb >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                  {athlete.tsb > 0 ? "+" : ""}{athlete.tsb}
                </div>
                <div className="text-[10px] text-gray-500">TSB (Form)</div>
              </div>
            </div>
          </div>

          {/* Override tracking */}
          <div className="mt-4 bg-surface-850 border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Override Tracker</h3>
                <p className="text-xs text-gray-500 mt-1">You have overridden 0 warnings this month</p>
              </div>
              <div className="text-xs text-gray-500">
                Last hard block: never · Streak without warning: 5 days ✓
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
