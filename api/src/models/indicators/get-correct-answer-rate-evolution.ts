import { prisma } from "../../utils/db.ts";
import { emptyIndicator, toDayKey, type Indicator, type IndicatorContext } from "./types.ts";

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
  const label = "Évolution du taux de bonnes réponses";

  if (context.studentId === null) {
    return emptyIndicator(CORRECT_ANSWER_RATE_EVOLUTION_KEY, label, "trend", {
      reason: "Cet utilisateur n'est pas un apprenant.",
    });
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      studentId: context.studentId,
      startedAt: { gte: context.from, lte: context.to },
      answers: { some: {} },
    },
    select: {
      startedAt: true,
      answers: { select: { isCorrect: true } },
    },
    orderBy: { startedAt: "asc" },
  });

  const rates = attempts.map((attempt) => ({
    date: toDayKey(attempt.startedAt),
    value: Math.round(
      (attempt.answers.filter((answer) => answer.isCorrect).length /
        attempt.answers.length) *
        100,
    ),
  }));

  if (rates.length < 2) {
    return emptyIndicator(CORRECT_ANSWER_RATE_EVOLUTION_KEY, label, "trend", {
      reason: "Au moins deux quiz terminés sont nécessaires pour dégager une tendance.",
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
