import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import {
  emptyIndicator,
  toDayKey,
  type Indicator,
  type IndicatorContext,
} from "./types.ts";

export const CORRECT_ANSWER_RATE_EVOLUTION_KEY =
  "correct_answer_rate_evolution";

/** Écart en points en deçà duquel on considère le niveau stable. */
const STABLE_THRESHOLD_POINTS = 5;

/**
 * Évolution du taux de bonnes réponses : progression ou régression.
 *
 * La période est coupée en deux moitiés d'égal nombre de tentatives et on
 * compare les taux obtenus de part et d'autre. Comparer la première et la
 * dernière tentative serait beaucoup trop sensible à un quiz raté.
 *
 * La valeur est un écart en points de pourcentage : positif, l'apprenant
 * progresse.
 */
export default async function getCorrectAnswerRateEvolution(
  context: IndicatorContext,
): Promise<Indicator<number>> {
  const label = "Évolution des résultats";

  if (context.studentId === null) {
    return emptyIndicator(CORRECT_ANSWER_RATE_EVOLUTION_KEY, label, "trend", {
      reason: "Cet utilisateur n'est pas un apprenant.",
    });
  }

  const [attempts, submissions] = await Promise.all([
    prisma.orm.public.QuizAttempt.where((row) =>
      whereFromObject(row, {
        studentId: context.studentId,
        finishedAt: { gte: context.from, lte: context.to },
        answers: { some: {} },
      }),
    )
      .select("finishedAt")
      .include("answers", (related89) => related89.select("isCorrect"))
      .all(),
    prisma.orm.public.AssignmentSubmission.where((row) =>
      whereFromObject(row, {
        studentId: context.studentId,
        gradedAt: { gte: context.from, lte: context.to },
        grade: { not: null },
      }),
    )
      .select("gradedAt", "grade")
      .include("assignment", (related90) => related90.select("maxScore"))
      .all(),
  ]);

  const rates = [
    ...attempts.map((attempt) => ({
      at: attempt.finishedAt!,
      date: toDayKey(attempt.finishedAt!),
      value: Math.round(
        (attempt.answers.filter((answer) => answer.isCorrect).length /
          attempt.answers.length) *
          100,
      ),
    })),
    ...submissions.map((submission) => ({
      at: submission.gradedAt!,
      date: toDayKey(submission.gradedAt!),
      value: Math.round(
        (submission.grade! / submission.assignment!.maxScore) * 100,
      ),
    })),
  ]
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
    .map(({ date, value }) => ({ date, value }));

  if (rates.length < 2) {
    return emptyIndicator(CORRECT_ANSWER_RATE_EVOLUTION_KEY, label, "trend", {
      reason:
        "Au moins deux évaluations notées sont nécessaires pour dégager une tendance.",
      attemptCount: rates.length,
    });
  }

  const midpoint = Math.floor(rates.length / 2);
  const average = (values: typeof rates) =>
    values.reduce((sum, point) => sum + point.value, 0) / values.length;

  const firstHalf = average(rates.slice(0, midpoint));
  const secondHalf = average(rates.slice(midpoint));
  const delta = Math.round(secondHalf - firstHalf);

  const trend =
    Math.abs(delta) < STABLE_THRESHOLD_POINTS
      ? "stable"
      : delta > 0
        ? "progression"
        : "regression";

  return {
    key: CORRECT_ANSWER_RATE_EVOLUTION_KEY,
    label,
    value: delta,
    unit: "trend",
    available: true,
    series: rates,
    meta: {
      trend,
      firstHalfPercent: Math.round(firstHalf),
      secondHalfPercent: Math.round(secondHalf),
      attemptCount: rates.length,
    },
  };
}
