import { NextResponse } from "next/server";
import { RESOURCE_CATALOG } from "@/data/seedCatalog";
import { AppStoreService } from "@/services/state/appStore";
import { RecommendationEngine } from "@/services/recommendation/recommendationEngine";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const skillId = searchParams.get("skillId");
  const type = searchParams.get("type");

  const { twin } = AppStoreService.getState();

  let resources = RESOURCE_CATALOG;
  if (skillId) {
    resources = resources.filter(r => r.skills.some(s => s.skillId === skillId));
  }
  if (type) {
    resources = resources.filter(r => r.type.toLowerCase() === type.toLowerCase());
  }

  // Attach dynamic scoring to each resource
  const scoredResources = resources.map(r => {
    const targetSkill = skillId || r.skills[0]?.skillId || "python-core";
    const score = RecommendationEngine.scoreResource(r, twin, targetSkill);
    return {
      ...r,
      recommendationScore: score,
      isCompleted: twin.completedResources.includes(r.id),
    };
  }).sort((a, b) => b.recommendationScore.totalScore - a.recommendationScore.totalScore);

  return NextResponse.json({ resources: scoredResources });
}
