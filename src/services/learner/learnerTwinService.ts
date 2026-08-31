import { LearnerDigitalTwin, SkillMasteryState, StepStatus } from "@/types";
import { SKILL_CATALOG, TARGET_ROLE_TRACKS } from "@/data/seedCatalog";

export class LearnerTwinService {
  /**
   * Calculates confidence-weighted mastery combining multiple evidence streams:
   * Self-Report: 60% weight
   * Course Completion: 70% weight
   * Project Evaluation: 82% weight
   * Assessment: 88% weight
   */
  static calculateMasteryScore(evidence: {
    selfReport?: number;
    courseScore?: number;
    projectScore?: number;
    assessmentScore?: number;
  }): { estimatedLevel: number; confidence: number } {
    const weights = {
      selfReport: 0.60,
      course: 0.70,
      project: 0.82,
      assessment: 0.88,
    };

    let totalWeight = 0;
    let weightedSum = 0;
    let evidenceCount = 0;

    if (evidence.selfReport !== undefined) {
      weightedSum += evidence.selfReport * weights.selfReport;
      totalWeight += weights.selfReport;
      evidenceCount++;
    }
    if (evidence.courseScore !== undefined) {
      weightedSum += evidence.courseScore * weights.course;
      totalWeight += weights.course;
      evidenceCount++;
    }
    if (evidence.projectScore !== undefined) {
      weightedSum += evidence.projectScore * weights.project;
      totalWeight += weights.project;
      evidenceCount += 2;
    }
    if (evidence.assessmentScore !== undefined) {
      weightedSum += evidence.assessmentScore * weights.assessment;
      totalWeight += weights.assessment;
      evidenceCount += 2;
    }

    if (totalWeight === 0) {
      return { estimatedLevel: 0, confidence: 0.1 };
    }

    const estimatedLevel = Math.min(100, Math.round(weightedSum / totalWeight));
    // Confidence grows as more objective demonstrations (assessments/projects) are submitted
    const confidence = Math.min(0.98, Number((totalWeight / 2.0).toFixed(2)));

    return { estimatedLevel, confidence };
  }

  /**
   * Computes the node status based on mastery and prerequisites.
   */
  static determineStatus(
    masteryLevel: number,
    missingPrerequisitesCount: number
  ): StepStatus {
    if (masteryLevel >= 85) return "MASTERED";
    if (masteryLevel >= 70) return "COMPLETED";
    if (missingPrerequisitesCount > 0) return "LOCKED";
    if (masteryLevel > 0) return "IN_PROGRESS";
    return "AVAILABLE";
  }

  /**
   * Initializes a default or customized Learner Digital Twin.
   */
  static createInitialTwin(params: {
    id?: string;
    name?: string;
    email?: string;
    targetRole?: string;
    targetDeadlineWeeks?: number;
    availableHoursPerWeek?: number;
    strategy?: "FAST_TRACK" | "BALANCED" | "PROJECT_FIRST" | "INTERVIEW_FIRST" | "DEEP_MASTERY";
    claimedSkills?: { skillId: string; level: number }[];
  }): LearnerDigitalTwin {
    const skillsMap: Record<string, SkillMasteryState> = {};

    // Initialize all known skills with 0 base
    for (const skill of SKILL_CATALOG) {
      skillsMap[skill.id] = {
        skillId: skill.id,
        estimatedLevel: 0,
        confidence: 0.1,
        status: skill.prerequisites.length === 0 ? "AVAILABLE" : "LOCKED",
        lastEvaluatedAt: new Date().toISOString(),
        decayFactor: 1.0,
        evidenceCount: 0,
      };
    }

    // Apply claimed skills from onboarding
    if (params.claimedSkills) {
      for (const claimed of params.claimedSkills) {
        if (skillsMap[claimed.skillId]) {
          const { estimatedLevel, confidence } = this.calculateMasteryScore({
            selfReport: claimed.level,
          });
          skillsMap[claimed.skillId] = {
            ...skillsMap[claimed.skillId],
            estimatedLevel,
            confidence,
            selfReportedLevel: claimed.level,
            status: claimed.level >= 80 ? "MASTERED" : claimed.level >= 60 ? "COMPLETED" : "IN_PROGRESS",
            evidenceCount: 1,
          };
        }
      }
    }

    // Determine lock states based on initial skills
    const masteredOrCompleted = new Set(
      Object.values(skillsMap)
        .filter(s => s.estimatedLevel >= 60)
        .map(s => s.skillId)
    );

    for (const skill of SKILL_CATALOG) {
      const current = skillsMap[skill.id];
      if (current.estimatedLevel < 60) {
        const missing = skill.prerequisites.filter(p => !masteredOrCompleted.has(p));
        current.status = missing.length > 0 ? "LOCKED" : current.estimatedLevel > 0 ? "IN_PROGRESS" : "AVAILABLE";
      }
    }

    // Calculate goal progress against target role track
    const targetTrack = TARGET_ROLE_TRACKS.find(
      t => t.title.toLowerCase().includes((params.targetRole || "ai engineer").toLowerCase())
    ) || TARGET_ROLE_TRACKS[0];

    let totalRequired = 0;
    let totalAchieved = 0;
    for (const req of targetTrack.requiredSkills) {
      totalRequired += req.requiredMastery * req.importance;
      const userLevel = skillsMap[req.skillId]?.estimatedLevel || 0;
      totalAchieved += Math.min(req.requiredMastery, userLevel) * req.importance;
    }
    const goalProgress = Math.round((totalAchieved / (totalRequired || 1)) * 100);

    return {
      id: params.id || "demo-learner-1",
      name: params.name || "Alex Rivers",
      email: params.email || "alex.rivers@example.com",
      targetRole: params.targetRole || "Production AI / LLM Engineer",
      targetDeadlineWeeks: params.targetDeadlineWeeks || 24,
      availableHoursPerWeek: params.availableHoursPerWeek || 10,
      learningStrategy: params.strategy || "BALANCED",
      preferredFormats: ["PROJECTS", "INTERACTIVE", "VIDEO", "DOCUMENTATION"],
      learningVelocity: 1.15,
      consistencyScore: 0.92,
      skills: skillsMap,
      completedResources: ["res-py-1"],
      completedAssessments: ["assess-python-1"],
      completedProjects: [],
      goalProgress: Math.max(15, goalProgress),
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Updates learner mastery after completing an assessment.
   */
  static applyAssessmentResult(
    twin: LearnerDigitalTwin,
    skillId: string,
    score: number
  ): { updatedTwin: LearnerDigitalTwin; oldLevel: number; newLevel: number } {
    const current = twin.skills[skillId] || {
      skillId,
      estimatedLevel: 0,
      confidence: 0.2,
      status: "IN_PROGRESS",
      lastEvaluatedAt: new Date().toISOString(),
      decayFactor: 1.0,
      evidenceCount: 0,
    };

    const oldLevel = current.estimatedLevel;
    const { estimatedLevel, confidence } = this.calculateMasteryScore({
      selfReport: current.selfReportedLevel,
      courseScore: current.courseEvidenceScore,
      projectScore: current.projectEvidenceScore,
      assessmentScore: score,
    });

    const updatedSkills = { ...twin.skills };
    const newStatus: StepStatus = estimatedLevel >= 80 ? "MASTERED" : estimatedLevel >= 65 ? "COMPLETED" : "IN_PROGRESS";

    updatedSkills[skillId] = {
      ...current,
      estimatedLevel,
      confidence,
      assessmentScore: score,
      status: newStatus,
      lastEvaluatedAt: new Date().toISOString(),
      evidenceCount: current.evidenceCount + 1,
    };

    // Unlock any downstream skills whose prerequisites are now satisfied
    const masteredSet = new Set(
      Object.values(updatedSkills)
        .filter(s => s.estimatedLevel >= 60)
        .map(s => s.skillId)
    );

    for (const skill of SKILL_CATALOG) {
      const state = updatedSkills[skill.id];
      if (state && state.status === "LOCKED") {
        const missing = skill.prerequisites.filter(p => !masteredSet.has(p));
        if (missing.length === 0) {
          updatedSkills[skill.id] = { ...state, status: "AVAILABLE" };
        }
      }
    }

    const updatedTwin: LearnerDigitalTwin = {
      ...twin,
      skills: updatedSkills,
      completedAssessments: Array.from(new Set([...twin.completedAssessments, skillId])),
      updatedAt: new Date().toISOString(),
    };

    return { updatedTwin, oldLevel, newLevel: estimatedLevel };
  }

  /**
   * Updates learner mastery after submitting a project with rubric grades.
   */
  static applyProjectResult(
    twin: LearnerDigitalTwin,
    projectId: string,
    skillIds: string[],
    overallScore: number
  ): { updatedTwin: LearnerDigitalTwin; affectedSkills: string[] } {
    const updatedSkills = { ...twin.skills };

    for (const skillId of skillIds) {
      const current = updatedSkills[skillId] || {
        skillId,
        estimatedLevel: 0,
        confidence: 0.2,
        status: "IN_PROGRESS",
        lastEvaluatedAt: new Date().toISOString(),
        decayFactor: 1.0,
        evidenceCount: 0,
      };

      const { estimatedLevel, confidence } = this.calculateMasteryScore({
        selfReport: current.selfReportedLevel,
        courseScore: current.courseEvidenceScore,
        projectScore: overallScore,
        assessmentScore: current.assessmentScore,
      });

      updatedSkills[skillId] = {
        ...current,
        estimatedLevel,
        confidence,
        projectEvidenceScore: overallScore,
        status: estimatedLevel >= 80 ? "MASTERED" : estimatedLevel >= 65 ? "COMPLETED" : "IN_PROGRESS",
        lastEvaluatedAt: new Date().toISOString(),
        evidenceCount: current.evidenceCount + 1,
      };
    }

    const updatedTwin: LearnerDigitalTwin = {
      ...twin,
      skills: updatedSkills,
      completedProjects: Array.from(new Set([...twin.completedProjects, projectId])),
      updatedAt: new Date().toISOString(),
    };

    return { updatedTwin, affectedSkills: skillIds };
  }
}
