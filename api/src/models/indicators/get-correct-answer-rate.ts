import { prisma } from "../../utils/db.ts";
import { emptyIndicator, type Indicator, type IndicatorContext } from "./types.ts";

export const CORRECT_ANSWER_RATE_KEY = "correct_answer_rate";

/**
 * Taux global de réussite aux évaluations, en pourcentage.
 *
 * Les quiz sont pondérés question par question et les devoirs par leur barème :
 * une évaluation courte ne pèse ainsi pas autant qu'une évaluation longue.
 */
export default async function getCorrectAnswerRate(
  context: IndicatorContext,
): Promise<Indicator<number>> {
  if (context.studentId === null) {
    return emptyIndicator(
      CORRECT_ANSWER_RATE_KEY,
      "Taux de réussite des évaluations",
      "percent",
      { reason: "Cet utilisateur n'est pas un apprenant." },
    );
  }

  const [answers, submissions] = await Promise.all([
    prisma.quizAnswer.findMany({
      where: {
        attempt: {
          studentId: context.studentId,
          startedAt: { gte: context.from, lte: context.to },
        },
      },
      select: { isCorrect: true },
    }),
    prisma.assignmentSubmission.findMany({
      where: {
        studentId: context.studentId,
        gradedAt: { gte: context.from, lte: context.to },
        grade: { not: null },
      },
      select: { grade: true, assignment: { select: { maxScore: true } } },
    }),
  ]);

  const earnedPoints =
    answers.filter((answer) => answer.isCorrect).length +
    submissions.reduce((sum, submission) => sum + submission.grade!, 0);
  const possiblePoints =
    answers.length +
    submissions.reduce(
      (sum, submission) => sum + submission.assignment.maxScore,
      0,
    );

  if (possiblePoints === 0) {
    return emptyIndicator(
      CORRECT_ANSWER_RATE_KEY,
      "Taux de réussite des évaluations",
      "percent",
      { reason: "Aucune évaluation notée sur la période." },
    );
  }

  return {
    key: CORRECT_ANSWER_RATE_KEY,
    label: "Taux de réussite des évaluations",
    value: Math.round((earnedPoints / possiblePoints) * 100),
    unit: "percent",
    available: true,
    meta: {
      earnedPoints,
      possiblePoints,
      quizAnswers: answers.length,
      gradedAssignments: submissions.length,
    },
  };
}
