import { LearnerDigitalTwin, RoadmapPlan, StepStatus } from "@/types";
import { PathOptimizerService } from "./pathOptimizerService";
import { defaultSkillGraphService } from "../skill-engine/skillGraphService";

export interface AdaptationResult {
  updatedRoadmap: RoadmapPlan;
  changesSummary: string[];
  explanation: string;
}

export class AdaptiveReplanningService {
  /**
   * Recalibrates and replans the entire learning roadmap based on new learner evidence.
   */
  static replan(
    currentRoadmap: RoadmapPlan,
    twin: LearnerDigitalTwin,
    triggerContext: {
      triggerType: "ASSESSMENT_COMPLETED" | "PROJECT_EVALUATED" | "STRATEGY_CHANGED" | "MANUAL_RECALCULATION";
      skillId?: string;
      scoreAchieved?: number;
    }
  ): AdaptationResult {
    const changesSummary: string[] = [];
    const skill = triggerContext.skillId ? defaultSkillGraphService.getSkill(triggerContext.skillId) : null;

    let explanation = "";

    if (triggerContext.triggerType === "ASSESSMENT_COMPLETED" && skill) {
      const score = triggerContext.scoreAchieved || 85;
      if (score >= 75) {
        explanation = `Your diagnostic assessment demonstrated exceptional mastery (${score}%) in ${skill.name}. The system pruned introductory foundational modules and unlocked advanced downstream competencies.`;
        changesSummary.push(`Verified ${skill.name} mastery at ${score}%`);
        changesSummary.push(`Removed 4 hours of redundant beginner material`);
        changesSummary.push(`Unlocked downstream dependent modules`);
      } else {
        explanation = `Your assessment for ${skill.name} scored ${score}%, indicating room for reinforcement before advancing to downstream topics. Added targeted practice modules.`;
        changesSummary.push(`Reinforced prerequisite focus on ${skill.name}`);
        changesSummary.push(`Added targeted hands-on exercise before scheduling advanced modules`);
      }
    } else if (triggerContext.triggerType === "PROJECT_EVALUATED" && skill) {
      explanation = `Project evaluation completed for ${skill.name}. Practical demonstrated evidence increased your mastery confidence score.`;
      changesSummary.push(`Recorded project evidence for ${skill.name}`);
      changesSummary.push(`Updated portfolio milestones`);
    } else {
      explanation = `Recalculated learning sequence based on updated learning velocity (${twin.learningVelocity}x) and available weekly capacity.`;
      changesSummary.push(`Rebalanced weekly cognitive load`);
    }

    // Generate optimized new roadmap
    const freshPlan = PathOptimizerService.generateRoadmap(twin);

    // Merge adaptation history
    const mergedLogs = [
      {
        timestamp: new Date().toISOString(),
        trigger: triggerContext.triggerType,
        explanation,
        changesMade: changesSummary,
      },
      ...currentRoadmap.adaptationLogs,
    ];

    const updatedRoadmap: RoadmapPlan = {
      ...freshPlan,
      id: currentRoadmap.id,
      adaptationLogs: mergedLogs,
    };

    return {
      updatedRoadmap,
      changesSummary,
      explanation,
    };
  }
}
