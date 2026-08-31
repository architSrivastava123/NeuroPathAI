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
  Star
} from "lucide-react";

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>("ALL");
  const [feedbackState, setFeedbackState] = useState<Record<string, "UP" | "DOWN">>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resources")
      .then(res => res.json())
      .then(data => setResources(data.resources || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedFormat === "ALL"
    ? resources
    : resources.filter(r => r.type.toLowerCase() === selectedFormat.toLowerCase());

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

      {/* Format Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["ALL", "COURSE", "INTERACTIVE", "DOCUMENTATION", "BOOK", "TUTORIAL"].map((fmt) => (
          <button
            key={fmt}
            onClick={() => setSelectedFormat(fmt)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFormat === fmt
                ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {fmt === "ALL" ? "All Formats" : fmt}
          </button>
        ))}
      </div>

      {/* Resource Cards Grid */}
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
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-teal-300 font-semibold border border-slate-700 uppercase">
                    {res.type} • {res.provider}
                  </span>

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
    </div>
  );
}
