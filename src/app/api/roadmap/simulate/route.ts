import { NextResponse } from "next/server";
import { AppStoreService } from "@/services/state/appStore";
import { WhatIfSimulatorService } from "@/services/simulator/whatIfSimulatorService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { simulatedWeeklyHours, simulatedDeadlineWeeks, simulatedStrategy, skillsToSkip } = body;

    const { roadmap, twin } = AppStoreService.getState();

    const simulationResult = WhatIfSimulatorService.simulate(roadmap, twin, {
      simulatedWeeklyHours: Number(simulatedWeeklyHours) || twin.availableHoursPerWeek,
      simulatedDeadlineWeeks: Number(simulatedDeadlineWeeks) || twin.targetDeadlineWeeks,
      simulatedStrategy,
      skillsToSkip,
    });

    return NextResponse.json({
      success: true,
      simulationResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Simulation failed" }, { status: 500 });
  }
}
