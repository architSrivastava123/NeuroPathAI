import { LearnerDigitalTwin, RoadmapPlan, SimulationResult, Strategy } from "@/types";
import { PathOptimizerService } from "../roadmap/pathOptimizerService";

export class WhatIfSimulatorService {
  /**
   * Simulates an alternative learning plan based on adjusted parameters without modifying active user state.
   */
  static simulate(
    currentRoadmap: RoadmapPlan,
    twin: LearnerDigitalTwin,
    params: {
      simulatedWeeklyHours?: number;
      simulatedDeadlineWeeks?: number;
      simulatedStrategy?: Strategy;
      skillsToSkip?: string[];
      skillsToPrioritize?: string[];
    }
  ): SimulationResult {
    const weeklyHours = params.simulatedWeeklyHours || twin.availableHoursPerWeek;
    const deadlineWeeks = params.simulatedDeadlineWeeks || twin.targetDeadlineWeeks;
    const strategy = params.simulatedStrategy || twin.learningStrategy;

    // Create a cloned virtual twin for the simulation
    const virtualTwin: LearnerDigitalTwin = {
      ...twin,
      availableHoursPerWeek: weeklyHours,
      targetDeadlineWeeks: deadlineWeeks,
      learningStrategy: strategy,
      skills: { ...twin.skills },
    };

    // If skipping skills, virtually mark them as completed
    if (params.skillsToSkip) {
      for (const skippedId of params.skillsToSkip) {
        if (virtualTwin.skills[skippedId]) {
          virtualTwin.skills[skippedId] = {
            ...virtualTwin.skills[skippedId],
            estimatedLevel: 75,
            status: "COMPLETED",
          };
        }
      }
    }

    const simulatedPlan = PathOptimizerService.generateRoadmap(virtualTwin);
    const totalRequiredHours = simulatedPlan.estimatedTotalHours;
    const simulatedWeeks = Math.max(1, Math.ceil(totalRequiredHours / (weeklyHours || 1)));

    // Risk Analysis
    const riskAnalysis: string[] = [];
    let feasibilityScore = 90;
    let riskLevel: "LOW" | "MODERATE" | "HIGH" | "UNREALISTIC" = "LOW";

    if (weeklyHours > 25) {
      riskAnalysis.push("High weekly workload (>25 hrs/wk) significantly increases cognitive fatigue and drop-off risk.");
      feasibilityScore -= 25;
    }

    if (simulatedWeeks > deadlineWeeks) {
      const gap = simulatedWeeks - deadlineWeeks;
      riskAnalysis.push(`Projected completion (${simulatedWeeks} wks) exceeds your target deadline (${deadlineWeeks} wks) by ${gap} weeks.`);
      feasibilityScore -= 30;
    }

    if (params.skillsToSkip && params.skillsToSkip.length > 0) {
      riskAnalysis.push(`Skipping foundational skills (${params.skillsToSkip.join(", ")}) may cause comprehension bottlenecks in downstream production modules.`);
      feasibilityScore -= 15 * params.skillsToSkip.length;
    }

    if (strategy === "FAST_TRACK") {
      riskAnalysis.push("Fast-track strategy minimizes hands-on project milestones to maximize velocity.");
    } else if (strategy === "DEEP_MASTERY") {
      riskAnalysis.push("Deep mastery mode allocates extra study hours to low-level systems and theoretical proofs.");
    }

    if (feasibilityScore < 40) riskLevel = "UNREALISTIC";
    else if (feasibilityScore < 65) riskLevel = "HIGH";
    else if (feasibilityScore < 85) riskLevel = "MODERATE";
    else riskLevel = "LOW";

    feasibilityScore = Math.max(10, Math.min(99, feasibilityScore));

    // Calculate completion date
    const compDate = new Date();
    compDate.setDate(compDate.getDate() + simulatedWeeks * 7);

    // Schedule Diff mapping
    const maxWeeks = Math.max(currentRoadmap.weeklySchedule.length, simulatedPlan.weeklySchedule.length);
    const scheduleDiff = [];

    for (let w = 1; w <= Math.min(12, maxWeeks); w++) {
      const orig = currentRoadmap.weeklySchedule.find(s => s.weekNumber === w);
      const sim = simulatedPlan.weeklySchedule.find(s => s.weekNumber === w);

      let status: "ACCELERATED" | "UNCHANGED" | "DELAYED" | "REMOVED" = "UNCHANGED";
      if (!orig && sim) status = "DELAYED";
      else if (orig && !sim) status = "ACCELERATED";
      else if (orig?.theme !== sim?.theme) status = "ACCELERATED";

      scheduleDiff.push({
        weekNumber: w,
        originalFocus: orig?.theme || "Graduation / Capstone",
        simulatedFocus: sim?.theme || "Graduation / Capstone",
        status,
      });
    }

    return {
      simulatedWeeks,
      simulatedTotalHours: totalRequiredHours,
      weeklyBurnRate: weeklyHours,
      completionDate: compDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      feasibilityScore,
      riskLevel,
      riskAnalysis: riskAnalysis.length > 0 ? riskAnalysis : ["Balanced plan with high probability of on-time mastery."],
      skillCoverageDifference: params.skillsToSkip ? -(params.skillsToSkip.length * 8) : 0,
      timelineDeltaWeeks: simulatedWeeks - currentRoadmap.totalWeeks,
      scheduleDiff,
    };
  }
}
