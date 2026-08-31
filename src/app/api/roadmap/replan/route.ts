import { NextResponse } from "next/server";
import { AppStoreService } from "@/services/state/appStore";
import { AdaptiveReplanningService } from "@/services/roadmap/adaptiveReplanningService";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { triggerType = "MANUAL_RECALCULATION", skillId, scoreAchieved } = body;

    const { roadmap, twin } = AppStoreService.getState();

    const adaptationResult = AdaptiveReplanningService.replan(roadmap, twin, {
      triggerType,
      skillId,
      scoreAchieved,
    });

    AppStoreService.updateRoadmap(adaptationResult.updatedRoadmap);

    return NextResponse.json({
      success: true,
      roadmap: adaptationResult.updatedRoadmap,
      changesSummary: adaptationResult.changesSummary,
      explanation: adaptationResult.explanation,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to replan roadmap" }, { status: 500 });
  }
}
