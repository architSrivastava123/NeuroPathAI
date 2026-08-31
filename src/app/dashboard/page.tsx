"use client";

import { useEffect, useState } from "react";
import { LearnerDigitalTwin, RoadmapPlan, NextBestAction, SkillGap } from "@/types";
import NextBestActionCard from "@/components/dashboard/NextBestActionCard";
import SkillRadarChart from "@/components/dashboard/SkillRadarChart";
import GoalProgressCard from "@/components/dashboard/GoalProgressCard";
import SkillGapMatrix from "@/components/dashboard/SkillGapMatrix";
import Link from "next/link";
import { 
  Sparkles, 
  RefreshCw, 
  Map, 
  Sliders, 
  Layers, 
  ArrowRight,
  CheckCircle2,
  PlayCircle
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<{
    twin: LearnerDigitalTwin;
    roadmap: RoadmapPlan;
    nextBestAction: NextBestAction;
    gaps: SkillGap[];
    radarData: any[];
    metrics: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-teal-400 animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Synchronizing Learner Digital Twin and Skill Graph...</p>
      </div>
    );
  }

  const currentWeek = data.roadmap.weeklySchedule[0];

  return (
    <div className="space-y-8">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Learner Command Center</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
              Live Twin Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking <strong className="text-slate-200">{data.twin.name}</strong> • Target: <strong className="text-teal-300">{data.twin.targetRole}</strong> ({data.twin.availableHoursPerWeek} hrs/wk)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/roadmap"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Map className="h-4 w-4 text-teal-400" />
            <span>Interactive Roadmap</span>
          </Link>

          <Link
            href="/simulator"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
          >
            <Sliders className="h-4 w-4 text-indigo-400" />
            <span>What-If Simulator</span>
          </Link>
        </div>
      </div>

      {/* Hero Next Best Action Spotlight */}
      <NextBestActionCard action={data.nextBestAction} />

      {/* Core Intelligence Grid: Progress + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalProgressCard twin={data.twin} metrics={data.metrics} />
        <SkillRadarChart data={data.radarData} />
      </div>

      {/* Secondary Intelligence Grid: Skill Gaps + Current Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkillGapMatrix gaps={data.gaps} />
        </div>

        {/* Current Active Week Focus */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Current Week Focus</h3>
              <p className="text-xs text-slate-400">{currentWeek ? currentWeek.theme : "Foundations"}</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-bold">
              Week 1
            </span>
          </div>

          <div className="space-y-2.5">
            {currentWeek?.steps.map((step) => (
              <div
                key={step.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="font-bold text-slate-200 truncate">{step.title}</p>
                  <p className="text-[11px] text-teal-400">{step.skillName}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  step.status === "COMPLETED" || step.status === "MASTERED"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : step.status === "IN_PROGRESS"
                    ? "bg-teal-500/15 text-teal-300 border-teal-500/30"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}>
                  {step.status}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/roadmap"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-teal-300 border border-slate-700 transition-colors"
          >
            <span>View All {data.roadmap.totalWeeks} Weeks</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
