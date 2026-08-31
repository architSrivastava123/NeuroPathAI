"use client";

import { useEffect, useState } from "react";
import { SkillNode, Difficulty, StepStatus } from "@/types";
import { 
  Network, 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Filter, 
  Sparkles,
  Layers
} from "lucide-react";

interface SkillWithState extends SkillNode {
  depth: number;
  userState: {
    estimatedLevel: number;
    confidence: number;
    status: StepStatus;
    selfReportedLevel?: number;
    assessmentScore?: number;
    projectEvidenceScore?: number;
  };
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillWithState[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSkill, setSelectedSkill] = useState<SkillWithState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/skills")
      .then(res => res.json())
      .then(data => {
        setSkills(data.skills);
        setCategories(data.categories || []);
        if (data.skills.length > 0) {
          setSelectedSkill(data.skills[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredSkills = selectedCategory === "ALL"
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  const getStatusBadge = (status: StepStatus) => {
    switch (status) {
      case "MASTERED":
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
            <CheckCircle2 className="h-3 w-3" />
            {status}
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
            <PlayCircle className="h-3 w-3" />
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
            Available
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Skill Intelligence Graph</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-semibold">
              DAG Directed Acyclic Graph
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Normalized taxonomy of {skills.length} engineering competencies with strict prerequisite validation.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === "ALL"
              ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          All Competencies ({skills.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Nodes + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nodes List */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkill?.id === skill.id;
            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "bg-slate-800/90 border-teal-500/60 shadow-lg shadow-teal-500/10"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {skill.category}
                    </span>
                    {getStatusBadge(skill.userState.status)}
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{skill.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{skill.description}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Mastery Level</span>
                    <span className="font-bold text-teal-400">{skill.userState.estimatedLevel}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-500"
                      style={{ width: `${skill.userState.estimatedLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Skill Details & Dependency Graph Info */}
        <div className="space-y-4">
          {selectedSkill ? (
            <div className="p-5 rounded-2xl glass-panel-glow space-y-4 sticky top-20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  Graph Node Details
                </span>
                {getStatusBadge(selectedSkill.userState.status)}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{selectedSkill.name}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedSkill.description}</p>
              </div>

              {/* Evidence Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider">
                  Evidence Streams
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Self-Report (60% wt):</span>
                    <strong className="text-slate-200">{selectedSkill.userState.selfReportedLevel ?? "None"}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Assessment (88% wt):</span>
                    <strong className="text-teal-400">{selectedSkill.userState.assessmentScore ?? "Pending"}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Project Rubric (82% wt):</span>
                    <strong className="text-indigo-400">{selectedSkill.userState.projectEvidenceScore ?? "Pending"}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                    <span>Confidence Score:</span>
                    <strong className="text-teal-300">{(selectedSkill.userState.confidence * 100).toFixed(0)}%</strong>
                  </div>
                </div>
              </div>

              {/* Prerequisites & Graph Position */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-300 block">Prerequisites Required:</span>
                {selectedSkill.prerequisites.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkill.prerequisites.map(p => (
                      <span key={p} className="px-2 py-1 rounded-md bg-slate-800 text-[10px] text-slate-300 font-medium border border-slate-700">
                        {p.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-teal-400 font-medium">Root Fundamental (No prerequisites)</p>
                )}
              </div>

              <div className="pt-2">
                <a
                  href={`/resources?skillId=${selectedSkill.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <span>Explore Learning Modules</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl glass-panel text-center text-slate-400">
              <Network className="h-8 w-8 text-teal-400/60 mx-auto mb-2" />
              <p className="text-xs">Select any competency node to view dependency graph links.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
