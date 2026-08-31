import { NextResponse } from "next/server";
import { AppStoreService } from "@/services/state/appStore";

export async function GET() {
  const { roadmap, twin } = AppStoreService.getState();
  return NextResponse.json({ roadmap, twin });
}

export async function PATCH(req: Request) {
  try {
    const { stepId, newStatus } = await req.json();
    const { roadmap } = AppStoreService.getState();

    let stepFound = false;
    const updatedSchedule = roadmap.weeklySchedule.map(w => ({
      ...w,
      steps: w.steps.map(s => {
        if (s.id === stepId) {
          stepFound = true;
          return {
            ...s,
            status: newStatus,
            completedAt: (newStatus === "COMPLETED" || newStatus === "MASTERED") ? new Date().toISOString() : undefined,
          };
        }
        return s;
      }),
    }));

    if (stepFound) {
      const updatedRoadmap = {
        ...roadmap,
        weeklySchedule: updatedSchedule,
      };
      AppStoreService.updateRoadmap(updatedRoadmap);
      return NextResponse.json({ success: true, roadmap: updatedRoadmap });
    }

    return NextResponse.json({ error: "Step not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update step" }, { status: 500 });
  }
}
