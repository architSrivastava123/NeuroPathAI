import { NextResponse } from "next/server";
import { PROJECT_CATALOG } from "@/data/seedCatalog";
import { AppStoreService } from "@/services/state/appStore";
import { LearnerTwinService } from "@/services/learner/learnerTwinService";
import { getAIProvider } from "@/services/ai/aiProvider";
import { AdaptiveReplanningService } from "@/services/roadmap/adaptiveReplanningService";

export async function GET() {
  const { twin } = AppStoreService.getState();
  const projects = PROJECT_CATALOG.map(p => {
    const isCompleted = twin.completedProjects.includes(p.id);
    return {
      ...p,
      isCompleted,
    };
  });

  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  try {
    const { projectId, repoUrl, liveUrl, description, submittedCode } = await req.json();
    const project = PROJECT_CATALOG.find(p => p.id === projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const provider = getAIProvider();
    const evaluation = await provider.evaluate(
      JSON.stringify(project.rubric),
      `${description || ""} \n ${submittedCode || ""} \n ${repoUrl || ""}`
    );

    const { twin, roadmap } = AppStoreService.getState();
    const { updatedTwin, affectedSkills } = LearnerTwinService.applyProjectResult(
      twin,
      projectId,
      project.skills,
      evaluation.score
    );

    AppStoreService.updateTwin(updatedTwin);

    const adaptation = AdaptiveReplanningService.replan(roadmap, updatedTwin, {
      triggerType: "PROJECT_EVALUATED",
      skillId: project.skills[0],
      scoreAchieved: evaluation.score,
    });

    AppStoreService.updateRoadmap(adaptation.updatedRoadmap);

    return NextResponse.json({
      success: true,
      score: evaluation.score,
      breakdown: evaluation.breakdown,
      commentary: evaluation.commentary,
      affectedSkills,
      adaptationExplanation: adaptation.explanation,
      changesSummary: adaptation.changesSummary,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to evaluate project" }, { status: 500 });
  }
}
