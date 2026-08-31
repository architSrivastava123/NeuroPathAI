"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  Filter,
  Layers,
  Star,
  Search,
  SlidersHorizontal
} from "lucide-react";

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [feedbackState, setFeedbackState] = useState<Record<string, "UP" | "DOWN">>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resources")
      .then(res => res.json())
      .then(data => setResources(data.resources || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = resources.filter((r) => {
    const matchesFormat = selectedFormat === "ALL" || r.type?.toLowerCase() === selectedFormat.toLowerCase();
    const matchesDifficulty = selectedDifficulty === "ALL" || r.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesSearch = !searchQuery.trim() || 
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.skillIds && r.skillIds.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesFormat && matchesDifficulty && matchesSearch;
  });

  const handleFeedback = (resId: string, type: "UP" | "DOWN") => {
    setFeedbackState(prev => ({ ...prev, [resId]: type }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Resource Knowledge Catalog</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-semibold">
              RAG & Hybrid Recommender
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic, verified catalog of learning resources with 8-factor transparent ranking scores.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3 p-4 rounded-2xl glass-panel">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, skill, provider (e.g. DeepLearning.AI, Transformers, RAG)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="text-xs text-slate-400 font-medium shrink-0 self-end sm:self-center">
            Showing <strong className="text-teal-300">{filtered.length}</strong> of {resources.length} resources
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
          {/* Format Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1 shrink-0">Format:</span>
            {["ALL", "COURSE", "INTERACTIVE", "DOCUMENTATION", "BOOK", "TUTORIAL"].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedFormat === fmt
                    ? "bg-teal-500 text-slate-950 shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {fmt === "ALL" ? "All Formats" : fmt}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1 shrink-0">Level:</span>
            {["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDifficulty === diff
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {diff === "ALL" ? "All Levels" : diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 rounded-2xl glass-panel space-y-2">
          <BookOpen className="h-8 w-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No matching resources found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or removing active filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((res) => {
            const feedback = feedbackState[res.id];
            return (
              <div
                key={res.id}
                className="p-5 rounded-2xl glass-panel hover:glass-panel-glow transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-teal-300 font-semibold border border-slate-700 uppercase">
                        {res.type} • {res.provider}
                      </span>
                      {res.difficulty && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 font-semibold border border-indigo-800/40 uppercase">
                          {res.difficulty}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{res.qualityScore}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100">{res.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{res.description}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  {/* Score & Reasons */}
                  {res.recommendationScore && (
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1 text-slate-300">
                      <div className="flex justify-between font-bold text-teal-400">
                        <span>Hybrid Ranking Score:</span>
                        <span>{res.recommendationScore.totalScore} / 1.0</span>
                      </div>
                      <p className="text-slate-400 text-[10px]">{res.recommendationScore.reasons.whyThis}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <button
                        onClick={() => handleFeedback(res.id, "UP")}
                        title="Mark as helpful"
                        className={`p-1.5 rounded-lg border transition-colors ${
                          feedback === "UP"
                            ? "bg-teal-500/20 border-teal-500 text-teal-300"
                            : "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-400"
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(res.id, "DOWN")}
                        title="Mark as unhelpful"
                        className={`p-1.5 rounded-lg border transition-colors ${
                          feedback === "DOWN"
                            ? "bg-rose-500/20 border-rose-500 text-rose-300"
                            : "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-400"
                        }`}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all"
                    >
                      <span>Launch Resource</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
