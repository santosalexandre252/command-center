"use client";
import Link from "next/link";
import { races, athlete } from "../../lib/mockData";
import { daysUntil, formatDate, getRaceTypeIcon, getRaceTypeColor } from "../../lib/utils";

function RaceCard({ race }) {
  const days = daysUntil(race.date);
  const fitnessPercent = Math.min(100, Math.round((athlete.ctl / race.targetCTL) * 100));
  const isOnTrack = fitnessPercent >= 80;

  return (
    <Link href={`/race/${race.id}`}>
      <div className="bg-surface-850 border border-white/5 rounded-xl p-5 card-hover cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getRaceTypeIcon(race.type)}</span>
            <div>
              <h3 className="text-base font-semibold text-white">{race.name}</h3>
              <p className="text-xs text-gray-500">{race.location}</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded font-bold ${race.priority === "A" ? "bg-brand-600/20 text-brand-400" : "bg-gray-700/50 text-gray-400"}`}>
            {race.priority}-Race
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <div className="text-[10px] text-gray-500">Date</div>
            <div className="text-sm font-medium text-gray-200">{formatDate(race.date)}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500">Distance</div>
            <div className="text-sm font-medium text-gray-200">{race.distance}km</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500">Elevation</div>
            <div className="text-sm font-medium text-gray-200">{race.elevation}m D+</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500">Countdown</div>
            <div className="text-sm font-bold text-white">{days} days</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>Fitness: CTL {athlete.ctl} / {race.targetCTL}</span>
            <span className={isOnTrack ? "text-emerald-400" : "text-amber-400"}>{fitnessPercent}% — {isOnTrack ? "On track" : "Behind"}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${isOnTrack ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${fitnessPercent}%` }}></div>
          </div>
        </div>

        <div className={`mt-3 inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${getRaceTypeColor(race.type)}`}>
          {race.type === "road_run" ? "Road Running" : race.type === "trail" ? "Trail Running" : "Cycling"}
        </div>
      </div>
    </Link>
  );
}

export default function RacesPage() {
  return (
    <div className="p-6 max-w-[1400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Race Hub</h1>
          <p className="text-sm text-gray-500 mt-1">2026 Season — {races.length} races confirmed</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition-colors">
          + Add Race
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {races.map((race) => (
          <RaceCard key={race.id} race={race} />
        ))}
      </div>
    </div>
  );
}
