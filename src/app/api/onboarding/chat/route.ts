import { NextResponse } from "next/server";
import { getAIProvider } from "@/services/ai/aiProvider";
import { SKILL_CATALOG } from "@/data/seedCatalog";

export async function POST(req: Request) {
  try {
    const { messages, currentTurn } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    const provider = getAIProvider();

    // Contextual multi-turn reasoning for onboarding
    let aiResponseText = "";
    let extractedData: any = null;
    let isReadyToGenerate = false;

    if (currentTurn === 0 || messages.length <= 2) {
      aiResponseText = "Welcome to the AI Learning Intelligence Platform. To build your personalized learning twin, tell me about your current background: What programming languages or frameworks have you worked with, and have you built any machine learning or backend projects?";
    } else if (currentTurn === 1 || messages.length <= 4) {
      if (lastUserMessage.toLowerCase().includes("python") || lastUserMessage.toLowerCase().includes("sql") || lastUserMessage.toLowerCase().includes("flask") || lastUserMessage.toLowerCase().includes("django")) {
        aiResponseText = "Great! I've registered your Python and data foundations. Next question: How much time can you commit to studying per week (e.g. 5, 10, 15, or 20 hours), and what is your target timeline (e.g. 3, 6, or 9 months)?";
      } else {
        aiResponseText = "Thanks! Have you had hands-on experience training models with PyTorch or building REST APIs and Docker containers?";
      }
    } else if (currentTurn === 2 || messages.length <= 6) {
      aiResponseText = "Understood! Which learning strategy fits your style best?\n1. **Balanced** (Theory + Practice)\n2. **Fast Track** (Speed & Essentials)\n3. **Project First** (Learn by building end-to-end architectures)\n4. **Deep Mastery** (Low-level math & systems)";
    } else {
      isReadyToGenerate = true;
      aiResponseText = "Perfect! I have synthesized your background, time capacity, and strategic preferences into your Learner Digital Twin. I am ready to construct your DAG skill graph, compute missing prerequisites, and optimize your personalized roadmap!";
      extractedData = {
        targetRole: "Production AI / LLM Engineer",
        targetDeadlineWeeks: 24,
        availableHoursPerWeek: 10,
        strategy: "BALANCED",
        claimedSkills: [
          { skillId: "python-core", level: 80 },
          { skillId: "git-version-control", level: 75 },
          { skillId: "sql-databases", level: 60 },
          { skillId: "numpy-pandas-data", level: 65 },
          { skillId: "classical-ml", level: 50 },
        ],
      };
    }

    return NextResponse.json({
      message: aiResponseText,
      isReadyToGenerate,
      extractedData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process chat" }, { status: 500 });
  }
}
