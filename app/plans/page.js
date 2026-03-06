"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getRaces, getAthleteProfile } from "../../lib/db";
import { getIntervalsProfile } from "../../lib/intervals";

function PlanCard({ plan, onSelect }) {
  if (!plan) return null;

  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-5 cursor-pointer hover:border-brand-500/30 transition-colors" onClick={() => onSelect(plan)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{plan.title}</h3>
          <p className="text-sm text-gray-400">{plan.description}</p>
        </div>
        <span className="text-2xl">{plan.emoji}</span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div><span className="text-gray-500">Duration:</span><br/><span className="text-white font-medium">{plan.duration}</span></div>
        <div><span className="text-gray-500">Target:</span><br/><span className="text-white font-medium">{plan.target}</span></div>
        <div><span className="text-gray-500">Focus:</span><br/><span className="text-white font-medium">{plan.focus}</span></div>
      </div>
    </div>
  );
}

function PlanGenerator({ selectedPlan, athlete, fitness, onGenerate, isGenerating }) {
  const [customPrompt, setCustomPrompt] = useState("");

  if (!selectedPlan) return null;

  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{selectedPlan.emoji}</span>
        <div>
          <h2 className="text-xl font-bold text-white">{selectedPlan.title}</h2>
          <p className="text-sm text-gray-400">{selectedPlan.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Current Fitness</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">CTL:</span><span className="text-white">{Math.round(fitness?.ctl || 0)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">ATL:</span><span className="text-white">{Math.round(fitness?.atl || 0)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">TSB:</span><span className="text-white">{Math.round((fitness?.ctl || 0) - (fitness?.atl || 0))}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Weight:</span><span className="text-white">{athlete?.weight || "—"}kg</span></div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Plan Parameters</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Duration:</span><span className="text-white">{selectedPlan.duration}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Target CTL:</span><span className="text-white">{selectedPlan.target}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Start Date:</span><span className="text-white">Next Monday</span></div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Additional Instructions (optional)</label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Any specific requirements, constraints, or goals..."
          className="w-full h-20 text-sm text-gray-200 bg-surface-900 border border-white/5 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500/50 resize-none"
        />
      </div>

      <button
        onClick={() => onGenerate(selectedPlan, customPrompt)}
        disabled={isGenerating}
        className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? "Generating Plan..." : "Generate Training Plan"}
      </button>
    </div>
  );
}

function GeneratedPlan({ plan, onSave, isSaving }) {
  if (!plan) return null;

  return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Generated Training Plan</h2>
        <button
          onClick={() => onSave(plan)}
          disabled={isSaving}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save to Intervals.icu"}
        </button>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">{plan.content}</div>
      </div>
    </div>
  );
}

export default function PlansPage() {
  const [races, setRaces] = useState([]);
  const [athlete, setAthlete] = useState(null);
  const [fitness, setFitness] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [r, a, f] = await Promise.all([
        getRaces(),
        getAthleteProfile(),
        getIntervalsProfile(),
      ]);
      setRaces(r || []);
      setAthlete(a);
      setFitness(f);
      setLoading(false);
    }
    load();
  }, []);

  const planTemplates = [
    {
      id: "race-build",
      title: "Race Build",
      description: "Build fitness for an upcoming race with progressive overload",
      emoji: "🏁",
      duration: "8-12 weeks",
      target: "Race-specific CTL",
      focus: "Progressive build",
    },
    {
      id: "base-building",
      title: "Base Building",
      description: "Develop aerobic base with consistent, moderate training",
      emoji: "🏔️",
      duration: "6-8 weeks",
      target: "CTL +10-15",
      focus: "Aerobic development",
    },
    {
      id: "peak-recovery",
      title: "Peak & Recovery",
      description: "Maintain peak fitness while allowing recovery",
      emoji: "⚡",
      duration: "2-4 weeks",
      target: "Maintain current CTL",
      focus: "Peak maintenance",
    },
    {
      id: "off-season",
      title: "Off-Season Maintenance",
      description: "Light training to maintain fitness during break",
      emoji: "🏖️",
      duration: "4-6 weeks",
      target: "CTL -10",
      focus: "Active recovery",
    },
  ];

  const generatePlan = async (planTemplate, customPrompt) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/training-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planTemplate,
          customPrompt,
          athlete,
          fitness,
          races,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate plan");

      const data = await res.json();
      setGeneratedPlan(data.plan);
    } catch (err) {
      console.error("Plan generation error:", err);
      alert("Failed to generate plan. Please try again.");
    }
    setIsGenerating(false);
  };

  const saveToIntervals = async (plan) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/training-plan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) throw new Error("Failed to save plan");

      alert("Plan saved to Intervals.icu!");
      setGeneratedPlan(null);
      setSelectedPlan(null);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save plan. Please try again.");
    }
    setIsSaving(false);
  };

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="p-6 max-w-[1200px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Training Plans</h1>
          <p className="text-sm text-gray-500 mt-1">AI-generated training plans tailored to your fitness</p>
        </div>
        <Link href="/planner" className="text-brand-400 text-sm hover:underline">View Calendar →</Link>
      </div>

      {!selectedPlan && !generatedPlan && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Choose a Plan Type</h2>
          <div className="grid grid-cols-2 gap-4">
            {planTemplates.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onSelect={setSelectedPlan} />
            ))}
          </div>
        </div>
      )}

      {selectedPlan && !generatedPlan && (
        <div>
          <button onClick={() => setSelectedPlan(null)} className="text-gray-400 hover:text-white mb-4 text-sm">← Back to plan types</button>
          <PlanGenerator
            selectedPlan={selectedPlan}
            athlete={athlete}
            fitness={fitness}
            onGenerate={generatePlan}
            isGenerating={isGenerating}
          />
        </div>
      )}

      {generatedPlan && (
        <div>
          <button onClick={() => { setGeneratedPlan(null); setSelectedPlan(null); }} className="text-gray-400 hover:text-white mb-4 text-sm">← Start over</button>
          <GeneratedPlan plan={generatedPlan} onSave={saveToIntervals} isSaving={isSaving} />
        </div>
      )}
    </div>
  );
}