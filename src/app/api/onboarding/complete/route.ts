import { NextResponse } from "next/server";
import { AppStoreService } from "@/services/state/appStore";
import { LearnerTwinService } from "@/services/learner/learnerTwinService";
import { PathOptimizerService } from "@/services/roadmap/pathOptimizerService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, targetRole, availableHoursPerWeek, targetDeadlineWeeks, strategy, claimedSkills } = body;

    const newTwin = LearnerTwinService.createInitialTwin({
      id: `learner-${Date.now()}`,
      name: name || "Alex Rivers",
      email: email || "alex.rivers@example.com",
      targetRole: targetRole || "Production AI / LLM Engineer",
      targetDeadlineWeeks: Number(targetDeadlineWeeks) || 24,
      availableHoursPerWeek: Number(availableHoursPerWeek) || 10,
      strategy: strategy || "BALANCED",
      claimedSkills: claimedSkills || [
        { skillId: "python-core", level: 80 },
        { skillId: "git-version-control", level: 75 },
        { skillId: "sql-databases", level: 60 },
        { skillId: "numpy-pandas-data", level: 65 },
        { skillId: "classical-ml", level: 50 },
      ],
    });

    const newRoadmap = PathOptimizerService.generateRoadmap(newTwin);

    AppStoreService.updateTwin(newTwin);
    AppStoreService.updateRoadmap(newRoadmap);

    return NextResponse.json({
      success: true,
      twin: newTwin,
      roadmap: newRoadmap,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to initialize profile" }, { status: 500 });
  }
}
