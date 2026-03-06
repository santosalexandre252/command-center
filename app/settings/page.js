"use client";
import { useState, useEffect } from "react";
import { getAthleteProfile, updateAthleteProfile, getRaces } from "../../lib/db";
import { getIntervalsProfile } from "../../lib/intervals";
import { getCalendarEvents } from "../../lib/calendar";

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
        <span className={`text-xs ${isConnected ? "text-emerald-400" : "text-gray-500"}`}>{isConnected ? "Connected" : "Not connected"}</span>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [athlete, setAthlete] = useState(null);
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dbStatus, setDbStatus] = useState("checking");
  const [intervalsStatus, setIntervalsStatus] = useState("checking");
  const [intervalsFitness, setIntervalsFitness] = useState(null);
  const [calendarStatus, setCalendarStatus] = useState("checking");
  const [groqStatus, setGroqStatus] = useState("checking");
  const [races, setRaces] = useState([]);
  const [gpxUploads, setGpxUploads] = useState({});

  useEffect(() => {
    async function load() {
      const data = await getAthleteProfile();
      if (data) { setAthlete(data); setWeight(data.weight); setBodyFat(data.body_fat); setDbStatus("connected"); }
      else setDbStatus("error");

      const racesData = await getRaces();
      if (racesData) setRaces(racesData);

      const ival = await getIntervalsProfile();
      if (ival && ival.ctl !== undefined) { setIntervalsStatus("connected"); setIntervalsFitness(ival); }
      else setIntervalsStatus("error");

      const calData = await getCalendarEvents();
      if (calData?.events && calData.events.length > 0) setCalendarStatus("connected");
      else setCalendarStatus("error");

      // Check Groq by testing the briefing API
      try {
        const briefingRes = await fetch("/api/briefing");
        if (briefingRes.ok) setGroqStatus("connected");
        else setGroqStatus("error");
      } catch {
        setGroqStatus("error");
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateAthleteProfile({ weight: parseFloat(weight), body_fat: parseFloat(bodyFat) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleGPXUpload = async (raceId, file) => {
    const formData = new FormData();
    formData.append("gpx", file);
    formData.append("raceId", raceId);

    try {
      const res = await fetch("/api/gpx", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setGpxUploads(prev => ({ ...prev, [raceId]: "uploaded" }));
        setTimeout(() => {
          setGpxUploads(prev => ({ ...prev, [raceId]: null }));
        }, 3000);
      } else {
        setGpxUploads(prev => ({ ...prev, [raceId]: "error" }));
      }
    } catch (err) {
      console.error("GPX upload error:", err);
      setGpxUploads(prev => ({ ...prev, [raceId]: "error" }));
    }
  };

  return (
    <div className="p-6 max-w-[900px]">
      <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
      <p className="text-sm text-gray-500 mb-6">Connections, profile, and preferences</p>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Data Connections</h2>
        <div className="space-y-2">
          <ConnectionCard name="Supabase" icon="🗄️" status={dbStatus === "connected" ? "connected" : "pending"} description={dbStatus === "connected" ? "Database connected — profile + races loaded" : "Checking..."} />
          <ConnectionCard name="Intervals.icu" icon="📊" status={intervalsStatus === "connected" ? "connected" : "pending"} description={intervalsStatus === "connected" ? `Connected — CTL ${Math.round(intervalsFitness?.ctl)}, ATL ${Math.round(intervalsFitness?.atl)}` : "Checking API key..."} />
          <ConnectionCard name="Strava" icon="🟧" status="pending" description="Activity data, GPS routes, social" />
          <ConnectionCard name="Apple Watch" icon="⌚" status="pending" description="HR, HRV, sleep, via Intervals.icu" />
          <ConnectionCard name="Smart Scale" icon="⚖️" status="pending" description="Weight, body fat, via Intervals.icu" />
          <ConnectionCard name="Google Calendar" icon="📅" status={calendarStatus === "connected" ? "connected" : "pending"} description={calendarStatus === "connected" ? "Calendar connected — work events syncing" : "Add GOOGLE_CALENDAR_ICAL_URL to .env.local"} />
          <ConnectionCard name="Groq API" icon="🤖" status={groqStatus === "connected" ? "connected" : "pending"} description={groqStatus === "connected" ? "AI — Llama 3.3 70B for coaching & planning" : "Add GROQ_API_KEY to .env.local"} />
        </div>
      </div>

      {/* Intervals.icu live stats */}
      {intervalsFitness && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Intervals.icu Live Data <span className="text-emerald-400 text-[10px] ml-1">● live</span></h2>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
              <div className="text-[10px] text-gray-500">CTL (Fitness)</div>
              <div className="text-xl font-bold text-blue-400">{Math.round(intervalsFitness.ctl)}</div>
            </div>
            <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
              <div className="text-[10px] text-gray-500">ATL (Fatigue)</div>
              <div className="text-xl font-bold text-pink-400">{Math.round(intervalsFitness.atl)}</div>
            </div>
            <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
              <div className="text-[10px] text-gray-500">TSB (Form)</div>
              <div className={`text-xl font-bold ${intervalsFitness.tsb >= 0 ? "text-emerald-400" : "text-amber-400"}`}>{Math.round(intervalsFitness.tsb)}</div>
            </div>
            <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
              <div className="text-[10px] text-gray-500">FTP</div>
              <div className="text-xl font-bold text-white">{intervalsFitness.ftp || "—"}W</div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Athlete Profile {dbStatus === "connected" && <span className="text-emerald-400 text-[10px] ml-2">● Supabase</span>}</h2>
        <div className="bg-surface-850 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 block mb-1">Name</label><div className="text-sm text-gray-200 bg-surface-900 rounded-lg px-3 py-2">{athlete?.name || "Loading..."}</div></div>
            <div><label className="text-xs text-gray-500 block mb-1">Age</label><div className="text-sm text-gray-200 bg-surface-900 rounded-lg px-3 py-2">{athlete?.age || "..."}</div></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-xs text-gray-500 block mb-1">FTP</label><div className="text-sm text-gray-200 bg-surface-900 rounded-lg px-3 py-2">{athlete?.ftp || "..."}W</div></div>
            <div><label className="text-xs text-gray-500 block mb-1">Threshold Pace</label><div className="text-sm text-gray-200 bg-surface-900 rounded-lg px-3 py-2">{athlete?.threshold_pace_min || "..."}–{athlete?.threshold_pace_max || "..."}/km</div></div>
            <div><label className="text-xs text-gray-500 block mb-1">Max HR</label><div className="text-sm text-gray-200 bg-surface-900 rounded-lg px-3 py-2">{athlete?.max_hr || "..."} bpm</div></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 block mb-1">Current Weight</label><input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full text-sm text-gray-200 bg-surface-900 border border-white/5 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500/50" /></div>
            <div><label className="text-xs text-gray-500 block mb-1">Body Fat %</label><input type="number" step="0.1" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} className="w-full text-sm text-gray-200 bg-surface-900 border border-white/5 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500/50" /></div>
          </div>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Race Course Maps</h2>
        <div className="bg-surface-850 border border-white/5 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-4">Upload GPX files for interactive course maps and elevation profiles</p>
          <div className="space-y-3">
            {races.map((race) => (
              <div key={race.id} className="flex items-center justify-between p-3 bg-surface-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{race.type === "road_run" ? "🏃" : race.type === "trail" ? "⛰️" : "🚴"}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-200">{race.name}</div>
                    <div className="text-xs text-gray-500">{race.distance}km • {race.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {gpxUploads[race.id] === "uploaded" && <span className="text-emerald-400 text-xs">✓ Uploaded</span>}
                  {gpxUploads[race.id] === "error" && <span className="text-red-400 text-xs">✗ Error</span>}
                  <label className="cursor-pointer px-3 py-1.5 bg-surface-800 text-gray-400 text-xs rounded-lg border border-white/5 hover:text-white hover:border-brand-500/30 transition-colors">
                    Upload GPX
                    <input
                      type="file"
                      accept=".gpx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleGPXUpload(race.id, file);
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-surface-900 rounded-lg">
            <div className="text-xs text-gray-500">
              <div className="font-medium text-gray-400 mb-1">GPX File Tips:</div>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Download from Strava, Garmin Connect, or race website</li>
                <li>Files should contain track points with elevation data</li>
                <li>Course maps will appear on individual race pages</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

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
