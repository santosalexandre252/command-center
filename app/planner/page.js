"use client";

const daysInMonth = 31;
const monthStart = 0; // Sunday = 0, Monday = 1, etc. March 2026 starts on Sunday

export default function PlannerPage() {
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="p-6 max-w-[1400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Monthly Planner</h1>
          <p className="text-sm text-gray-500 mt-1">March 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-surface-850 text-gray-400 text-sm rounded-lg border border-white/5 hover:text-white">← Feb</button>
          <button className="px-3 py-1.5 bg-surface-850 text-gray-400 text-sm rounded-lg border border-white/5 hover:text-white">Apr →</button>
        </div>
      </div>

      <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((d) => (
            <div key={d} className="text-center text-xs text-gray-500 py-2">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for offset (March 2026 starts on Sunday, show in last col) */}
          {Array.from({ length: 6 }, (_, i) => (
            <div key={`empty-${i}`} className="h-24 rounded-lg bg-surface-900/50"></div>
          ))}

          {days.map((day) => (
            <div key={day} className={`h-24 rounded-lg border p-2 ${
              day === 4 ? "bg-brand-600/10 border-brand-500/30" : "bg-surface-900 border-white/5"
            }`}>
              <div className={`text-xs font-medium ${day === 4 ? "text-brand-400" : "text-gray-400"}`}>
                {day}
              </div>
              <div className="mt-1 text-[9px] text-gray-600">
                {day === 4 && "Today"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-4 italic">Calendar will show training blocks, work events (Google Calendar), and race countdowns when connected</p>
    </div>
  );
}
