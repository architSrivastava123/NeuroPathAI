import { NextResponse } from "next/server";
import { ASSESSMENT_CATALOG } from "@/data/seedCatalog";
import { AppStoreService } from "@/services/state/appStore";
import { LearnerTwinService } from "@/services/learner/learnerTwinService";
import { AdaptiveReplanningService } from "@/services/roadmap/adaptiveReplanningService";

export async function GET() {
  const { twin } = AppStoreService.getState();
  const assessments = ASSESSMENT_CATALOG.map(a => {
    const isCompleted = twin.completedAssessments.includes(a.targetSkillId);
    const score = twin.skills[a.targetSkillId]?.assessmentScore;
    return {
      ...a,
      isCompleted,
      latestScore: score,
    };
  });

  return NextResponse.json({ assessments });
}

export async function POST(req: Request) {
  try {
    const { assessmentId, answers } = await req.json();
    const assessment = ASSESSMENT_CATALOG.find(a => a.id === assessmentId);

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    // Score answers
    let correctCount = 0;
    const itemResults = assessment.questions.map(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correctCount / assessment.questions.length) * 100);
    const passed = score >= assessment.passingScore;

    // Apply mastery update to Digital Twin
    const { twin, roadmap } = AppStoreService.getState();
    const { updatedTwin, oldLevel, newLevel } = LearnerTwinService.applyAssessmentResult(
      twin,
      assessment.targetSkillId,
      score
    );

    AppStoreService.updateTwin(updatedTwin);

    // Trigger closed-loop replanning
    const adaptation = AdaptiveReplanningService.replan(roadmap, updatedTwin, {
      triggerType: "ASSESSMENT_COMPLETED",
      skillId: assessment.targetSkillId,
      scoreAchieved: score,
    });

    AppStoreService.updateRoadmap(adaptation.updatedRoadmap);

    return NextResponse.json({
      success: true,
      score,
      passed,
      oldLevel,
      newLevel,
      itemResults,
      adaptationExplanation: adaptation.explanation,
      changesSummary: adaptation.changesSummary,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit assessment" }, { status: 500 });
  }
}
