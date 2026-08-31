"use client";

import { useEffect, useState } from "react";
import { SimulationResult, Strategy } from "@/types";
import { 
  Sliders, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Zap, 
  ArrowRight, 
  ShieldAlert,
  Layers
} from "lucide-react";

export default function SimulatorPage() {
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [deadlineWeeks, setDeadlineWeeks] = useState(20);
  const [strategy, setStrategy] = useState<Strategy>("FAST_TRACK");
  const [skipSkills, setSkipSkills] = useState<string[]>([]);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  const availableSkillsToToggle = [
    { id: "docker-containers", name: "Docker & Containerization" },
    { id: "kubernetes-orchestration", name: "Kubernetes & Cloud" },
    { id: "dsa-fundamentals", name: "Data Structures & Algorithms" },
    { id: "linear-algebra-stats", name: "Linear Algebra & Statistics" },
  ];

  const handleToggleSkip = (id: string) => {
    setSkipSkills(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await fetch("/api/roadmap/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulatedWeeklyHours: weeklyHours,
          simulatedDeadlineWeeks: deadlineWeeks,
          simulatedStrategy: strategy,
          skillsToSkip: skipSkills,
        }),
      });
      const data = await res.json();
      setSimulation(data.simulationResult);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [weeklyHours, deadlineWeeks, strategy, skipSkills]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">&quot;What-If&quot; Roadmap Simulator</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              Counterfactual Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Experiment with study hours, target deadlines, and skill skips to forecast risk and feasibility.
          </p>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="p-6 rounded-3xl glass-panel space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sliders className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">Simulation Variables</h3>
          </div>

          {/* Weekly Hours Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Available Study Load</span>
              <span className="text-indigo-400 font-bold">{weeklyHours} hrs/week</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>5 hrs (Casual)</span>
              <span>15 hrs (Intense)</span>
              <span>30 hrs (Bootcamp)</span>
            </div>
          </div>

          {/* Deadline Weeks Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Target Horizon</span>
              <span className="text-indigo-400 font-bold">{deadlineWeeks} weeks</span>
            </div>
            <input
              type="range"
              min={8}
              max={36}
              step={2}
              value={deadlineWeeks}
              onChange={(e) => setDeadlineWeeks(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>8 wks (Sprint)</span>
              <span>24 wks (6 mos)</span>
              <span>36 wks (9 mos)</span>
            </div>
          </div>

          {/* Strategy Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Strategy Focus</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as Strategy)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="FAST_TRACK">Fast Track (Speed Optimized)</option>
              <option value="BALANCED">Balanced (Standard Track)</option>
              <option value="PROJECT_FIRST">Project First (Build to Learn)</option>
              <option value="INTERVIEW_FIRST">Interview First (Job Prep)</option>
              <option value="DEEP_MASTERY">Deep Mastery (Low-Level Systems)</option>
            </select>
          </div>

          {/* Skip Modules */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-300 block">
              What if I skip certain prerequisites?
            </span>
            <div className="space-y-2">
              {availableSkillsToToggle.map((sk) => {
                const isSkipped = skipSkills.includes(sk.id);
                return (
                  <button
                    key={sk.id}
                    onClick={() => handleToggleSkip(sk.id)}
                    className={`w-full p-2.5 rounded-xl border text-xs text-left flex items-center justify-between transition-colors ${
                      isSkipped
                        ? "bg-rose-950/40 border-rose-500/50 text-rose-200"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>{sk.name}</span>
                    <span className="text-[10px] font-bold">
                      {isSkipped ? "SKIPPED" : "INCLUDE"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results & Comparison Column */}
        {simulation && (
          <div className="lg:col-span-2 space-y-6">
            {/* Top Score Matrix */}
            <div className="p-6 rounded-3xl glass-panel-glow space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Simulation Forecast
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    Completion ETA: {simulation.completionDate}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Projected {simulation.simulatedWeeks} Weeks Total (~{simulation.simulatedTotalHours} hours)
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold">
                    <span className="text-slate-400">Feasibility:</span>
                    <span className={
                      simulation.feasibilityScore >= 80 ? "text-emerald-400" :
                      simulation.feasibilityScore >= 60 ? "text-amber-400" : "text-rose-400"
                    }>
                      {simulation.feasibilityScore}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                    Risk Level: {simulation.riskLevel}
                  </p>
                </div>
              </div>

              {/* Risk Analysis Callout */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Risk Factors & Cognitive Load Analysis</span>
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {simulation.riskAnalysis.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-400 mt-0.5">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Side-by-Side Schedule Diff */}
            <div className="p-6 rounded-3xl glass-panel space-y-4">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="h-4 w-4 text-teal-400" />
                <span>Side-by-Side Timeline Diff</span>
              </h4>

              <div className="space-y-2.5">
                {simulation.scheduleDiff.map((diff) => (
                  <div
                    key={diff.weekNumber}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
                  >
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        Week {diff.weekNumber} • Current Active Plan
                      </span>
                      <p className="font-semibold text-slate-300 mt-0.5">{diff.originalFocus}</p>
                    </div>

                    <div className="sm:border-l sm:border-slate-800 sm:pl-3">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase block">
                        Week {diff.weekNumber} • Simulated Plan
                      </span>
                      <p className="font-semibold text-teal-300 mt-0.5">{diff.simulatedFocus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
