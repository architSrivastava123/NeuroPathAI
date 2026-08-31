"use client";

import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Network, 
  Cpu, 
  RefreshCw, 
  Target, 
  Award, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Sliders, 
  CheckCircle2 
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-teal-400 animate-pulse" />
          <span>Next-Generation Adaptive Learning Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Don&apos;t just follow a static roadmap. <br />
          <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
            Let AI steer your mastery loop.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A continuous, closed-loop AI learning platform that understands your goals, models your Digital Twin, maps missing prerequisites, and dynamically replans your path with every assessment.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-indigo-600 hover:from-teal-300 hover:to-indigo-500 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/25 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Start Conversational Onboarding</span>
            <ArrowRight className="h-4 w-4 text-slate-950" />
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-slate-700 hover:border-slate-600 transition-all"
          >
            <span>Explore Live Command Center</span>
          </Link>
        </div>
      </div>

      {/* Closed-Loop Intelligence Architecture Diagram */}
      <div className="rounded-3xl glass-panel-glow p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Continuous Closed Loop</span>
          <h2 className="text-2xl font-bold text-white">The 8-Stage Learning Intelligence Engine</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Every learner action directly updates confidence-weighted mastery and triggers deterministic graph recalculations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-teal-500/40 transition-colors">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 w-fit">
              <Target className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-100">1. Goal Extraction</h4>
            <p className="text-[11px] text-slate-400">
              Natural language goals are normalized and decomposed into target competency matrices.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-teal-500/40 transition-colors">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 w-fit">
              <Network className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-100">2. DAG Skill Graph</h4>
            <p className="text-[11px] text-slate-400">
              Topological sorting strictly resolves hard/soft prerequisites and dependency clusters.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-teal-500/40 transition-colors">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 w-fit">
              <Cpu className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-100">3. Digital Twin</h4>
            <p className="text-[11px] text-slate-400">
              Confidence-weighted evidence blending self-reports, courses, assessments, and projects.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-teal-500/40 transition-colors">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit">
              <RefreshCw className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-100">4. Dynamic Replanning</h4>
            <p className="text-[11px] text-slate-400">
              Prunes mastered topics, adds remedial practice, and re-optimizes weekly load balance.
            </p>
          </div>
        </div>
      </div>

      {/* Core Feature Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard" className="p-6 rounded-2xl glass-panel hover:glass-panel-glow transition-all group">
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 w-fit mb-4 group-hover:scale-110 transition-transform">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Next Best Action Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Crystal clear focus on the highest ROI action at every second, complete with transparent &quot;Why this? Why now?&quot; rationale.
          </p>
          <span className="text-xs font-semibold text-teal-400 flex items-center gap-1 group-hover:gap-2 transition-all">
            Open Command Center <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <Link href="/simulator" className="p-6 rounded-2xl glass-panel hover:glass-panel-glow transition-all group">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit mb-4 group-hover:scale-110 transition-transform">
            <Sliders className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">&quot;What-If&quot; Simulator</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Simulate alternative study loads, accelerated deadlines, and skill skips side-by-side with risk scores before committing.
          </p>
          <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">
            Launch Simulator <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <Link href="/assessments" className="p-6 rounded-2xl glass-panel hover:glass-panel-glow transition-all group">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit mb-4 group-hover:scale-110 transition-transform">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Adaptive Assessments</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Diagnostic quizzes and scenario evaluations that instantly adjust your skill mastery and prune downstream modules.
          </p>
          <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:gap-2 transition-all">
            Take Assessment <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
