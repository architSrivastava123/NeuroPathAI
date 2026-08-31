"use client";

import { useEffect, useState } from "react";
import { SeedAssessment } from "@/data/seedCatalog";
import confetti from "canvas-confetti";
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  HelpCircle,
  PlayCircle
} from "lucide-react";

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<SeedAssessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAssessments = async () => {
    try {
      const res = await fetch("/api/assessments");
      const data = await res.json();
      setAssessments(data.assessments);
      if (data.assessments.length > 0 && !activeAssessment) {
        setActiveAssessment(data.assessments[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (!activeAssessment || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: activeAssessment.id,
          answers,
        }),
      });

      const data = await res.json();
      setResult(data);

      if (data.passed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetQuiz = (assessment: any) => {
    setActiveAssessment(assessment);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Adaptive Diagnostic Assessments</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              Evidence Engine (88% wt)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Validate demonstrated proficiency to automatically prune prerequisite bottlenecks from your schedule.
          </p>
        </div>
      </div>

      {/* Assessment Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {assessments.map((a) => {
          const isSelected = activeAssessment?.id === a.id;
          return (
            <button
              key={a.id}
              onClick={() => handleResetQuiz(a)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                isSelected
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>{a.title.split("Assessment")[0]}</span>
              {a.isCompleted && (
                <CheckCircle2 className={`h-3.5 w-3.5 ${isSelected ? "text-slate-950" : "text-emerald-400"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Quiz Area */}
      {activeAssessment && (
        <div className="rounded-3xl glass-panel-glow p-6 sm:p-8 space-y-6">
          {/* Quiz Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Target Competency: {activeAssessment.targetSkillId}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">{activeAssessment.title}</h2>
              <p className="text-xs text-slate-400 mt-1">{activeAssessment.description}</p>
            </div>

            <div className="flex items-center gap-3 text-xs shrink-0">
              <span className="flex items-center gap-1 text-slate-300 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                {activeAssessment.timeLimitMinutes} mins
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold">
                Passing: {activeAssessment.passingScore}%
              </span>
            </div>
          </div>

          {/* Result Alert / Celebration */}
          {result && (
            <div className={`p-5 rounded-2xl border space-y-3 animate-in fade-in slide-in-from-top-3 ${
              result.passed
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-100"
                : "bg-amber-950/40 border-amber-500/40 text-amber-100"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {result.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-amber-400" />
                  )}
                  <h3 className="text-sm font-bold">
                    {result.passed ? "Assessment Passed! Skill Mastery Updated" : "Assessment Complete - Remedial Practice Added"}
                  </h3>
                </div>
                <span className="text-lg font-black">{result.score}%</span>
              </div>

              <p className="text-xs leading-relaxed opacity-90">{result.adaptationExplanation}</p>

              {result.changesSummary?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.changesSummary.map((c: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-900/80 text-[10px] font-semibold">
                      ✓ {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {activeAssessment.questions.map((q: any, qIdx: number) => {
              const itemRes = result?.itemResults?.find((r: any) => r.questionId === q.id);
              return (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-sm font-bold text-slate-100 leading-snug">
                      <span className="text-teal-400 mr-2">Q{qIdx + 1}.</span>
                      {q.prompt}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-500 shrink-0 uppercase">
                      {q.difficulty}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options?.map((opt: string, oIdx: number) => {
                      const isSelected = answers[q.id] === opt;
                      const isCorrect = itemRes?.correctAnswer === opt;
                      const isUserChoice = itemRes?.userAnswer === opt;

                      let optClass = "bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700 text-slate-300";
                      if (result) {
                        if (isCorrect) {
                          optClass = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold";
                        } else if (isUserChoice && !isCorrect) {
                          optClass = "bg-rose-950/60 border-rose-500 text-rose-200";
                        }
                      } else if (isSelected) {
                        optClass = "bg-teal-500/15 border-teal-500 text-teal-200 font-semibold";
                      }

                      return (
                        <div
                          key={oIdx}
                          onClick={() => !result && handleSelectOption(q.id, opt)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${optClass}`}
                        >
                          <span>{opt}</span>
                          {isSelected && !result && (
                            <span className="h-2 w-2 rounded-full bg-teal-400 shrink-0"></span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {itemRes && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <span className="font-bold text-teal-400 block text-[11px]">Explanation:</span>
                      <p>{itemRes.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit / Reset Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              {Object.keys(answers).length} of {activeAssessment.questions.length} Questions Answered
            </span>

            {result ? (
              <button
                onClick={() => handleResetQuiz(activeAssessment)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Retake Assessment
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length === 0}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                {submitting ? "Evaluating Demonstrated Evidence..." : "Submit Diagnostic Answers"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
