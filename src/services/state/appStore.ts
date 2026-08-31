import { LearnerDigitalTwin, RoadmapPlan, NextBestAction } from "@/types";
import { LearnerTwinService } from "../learner/learnerTwinService";
import { PathOptimizerService } from "../roadmap/pathOptimizerService";

export interface AppState {
  twin: LearnerDigitalTwin;
  roadmap: RoadmapPlan;
  nextBestAction: NextBestAction;
}

// Initialized global state for development / SSR
let globalTwin: LearnerDigitalTwin = LearnerTwinService.createInitialTwin({
  id: "learner-demo-1",
  name: "Alex Rivers",
  email: "alex.rivers@example.com",
  targetRole: "Production AI / LLM Engineer",
  targetDeadlineWeeks: 24,
  availableHoursPerWeek: 10,
  strategy: "BALANCED",
  claimedSkills: [
    { skillId: "python-core", level: 80 },
    { skillId: "git-version-control", level: 75 },
    { skillId: "sql-databases", level: 60 },
    { skillId: "numpy-pandas-data", level: 65 },
    { skillId: "classical-ml", level: 50 },
  ],
});

let globalRoadmap: RoadmapPlan = PathOptimizerService.generateRoadmap(globalTwin);
let globalNextBestAction: NextBestAction = PathOptimizerService.determineNextBestAction(globalRoadmap, globalTwin);

export class AppStoreService {
  static getState(): AppState {
    return {
      twin: globalTwin,
      roadmap: globalRoadmap,
      nextBestAction: globalNextBestAction,
    };
  }

  static updateTwin(newTwin: LearnerDigitalTwin) {
    globalTwin = newTwin;
    globalNextBestAction = PathOptimizerService.determineNextBestAction(globalRoadmap, globalTwin);
  }

  static updateRoadmap(newRoadmap: RoadmapPlan) {
    globalRoadmap = newRoadmap;
    globalNextBestAction = PathOptimizerService.determineNextBestAction(globalRoadmap, globalTwin);
  }

  static resetToDemo() {
    globalTwin = LearnerTwinService.createInitialTwin({
      id: "learner-demo-1",
      name: "Alex Rivers",
      email: "alex.rivers@example.com",
      targetRole: "Production AI / LLM Engineer",
      targetDeadlineWeeks: 24,
      availableHoursPerWeek: 10,
      strategy: "BALANCED",
      claimedSkills: [
        { skillId: "python-core", level: 80 },
        { skillId: "git-version-control", level: 75 },
        { skillId: "sql-databases", level: 60 },
        { skillId: "numpy-pandas-data", level: 65 },
        { skillId: "classical-ml", level: 50 },
      ],
    });
    globalRoadmap = PathOptimizerService.generateRoadmap(globalTwin);
    globalNextBestAction = PathOptimizerService.determineNextBestAction(globalRoadmap, globalTwin);
  }
}
