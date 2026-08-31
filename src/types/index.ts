export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
export type StepStatus = "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETED" | "MASTERED" | "SKIPPED";
export type Strategy = "FAST_TRACK" | "BALANCED" | "PROJECT_FIRST" | "INTERVIEW_FIRST" | "DEEP_MASTERY";

export interface SkillNode {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  importanceWeight: number; // 0.1 - 2.0
  parentSkillId?: string | null;
  prerequisites: string[]; // Skill IDs
  estimatedHoursToMaster: number;
}

export interface SkillMasteryState {
  skillId: string;
  estimatedLevel: number; // 0 - 100%
  confidence: number; // 0.0 - 1.0
  status: StepStatus;
  selfReportedLevel?: number;
  courseEvidenceScore?: number;
  assessmentScore?: number;
  projectEvidenceScore?: number;
  lastEvaluatedAt: string;
  decayFactor: number;
  evidenceCount: number;
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  category: string;
  difficulty: Difficulty;
  currentLevel: number;
  requiredLevel: number;
  gapMagnitude: number; // requiredLevel - currentLevel
  importance: number;
  prerequisites: string[];
  missingPrerequisites: string[];
  estimatedHours: number;
  priorityScore: number; // Computed priority
  criticalPath: boolean;
}

export interface LearnerDigitalTwin {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  targetDeadlineWeeks: number;
  availableHoursPerWeek: number;
  learningStrategy: Strategy;
  preferredFormats: string[];
  learningVelocity: number; // 1.0 = nominal
  consistencyScore: number; // 0 - 1.0
  skills: Record<string, SkillMasteryState>;
  completedResources: string[];
  completedAssessments: string[];
  completedProjects: string[];
  goalProgress: number; // 0 - 100%
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationScore {
  totalScore: number;
  factors: {
    goalRelevance: number;
    skillGapRelevance: number;
    prerequisiteFit: number;
    difficultyFit: number;
    learnerPreference: number;
    resourceQuality: number;
    deadlineFit: number;
    historicalFeedback: number;
  };
  reasons: {
    whyThis: string;
    whyNow: string;
    whyNotAlternative?: string;
  };
}

export interface LearningStep {
  id: string;
  skillId: string;
  skillName: string;
  category: string;
  stepType: "RESOURCE" | "PROJECT" | "ASSESSMENT" | "MILESTONE";
  weekNumber: number;
  orderIndex: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  status: StepStatus;
  resourceId?: string;
  projectId?: string;
  assessmentId?: string;
  resourceDetails?: {
    provider: string;
    url: string;
    type: string;
    format: string;
    durationMinutes: number;
    qualityScore: number;
    cost: string;
  };
  projectDetails?: {
    difficulty: string;
    scenario: string;
    starterTemplateUrl?: string;
  };
  assessmentDetails?: {
    difficulty: string;
    passingScore: number;
    timeLimitMinutes: number;
    questionCount: number;
  };
  scoreBreakdown: RecommendationScore;
  completedAt?: string;
}

export interface RoadmapPlan {
  id: string;
  profileId: string;
  title: string;
  targetRole: string;
  strategy: Strategy;
  totalWeeks: number;
  estimatedTotalHours: number;
  weeklySchedule: {
    weekNumber: number;
    theme: string;
    targetHours: number;
    steps: LearningStep[];
    milestone?: string;
  }[];
  adaptationLogs: {
    timestamp: string;
    trigger: string;
    explanation: string;
    changesMade: string[];
  }[];
}

export interface NextBestAction {
  stepId: string;
  type: "RESOURCE" | "ASSESSMENT" | "PROJECT";
  title: string;
  skillName: string;
  estimatedMinutes: number;
  primaryReason: string;
  roiExplanation: string;
  urgencyLevel: "HIGH" | "MEDIUM" | "LOW";
  actionUrl: string;
}

export interface SimulationResult {
  simulatedWeeks: number;
  simulatedTotalHours: number;
  weeklyBurnRate: number;
  completionDate: string;
  feasibilityScore: number; // 0 - 100%
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "UNREALISTIC";
  riskAnalysis: string[];
  skillCoverageDifference: number; // percentage change in mastered skills
  timelineDeltaWeeks: number;
  scheduleDiff: {
    weekNumber: number;
    originalFocus: string;
    simulatedFocus: string;
    status: "ACCELERATED" | "UNCHANGED" | "DELAYED" | "REMOVED";
  }[];
}
