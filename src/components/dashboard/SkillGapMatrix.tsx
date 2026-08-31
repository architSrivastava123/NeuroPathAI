"use client";

import Link from "next/link";
import { SkillGap } from "@/types";
import { AlertCircle, CheckCircle2, Lock, ArrowUpRight, Flame, ShieldAlert } from "lucide-react";

export default function SkillGapMatrix({ gaps }: { gaps: SkillGap[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100">Prioritized Skill Gap Matrix</h3>
          <p className="text-xs text-slate-400">
            Computed delta ($\Delta$) between target requirements and current digital twin evidence
          </p>
        </div>
        <Link
          href="/skills"
          className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
        >
          <span>Explore Graph</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {gaps.slice(0, 5).map((gap) => {
          const isBlocked = gap.missingPrerequisites.length > 0;
          return (
            <div
              key={gap.skillId}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-xs text-slate-200 truncate">{gap.skillName}</span>
                  
                  {gap.criticalPath && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      <Flame className="h-3 w-3 text-rose-400" />
                      Critical Path
                    </span>
                  )}

                  {isBlocked ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-medium">
                      <Lock className="h-3 w-3 text-amber-400" />
                      Blocked by: {gap.missingPrerequisites.join(", ")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] font-medium">
                      <CheckCircle2 className="h-3 w-3 text-teal-400" />
                      Unblocked
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Current: <strong className="text-slate-200">{gap.currentLevel}%</strong></span>
                  <span>Target: <strong className="text-teal-300">{gap.requiredLevel}%</strong></span>
                  <span>Delta: <strong className="text-rose-400">+{gap.gapMagnitude}%</strong></span>
                  <span>Est: <strong className="text-slate-300">~{gap.estimatedHours} hrs</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-bold text-teal-400">Priority: {gap.priorityScore}/100</span>
                  <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full bg-teal-500"
                      style={{ width: `${gap.priorityScore}%` }}
                    />
                  </div>
                </div>

                <Link
                  href={`/resources?skillId=${gap.skillId}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  View Content
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
