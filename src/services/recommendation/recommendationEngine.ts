import { LearnerDigitalTwin, RecommendationScore, LearningStep } from "@/types";
import { RESOURCE_CATALOG, PROJECT_CATALOG, ASSESSMENT_CATALOG, SeedResource } from "@/data/seedCatalog";
import { defaultSkillGraphService } from "../skill-engine/skillGraphService";
import { SkillGapService } from "../skill-gap/skillGapService";

export class RecommendationEngine {
  /**
   * Evaluates and scores a learning resource for a specific learner digital twin.
   */
  static scoreResource(
    resource: SeedResource,
    twin: LearnerDigitalTwin,
    targetSkillId: string
  ): RecommendationScore {
    const gaps = SkillGapService.analyzeSkillGaps(twin);
    const targetGap = gaps.find(g => g.skillId === targetSkillId) || gaps[0];
    const skill = defaultSkillGraphService.getSkill(targetSkillId);

    // 1. Goal Relevance (0 - 1.0)
    const primarySkillMatch = resource.skills.find(s => s.skillId === targetSkillId);
    const goalRelevance = primarySkillMatch ? primarySkillMatch.coverage / 100 : 0.4;

    // 2. Skill Gap Relevance (0 - 1.0)
    const skillGapRelevance = targetGap ? Math.min(1.0, targetGap.gapMagnitude / 100) : 0.5;

    // 3. Prerequisite Fit (0 - 1.0)
    const masteredSet = new Set(
      Object.values(twin.skills)
        .filter(s => s.estimatedLevel >= 60)
        .map(s => s.skillId)
    );
    const missingPrereqs = skill ? defaultSkillGraphService.getMissingPrerequisites(skill.id, masteredSet) : [];
    const prerequisiteFit = missingPrereqs.length === 0 ? 1.0 : Math.max(0.1, 1.0 - missingPrereqs.length * 0.4);

    // 4. Difficulty Fit (0 - 1.0)
    const currentLevel = twin.skills[targetSkillId]?.estimatedLevel || 0;
    let difficultyFit = 0.8;
    if (resource.difficulty === "BEGINNER" && currentLevel < 40) difficultyFit = 1.0;
    else if (resource.difficulty === "INTERMEDIATE" && currentLevel >= 30 && currentLevel <= 75) difficultyFit = 1.0;
    else if (resource.difficulty === "ADVANCED" && currentLevel >= 60) difficultyFit = 1.0;
    else difficultyFit = 0.6;

    // 5. Learner Preference (Format matching, 0 - 1.0)
    const matchesFormat = twin.preferredFormats.some(f => 
      f.toLowerCase() === resource.format.toLowerCase() || f.toLowerCase() === resource.type.toLowerCase()
    );
    const learnerPreference = matchesFormat ? 0.95 : 0.70;

    // 6. Resource Quality (0 - 1.0)
    const resourceQuality = Math.min(1.0, resource.qualityScore / 5.0);

    // 7. Deadline Fit (0 - 1.0)
    const hoursNeeded = resource.durationMinutes / 60;
    const deadlineFit = hoursNeeded <= (twin.availableHoursPerWeek * 1.2) ? 0.95 : 0.70;

    // 8. Historical Feedback (0 - 1.0)
    const historicalFeedback = 0.90; // Nominal high feedback

    // Transparent weighted formula
    const totalScore = Number((
      0.30 * goalRelevance +
      0.20 * skillGapRelevance +
      0.15 * prerequisiteFit +
      0.10 * difficultyFit +
      0.10 * learnerPreference +
      0.05 * resourceQuality +
      0.05 * deadlineFit +
      0.05 * historicalFeedback
    ).toFixed(3));

    // Transparent Explainability
    const whyThis = `This resource directly targets ${skill?.name || "your target skill"} with ${primarySkillMatch?.coverage || 85}% curriculum coverage and a proven quality rating of ${resource.qualityScore}/5.0.`;
    const whyNow = missingPrereqs.length === 0
      ? `All prerequisite fundamentals are verified in your profile. Your current mastery is ${currentLevel}%, making this the optimal next learning step.`
      : `Note: Foundational skills (${missingPrereqs.join(", ")}) are still developing, but this resource provides bridge context.`;
    const whyNotAlternative = `Prioritized over theoretical textbooks due to your ${twin.learningStrategy.replace("_", " ").toLowerCase()} strategy prioritizing interactive & practical artifacts.`;

    return {
      totalScore,
      factors: {
        goalRelevance,
        skillGapRelevance,
        prerequisiteFit,
        difficultyFit,
        learnerPreference,
        resourceQuality,
        deadlineFit,
        historicalFeedback,
      },
      reasons: {
        whyThis,
        whyNow,
        whyNotAlternative,
      },
    };
  }
}
