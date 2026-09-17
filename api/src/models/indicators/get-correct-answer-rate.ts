import { and } from "@prisma/orm-postgres/orm-client";

import { prisma } from "../../utils/db.ts";
import {
  emptyIndicator,
  type Indicator,
  type IndicatorContext,
} from "./types.ts";

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
  const studentId = context.studentId;
  const from = context.from.toISOString();
  const to = context.to.toISOString();

  const [answers, submissions] = await Promise.all([
    prisma.orm.public.QuizAnswer.where((row) =>
      row.attempt.some((attempt) =>
        and(
          attempt.studentId.eq(studentId),
          attempt.finishedAt.gte(from),
          attempt.finishedAt.lte(to),
        ),
      ),
    )
      .select("isCorrect")
      .all(),
    prisma.orm.public.AssignmentSubmission.where((row) =>
      and(
        row.studentId.eq(studentId),
        row.gradedAt.gte(from),
        row.gradedAt.lte(to),
        row.grade.isNotNull(),
      ),
    )
      .select("grade")
      .include("assignment", (related91) => related91.select("maxScore"))
      .all(),
  ]);

  const earnedPoints =
    answers.filter((answer) => answer.isCorrect).length +
    submissions.reduce((sum, submission) => sum + submission.grade!, 0);
  const possiblePoints =
    answers.length +
    submissions.reduce(
      (sum, submission) => sum + submission.assignment!.maxScore,
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
