"use client";
import { useState } from "react";
import { athlete } from "../../lib/mockData";

function ConnectionCard({ name, icon, status, description }) {
  const isConnected = status === "connected";
  return (
    <div className="flex items-center justify-between p-4 bg-surface-850 border border-white/5 rounded-xl">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <div className="text-sm font-medium text-gray-200">{name}</div>
          <div className="text-[10px] text-gray-500">{description}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-gray-600"}`}></span>
        <span className={`text-xs ${isConnected ? "text-emerald-400" : "text-gray-500"}`}>
          {isConnected ? "Connected" : "Not connected"}
        </span>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [weight, setWeight] = useState(athlete.weight);
  const [bodyFat, setBodyFat] = useState(athlete.bodyFat);

  return (
    <div className="p-6 max-w-[900px]">
      <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
      <p className="text-sm text-gray-500 mb-6">Connections, profile, and preferences</p>

      {/* Connections */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Data Connections</h2>
        <div className="space-y-2">
          <ConnectionCard name="Intervals.icu" icon="📊" status="pending" description="Training load, PMC chart, workout sync" />
          <ConnectionCard name="Strava" icon="🟧" status="pending" description="Activity data, GPS routes, social" />
          <ConnectionCard name="Apple Watch" icon="⌚" status="pending" description="HR, HRV, sleep, via Intervals.icu" />
          <ConnectionCard name="Smart Scale" icon="⚖️" status="pending" description="Weight, body fat, via Intervals.icu" />
          <ConnectionCard name="Google Calendar" icon="📅" status="pending" description="Work events, meetings, travel" />
          <ConnectionCard name="Supabase" icon="🗄️" status="pending" description="Database, storage, auth" />
          <ConnectionCard name="Gemini API" icon="🤖" status="pending" description="AI — fast analysis, daily recommendations" />
        </div>
      </div>

      {/* Profile */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Athlete Profile</h2>
        <div className="bg-surface-850 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Name</label>
              <div className="text-sm text-gray-200 bg-surface-900 rounded-lg px-3 py-2">{athlete.name}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Age</label>
              <div className="text-sm text-gray-200 bg-surface-900 rounded-lg px-3 py-2">{athlete.age}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">FTP</label>
              <div className="text-sm text-gray-200 bg-surface-900 rounded-lg px-3 py-2">{athlete.ftp}W</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Threshold Pace</label>
              <div className="text-sm text-gray-200 bg-surface-900 rounded-lg px-3 py-2">{athlete.thresholdPace.min}–{athlete.thresholdPace.max}/km</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Max HR</label>
              <div className="text-sm text-gray-200 bg-surface-900 rounded-lg px-3 py-2">{athlete.maxHR} bpm</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Current Weight</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full text-sm text-gray-200 bg-surface-900 border border-white/5 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Body Fat %</label>
              <input
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full text-sm text-gray-200 bg-surface-900 border border-white/5 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* GPX uploads */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Race GPX Files</h2>
        <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
            <div className="text-2xl mb-2">📁</div>
            <p className="text-sm text-gray-400">Drag & drop GPX files here</p>
            <p className="text-[10px] text-gray-600 mt-1">For race course maps and elevation profiles</p>
          </div>
        </div>
      </div>

      {/* ACL log */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">Injury Management — Right Knee (ACL)</h2>
        <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-3">Exercises flagged for ACL modification when fatigue is high:</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-surface-900 rounded-lg">
              <span className="text-sm text-gray-300">Bulgarian Split Squat</span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">→ Step-ups / Reverse lunges</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-surface-900 rounded-lg">
              <span className="text-sm text-gray-300">Lever Leg Extension</span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">→ Terminal knee ext / Wall sits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
