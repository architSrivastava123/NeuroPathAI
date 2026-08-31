"use client";

import { LearnerDigitalTwin } from "@/types";
import { Target, TrendingUp, Calendar, Zap, CheckCircle2, ShieldAlert } from "lucide-react";

export default function GoalProgressCard({
  twin,
  metrics,
}: {
  twin: LearnerDigitalTwin;
  metrics: {
    completionPercentage: number;
    completedSteps: number;
    totalSteps: number;
    learningVelocity: number;
    consistencyScore: number;
    hoursCompletedThisWeek: number;
    plannedHoursPerWeek: number;
    currentStreakDays: number;
  };
}) {
  const velocityStatus = metrics.learningVelocity >= 1.1 ? "Ahead of Schedule (+3 days)" : metrics.learningVelocity >= 0.9 ? "On Track" : "Pace Adjustment Recommended";
  const velocityColor = metrics.learningVelocity >= 1.0 ? "text-emerald-400" : "text-amber-400";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">{twin.targetRole}</h3>
            <p className="text-xs text-slate-400">Target Strategy: <span className="font-medium text-slate-300">{twin.learningStrategy.replace("_", " ")}</span></p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black tracking-tight text-teal-400">{twin.goalProgress}%</span>
          <p className="text-[10px] text-slate-400 font-medium">Goal Readiness</p>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Curriculum Progress</span>
          <span className="text-slate-200 font-semibold">{metrics.completedSteps} of {metrics.totalSteps} Milestones</span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-all duration-500 shadow-sm shadow-teal-500/30"
            style={{ width: `${Math.max(8, metrics.completionPercentage)}%` }}
          />
        </div>
      </div>

      {/* Grid of Micro-Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-teal-400" />
            <span>Velocity</span>
          </div>
          <p className={`text-base font-bold ${velocityColor}`}>{metrics.learningVelocity}x</p>
          <p className="text-[10px] text-slate-500 truncate">{velocityStatus}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Consistency</span>
          </div>
          <p className="text-base font-bold text-amber-300">{metrics.consistencyScore}%</p>
          <p className="text-[10px] text-slate-500">12-day streak</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Calendar className="h-3.5 w-3.5 text-indigo-400" />
            <span>Weekly Load</span>
          </div>
          <p className="text-base font-bold text-slate-200">{metrics.hoursCompletedThisWeek} / {metrics.plannedHoursPerWeek}h</p>
          <p className="text-[10px] text-slate-500">65% of weekly goal</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Target ETA</span>
          </div>
          <p className="text-base font-bold text-slate-200">18 wks</p>
          <p className="text-[10px] text-emerald-400 font-medium">On Track</p>
        </div>
      </div>
    </div>
  );
}
