import { NextResponse } from "next/server";
import { getAIProvider } from "@/services/ai/aiProvider";
import { AppStoreService } from "@/services/state/appStore";

export async function POST(req: Request) {
  try {
    const { message, history = [], pageContext = "dashboard" } = await req.json();
    const { twin, roadmap, nextBestAction } = AppStoreService.getState();

    const provider = getAIProvider();

    const systemPrompt = `You are the AI Learning Intelligence Copilot.
The learner is "${twin.name}", aiming to become a "${twin.targetRole}".
Their learning strategy is "${twin.learningStrategy}" at ${twin.availableHoursPerWeek} hours/week.
Their current Next Best Action is: "${nextBestAction.title}" (${nextBestAction.skillName}).
Their current active page context is: "${pageContext}".
Always provide concise, rigorous, highly encouraging, and transparently reasoned guidance.`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((h: any) => ({ role: h.role, content: h.content })),
      { role: "user" as const, content: message },
    ];

    const reply = await provider.chat(messages, { systemPrompt });

    return NextResponse.json({
      reply,
      suggestedActions: [
        { label: "Why is this recommended?", query: "Why am I learning this current topic?" },
        { label: "Can I skip ahead?", query: "Can I skip this and go straight to RAG?" },
        { label: "Take diagnostic quiz", query: "Test me on my current skill" },
        { label: "Recalculate schedule", query: "I have 5 extra hours this week. Update my roadmap." },
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Copilot failed to respond" }, { status: 500 });
  }
}
