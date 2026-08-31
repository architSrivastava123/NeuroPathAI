import { NextResponse } from "next/server";
import { AppStoreService } from "@/services/state/appStore";
import { SKILL_CATALOG } from "@/data/seedCatalog";
import { defaultSkillGraphService } from "@/services/skill-engine/skillGraphService";

export async function GET() {
  const { twin } = AppStoreService.getState();

  const skillsWithState = SKILL_CATALOG.map(skill => {
    const userState = twin.skills[skill.id] || {
      estimatedLevel: 0,
      confidence: 0.1,
      status: skill.prerequisites.length === 0 ? "AVAILABLE" : "LOCKED",
    };

    const depth = defaultSkillGraphService.getSkillDepth(skill.id);

    return {
      ...skill,
      depth,
      userState,
    };
  });

  return NextResponse.json({
    skills: skillsWithState,
    totalSkills: SKILL_CATALOG.length,
    categories: Array.from(new Set(SKILL_CATALOG.map(s => s.category))),
  });
}
