"use client";

import { useState } from "react";
import { RoadmapPlan, LearningStep, StepStatus } from "@/types";
import { 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Award, 
  Code2, 
  ChevronDown, 
  ChevronRight, 
  RefreshCw, 
  Info,
  ExternalLink,
  Zap,
  Layers
} from "lucide-react";

export default function RoadmapTimeline({
  initialRoadmap,
}: {
  initialRoadmap: RoadmapPlan;
}) {
  const [roadmap, setRoadmap] = useState<RoadmapPlan>(initialRoadmap);
  const [selectedStep, setSelectedStep] = useState<LearningStep | null>(null);
  const [replanning, setReplanning] = useState(false);
  const [adaptationNotice, setAdaptationNotice] = useState<{
    explanation: string;
    changesSummary: string[];
  } | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true });

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const handleStepStatusChange = async (stepId: string, newStatus: StepStatus) => {
    try {
      const res = await fetch("/api/roadmap", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId, newStatus }),
      });
      const data = await res.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
        if (selectedStep?.id === stepId) {
          setSelectedStep({ ...selectedStep, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerReplan = async () => {
    setReplanning(true);
    setAdaptationNotice(null);
    try {
      const res = await fetch("/api/roadmap/replan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          triggerType: "MANUAL_RECALCULATION",
        }),
      });
      const data = await res.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
        setAdaptationNotice({
          explanation: data.explanation,
          changesSummary: data.changesSummary,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReplanning(false);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "ASSESSMENT":
        return <Award className="h-4 w-4 text-amber-400" />;
      case "PROJECT":
        return <Code2 className="h-4 w-4 text-indigo-400" />;
      default:
        return <BookOpen className="h-4 w-4 text-teal-400" />;
    }
  };

  const getStatusBadge = (status: StepStatus) => {
    switch (status) {
      case "MASTERED":
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
            <PlayCircle className="h-3 w-3 animate-spin" />
            In Progress
          </span>
        );
      case "LOCKED":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700 text-[10px] font-medium">
            <Lock className="h-3 w-3" />
            Locked
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-medium">
            <Zap className="h-3 w-3" />
            Available
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">{roadmap.title}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-xs font-semibold">
              {roadmap.strategy.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {roadmap.totalWeeks} Weeks Total • ~{roadmap.estimatedTotalHours} Cumulative Study Hours
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerReplan}
            disabled={replanning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${replanning ? "animate-spin" : ""}`} />
            <span>{replanning ? "Recalculating Graph..." : "Recalculate Roadmap"}</span>
          </button>
        </div>
      </div>

      {/* Adaptation Notification Alert */}
      {adaptationNotice && (
        <div className="p-4 rounded-2xl border border-teal-500/40 bg-teal-950/40 backdrop-blur-xl animate-in fade-in slide-in-from-top-3 space-y-2">
          <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span>Adaptive Closed-Loop Replanning Triggered</span>
          </div>
          <p className="text-xs text-slate-200">{adaptationNotice.explanation}</p>
          {adaptationNotice.changesSummary.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {adaptationNotice.changesSummary.map((change, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-200">
                  ✓ {change}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Weekly Schedule + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {roadmap.weeklySchedule.map((week) => {
            const isExpanded = expandedWeeks[week.weekNumber] ?? true;
            return (
              <div
                key={week.weekNumber}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden"
              >
                {/* Week Header */}
                <button
                  onClick={() => toggleWeek(week.weekNumber)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-slate-950/40 hover:bg-slate-950/70 border-b border-slate-800/80 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-teal-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{week.theme}</h4>
                      <p className="text-[11px] text-slate-400">
                        {week.targetHours} Hours • {week.steps.length} Modules
                      </p>
                    </div>
                  </div>

                  {week.milestone && (
                    <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-300">
                      {week.milestone}
                    </span>
                  )}
                </button>

                {/* Steps in this week */}
                {isExpanded && (
                  <div className="p-4 space-y-3">
                    {week.steps.map((step) => {
                      const isSelected = selectedStep?.id === step.id;
                      return (
                        <div
                          key={step.id}
                          onClick={() => setSelectedStep(step)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-slate-800/90 border-teal-500/60 shadow-md shadow-teal-500/10"
                              : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/60"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="p-1 rounded-md bg-slate-800">
                                  {getStepIcon(step.stepType)}
                                </div>
                                <span className="text-xs font-bold text-slate-200 truncate">
                                  {step.title}
                                </span>
                                {getStatusBadge(step.status)}
                              </div>

                              <p className="text-xs text-slate-400 line-clamp-1">
                                {step.description}
                              </p>

                              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-slate-400" />
                                  ~{step.estimatedMinutes} mins
                                </span>
                                <span>Skill: <strong className="text-teal-400">{step.skillName}</strong></span>
                                {step.resourceDetails && (
                                  <span>Source: <strong className="text-slate-300">{step.resourceDetails.provider}</strong></span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {step.status !== "COMPLETED" && step.status !== "MASTERED" && step.status !== "LOCKED" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStepStatusChange(step.id, "COMPLETED");
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                                >
                                  Complete
                                </button>
                              )}
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStep(step);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                              >
                                <Info className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Detail & Explainability Drawer */}
        <div className="space-y-4">
          {selectedStep ? (
            <div className="p-5 rounded-2xl glass-panel-glow space-y-4 sticky top-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">Step Intelligence</h3>
                </div>
                {getStatusBadge(selectedStep.status)}
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{selectedStep.title}</h4>
                <p className="text-xs text-teal-300 font-medium mt-0.5">{selectedStep.skillName}</p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedStep.description}</p>
              </div>

              {/* Explainability Section */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
                <div>
                  <span className="font-bold text-teal-400 block mb-0.5">Why this?</span>
                  <p className="text-slate-300">{selectedStep.scoreBreakdown.reasons.whyThis}</p>
                </div>
                <div>
                  <span className="font-bold text-indigo-400 block mb-0.5">Why now?</span>
                  <p className="text-slate-300">{selectedStep.scoreBreakdown.reasons.whyNow}</p>
                </div>
                {selectedStep.scoreBreakdown.reasons.whyNotAlternative && (
                  <div>
                    <span className="font-bold text-amber-400 block mb-0.5">Why not an alternative?</span>
                    <p className="text-slate-400">{selectedStep.scoreBreakdown.reasons.whyNotAlternative}</p>
                  </div>
                )}
              </div>

              {/* 8-Factor Score Breakdown */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Recommendation Score</span>
                  <span className="text-teal-400">{selectedStep.scoreBreakdown.totalScore} / 1.0</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    Goal Relevance: <strong className="text-slate-200">{(selectedStep.scoreBreakdown.factors.goalRelevance * 100).toFixed(0)}%</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    Prereq Fit: <strong className="text-slate-200">{(selectedStep.scoreBreakdown.factors.prerequisiteFit * 100).toFixed(0)}%</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    Difficulty Fit: <strong className="text-slate-200">{(selectedStep.scoreBreakdown.factors.difficultyFit * 100).toFixed(0)}%</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    Quality Rating: <strong className="text-slate-200">{(selectedStep.scoreBreakdown.factors.resourceQuality * 100).toFixed(0)}%</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {selectedStep.resourceDetails?.url && (
                  <a
                    href={selectedStep.resourceDetails.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    <span>Launch Resource</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleStepStatusChange(selectedStep.id, "IN_PROGRESS")}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    Set In Progress
                  </button>
                  <button
                    onClick={() => handleStepStatusChange(selectedStep.id, "COMPLETED")}
                    className="flex-1 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                  >
                    Mark Done
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl glass-panel text-center text-slate-400 space-y-3">
              <Layers className="h-8 w-8 text-teal-400/60 mx-auto" />
              <h4 className="text-xs font-bold text-slate-200">Select any module to inspect reasoning</h4>
              <p className="text-[11px] text-slate-500">
                Click any step on the timeline to reveal its 8-factor score matrix and prerequisite graph evidence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
