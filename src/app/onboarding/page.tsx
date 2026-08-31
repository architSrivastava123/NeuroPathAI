"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Target, 
  Cpu, 
  Layers, 
  User 
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I am your AI Learning Intelligence Agent. Tell me: what role do you want to master, what background do you already have, and how much time can you invest weekly?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Extracted profile state
  const [profile, setProfile] = useState({
    name: "Alex Rivers",
    email: "alex.rivers@example.com",
    targetRole: "Production AI / LLM Engineer",
    availableHoursPerWeek: 10,
    targetDeadlineWeeks: 24,
    strategy: "BALANCED" as const,
    claimedSkills: [
      { skillId: "python-core", level: 80 },
      { skillId: "git-version-control", level: 75 },
      { skillId: "sql-databases", level: 60 },
      { skillId: "numpy-pandas-data", level: 65 },
      { skillId: "classical-ml", level: 50 },
    ],
  });

  const sampleGoals = [
    "I want to become a production-level AI Engineer in 6 months. I know Python, basic ML and Git. I have 10 hours/week.",
    "I want to build full-stack AI applications with Next.js and LLMs. I have 15 hours/week and prefer project-first learning.",
    "I want to become an AI Agents & RAG Specialist. I have 12 hours/week and want deep mastery of vector retrieval and agent orchestration.",
    "I am a backend engineer with SQL and Docker experience wanting to master MLOps and LLM serving in 4 months.",
  ];

  const handleSendMessage = async (customText?: string) => {
    const text = customText || input;
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          currentTurn: Math.floor(newMessages.length / 2),
        }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      }

      if (data.extractedData) {
        setProfile(prev => ({
          ...prev,
          ...data.extractedData,
        }));
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Great! I have all the details needed to construct your personalized learning graph.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Conversational Onboarding</span>
        <h1 className="text-3xl font-black text-white">Let&apos;s Build Your Learner Digital Twin</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Describe your career ambition, current knowledge, and schedule constraints. Our AI decomposes your goals into an exact DAG dependency roadmap.
        </p>
      </div>

      {/* Main Container: Chat on Left, Extracted Twin on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-2 rounded-2xl glass-panel-glow flex flex-col h-[560px] overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100">AI Onboarding Agent</h3>
                <p className="text-[10px] text-teal-400 font-medium">Adaptive Multi-Turn Analysis</p>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Interactive Dialogue
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="h-7 w-7 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs italic">
                <Bot className="h-4 w-4 text-teal-400 animate-spin" />
                <span>Extracting competencies and prerequisite requirements...</span>
              </div>
            )}
          </div>

          {/* Quick Sample Prompts */}
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Quick One-Click Prompts:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {sampleGoals.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sample)}
                  className="shrink-0 text-[11px] px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-teal-500/10 text-slate-300 hover:text-teal-300 border border-slate-800 hover:border-teal-500/30 transition-colors text-left max-w-xs truncate"
                >
                  &quot;{sample}&quot;
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 border-t border-slate-800 bg-slate-900/90 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., I know Python and SQL and want to become an AI Engineer in 6 months studying 10 hrs/week..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 disabled:opacity-50 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Extracted Digital Twin Live Preview Panel */}
        <div className="rounded-2xl glass-panel p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <h3 className="text-sm font-bold text-slate-100">Live Extracted State</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Target Role</span>
                <p className="font-bold text-teal-300 text-sm">{profile.targetRole}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">Commitment</span>
                  <p className="font-bold text-slate-200">{profile.availableHoursPerWeek} hrs/week</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">Target Horizon</span>
                  <p className="font-bold text-slate-200">{profile.targetDeadlineWeeks} weeks</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1.5">Strategy Mode</span>
                <select
                  value={profile.strategy}
                  onChange={(e) => setProfile({ ...profile, strategy: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="BALANCED">Balanced (Theory + Projects)</option>
                  <option value="FAST_TRACK">Fast Track (Speed Optimized)</option>
                  <option value="PROJECT_FIRST">Project First (Build to Learn)</option>
                  <option value="INTERVIEW_FIRST">Interview First (Job Ready)</option>
                  <option value="DEEP_MASTERY">Deep Mastery (Foundations First)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Identified Prior Skills</span>
                <div className="space-y-1.5">
                  {profile.claimedSkills.map((sk) => (
                    <div key={sk.skillId} className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-300">{sk.skillId.replace(/-/g, " ")}</span>
                      <span className="font-bold text-teal-400">{sk.level}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCompleteOnboarding}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-indigo-600 hover:from-teal-300 hover:to-indigo-500 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all"
          >
            <span>{isGenerating ? "Synthesizing Roadmap..." : "Generate Personalized Path"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
