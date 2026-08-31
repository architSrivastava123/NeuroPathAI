import { NextResponse } from "next/server";
import { AppStoreService } from "@/services/state/appStore";
import { SkillGapService } from "@/services/skill-gap/skillGapService";
import { SKILL_CATALOG } from "@/data/seedCatalog";

export async function GET() {
  const { twin, roadmap, nextBestAction } = AppStoreService.getState();
  const gaps = SkillGapService.analyzeSkillGaps(twin);

  // Prepare radar chart data
  const keySkillIds = [
    "python-core",
    "classical-ml",
    "deep-learning-foundations",
    "transformers-nlp",
    "vector-databases-embeddings",
    "rag-systems",
    "autonomous-ai-agents",
    "mlops-model-serving",
  ];

  const radarData = keySkillIds.map(id => {
    const skill = SKILL_CATALOG.find(s => s.id === id);
    const userMastery = twin.skills[id]?.estimatedLevel || 0;
    const gap = gaps.find(g => g.skillId === id);
    const target = gap ? gap.requiredLevel : 85;

    return {
      skill: skill?.name.split(" ")[0] || id,
      fullName: skill?.name || id,
      current: userMastery,
      target,
      confidence: Math.round((twin.skills[id]?.confidence || 0.2) * 100),
    };
  });

  // Calculate overall metrics
  const completedSteps = roadmap.weeklySchedule.flatMap(w => w.steps).filter(s => s.status === "COMPLETED" || s.status === "MASTERED").length;
  const totalSteps = roadmap.weeklySchedule.flatMap(w => w.steps).length;
  const completionPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return NextResponse.json({
    twin,
    roadmap,
    nextBestAction,
    gaps,
    radarData,
    metrics: {
      completionPercentage,
      completedSteps,
      totalSteps,
      learningVelocity: twin.learningVelocity,
      consistencyScore: Math.round(twin.consistencyScore * 100),
      hoursCompletedThisWeek: 6.5,
      plannedHoursPerWeek: twin.availableHoursPerWeek,
      currentStreakDays: 12,
    },
  });
}
