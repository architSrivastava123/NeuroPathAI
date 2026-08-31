"use client";

import { useEffect, useState } from "react";
import { SeedProject } from "@/data/seedCatalog";
import { 
  Code2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  GitBranch, 
  Terminal,
  Award
} from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [repoUrl, setRepoUrl] = useState("https://github.com/alex-rivers/fastapi-async-auth-service");
  const [description, setDescription] = useState("Implemented AsyncSession connection pooling, JWT authentication middleware, and complete Pytest suite with 85% test coverage.");
  const [submittedCode, setSubmittedCode] = useState(`from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI(title="Production Auth API")

@app.post("/api/v1/token")
async def login(form_data: OAuth2PasswordBearer = Depends(), db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}`);

  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects);
        if (data.projects.length > 0) {
          setSelectedProject(data.projects[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEvaluateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || evaluating) return;
    setEvaluating(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject.id,
          repoUrl,
          description,
          submittedCode,
        }),
      });

      const data = await res.json();
      setEvaluation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Project Evaluation Studio</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              Practical Evidence (82% wt)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Submit architecture and codebase repositories for multi-criteria rubric evaluation.
          </p>
        </div>
      </div>

      {/* Grid of Projects + Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Milestone Projects
          </span>
          {projects.map((proj) => {
            const isSelected = selectedProject?.id === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => {
                  setSelectedProject(proj);
                  setEvaluation(null);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? "bg-slate-800/90 border-indigo-500/60 shadow-lg shadow-indigo-500/10"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 font-semibold border border-slate-700">
                    {proj.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    ~{proj.estimatedHours} hrs
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{proj.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{proj.description}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Project Workbench & Submission */}
        {selectedProject && (
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview */}
            <div className="p-6 rounded-3xl glass-panel-glow space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedProject.title}</h3>
                  <p className="text-xs text-indigo-300 font-medium mt-0.5">
                    Skills: {selectedProject.skills?.join(", ")}
                  </p>
                </div>

                {selectedProject.starterTemplateUrl && (
                  <a
                    href={selectedProject.starterTemplateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <GitBranch className="h-3.5 w-3.5" />
                    <span>Starter Repo</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-teal-400 block text-[11px] uppercase tracking-wider">
                  Scenario Objective
                </span>
                <p className="leading-relaxed">{selectedProject.scenario}</p>
              </div>

              {/* Evaluation Results */}
              {evaluation && (
                <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-100 space-y-4 animate-in fade-in slide-in-from-top-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-indigo-400" />
                      <h4 className="text-sm font-bold">AI Rubric Evaluation: {evaluation.score}/100</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                      Evidence Recorded
                    </span>
                  </div>

                  {/* Rubric Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Arch</p>
                      <p className="text-base font-black text-indigo-300">{evaluation.breakdown.architecture}%</p>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${evaluation.breakdown.architecture}%` }} />
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Code</p>
                      <p className="text-base font-black text-teal-300">{evaluation.breakdown.codeQuality}%</p>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400 rounded-full" style={{ width: `${evaluation.breakdown.codeQuality}%` }} />
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Testing</p>
                      <p className="text-base font-black text-emerald-300">{evaluation.breakdown.testing}%</p>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${evaluation.breakdown.testing}%` }} />
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Security</p>
                      <p className="text-base font-black text-amber-300">{evaluation.breakdown.security}%</p>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${evaluation.breakdown.security}%` }} />
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Docs</p>
                      <p className="text-base font-black text-cyan-300">{evaluation.breakdown.documentation}%</p>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${evaluation.breakdown.documentation}%` }} />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-200 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">{evaluation.commentary}</p>
                </div>
              )}

              {/* Submission Form */}
              <form onSubmit={handleEvaluateProject} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Implementation Highlights & Architecture Notes</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Key Code Snippet / Module Implementation</label>
                  <textarea
                    rows={6}
                    value={submittedCode}
                    onChange={(e) => setSubmittedCode(e.target.value)}
                    className="w-full font-mono bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-teal-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={evaluating}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{evaluating ? "Running AI Rubric & Code Quality Checks..." : "Submit Project for Evaluation"}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
