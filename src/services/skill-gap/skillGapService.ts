import { SkillGap, LearnerDigitalTwin } from "@/types";
import { SKILL_CATALOG, TARGET_ROLE_TRACKS } from "@/data/seedCatalog";
import { defaultSkillGraphService } from "../skill-engine/skillGraphService";

export class SkillGapService {
  /**
   * Computes the prioritized list of skill gaps between the learner's digital twin and their target role.
   */
  static analyzeSkillGaps(twin: LearnerDigitalTwin): SkillGap[] {
    const targetTrack = TARGET_ROLE_TRACKS.find(
      t => t.title.toLowerCase().includes(twin.targetRole.toLowerCase())
    ) || TARGET_ROLE_TRACKS[0];

    const masteredSet = new Set(
      Object.values(twin.skills)
        .filter(s => s.estimatedLevel >= 65)
        .map(s => s.skillId)
    );

    const gaps: SkillGap[] = [];

    for (const req of targetTrack.requiredSkills) {
      const skill = defaultSkillGraphService.getSkill(req.skillId);
      if (!skill) continue;

      const currentMastery = twin.skills[req.skillId]?.estimatedLevel || 0;
      const gapMagnitude = Math.max(0, req.requiredMastery - currentMastery);

      if (gapMagnitude > 0) {
        const missingPrereqs = defaultSkillGraphService.getMissingPrerequisites(req.skillId, masteredSet);
        const depth = defaultSkillGraphService.getSkillDepth(req.skillId);
        
        // Critical path if downstream skills depend directly on this skill
        const allSkillsInTrack = targetTrack.requiredSkills.map(r => r.skillId);
        const hasDependentsInTrack = allSkillsInTrack.some(otherId => {
          const other = defaultSkillGraphService.getSkill(otherId);
          return other?.prerequisites.includes(req.skillId);
        });

        // Priority Score computation (0 - 100)
        // 0.35 * Goal Relevance + 0.25 * Importance + 0.20 * Dependency Impact + 0.10 * Gap Magnitude + 0.10 * Depth/Urgency
        const goalRelevanceFactor = (req.importance / 2.0) * 35;
        const skillImportanceFactor = (skill.importanceWeight / 2.0) * 25;
        const dependencyFactor = hasDependentsInTrack ? 20 : 10;
        const gapFactor = (gapMagnitude / 100) * 10;
        const urgencyFactor = missingPrereqs.length === 0 ? 10 : 4; // Higher urgency if unblocked right now!

        const priorityScore = Math.min(100, Math.round(
          goalRelevanceFactor + skillImportanceFactor + dependencyFactor + gapFactor + urgencyFactor
        ));

        gaps.push({
          skillId: skill.id,
          skillName: skill.name,
          category: skill.category,
          difficulty: skill.difficulty,
          currentLevel: currentMastery,
          requiredLevel: req.requiredMastery,
          gapMagnitude,
          importance: req.importance,
          prerequisites: skill.prerequisites,
          missingPrerequisites: missingPrereqs,
          estimatedHours: Math.round(skill.estimatedHoursToMaster * (gapMagnitude / 100)),
          priorityScore,
          criticalPath: hasDependentsInTrack || depth <= 1,
        });
      }
    }

    // Sort by highest priority score descending
    gaps.sort((a, b) => {
      // First unblocked items before blocked items
      if (a.missingPrerequisites.length === 0 && b.missingPrerequisites.length > 0) return -1;
      if (a.missingPrerequisites.length > 0 && b.missingPrerequisites.length === 0) return 1;
      return b.priorityScore - a.priorityScore;
    });

    return gaps;
  }
}
