"use client";

import Link from "next/link";
import { NextBestAction } from "@/types";
import { ArrowRight, Sparkles, Zap, Clock, ShieldCheck, HelpCircle } from "lucide-react";

export default function NextBestActionCard({ action }: { action: NextBestAction }) {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "ASSESSMENT":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "PROJECT":
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";
      default:
        return "bg-teal-500/10 text-teal-300 border-teal-500/30";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 p-6 shadow-xl shadow-teal-950/20 backdrop-blur-xl">
      {/* Background glow circle */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500 text-slate-950 text-xs font-black tracking-wide uppercase shadow-sm">
              <Zap className="h-3.5 w-3.5 fill-slate-950" />
              Next Best Action
            </span>

            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeColor(action.type)}`}>
              {action.type}
            </span>

            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              ~{action.estimatedMinutes} mins
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
              {action.title}
            </h3>
            <p className="text-xs sm:text-sm text-teal-300/90 font-medium mt-1">
              Target Competency: <span className="text-white font-semibold">{action.skillName}</span>
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Why now: </span>
                <span>{action.primaryReason}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-slate-400">
              <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-300">ROI Impact: </span>
                <span>{action.roiExplanation}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <Link
            href={action.actionUrl}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Start Activity</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <Link
            href="/roadmap"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <span>Inspect Full Roadmap</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
