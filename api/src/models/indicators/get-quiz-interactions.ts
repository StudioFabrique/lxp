import { prisma } from "../../utils/db.ts";
import { emptyIndicator, toDayKey, type Indicator, type IndicatorContext } from "./types.ts";

export const QUIZ_INTERACTIONS_KEY = "quiz_interactions";

/**
 * Nombre de quiz lancés par l'apprenant sur la période.
 *
 * `meta.selfTest` isole le quiz formatif « Je veux me tester », déclenché
 * volontairement : c'est le signal d'engagement, à distinguer des quiz de fin
 * de cours qui sont, eux, imposés par le parcours.
 */
export default async function getQuizInteractions(
  context: IndicatorContext,
): Promise<Indicator<number>> {
  if (context.studentId === null) {
    return emptyIndicator(QUIZ_INTERACTIONS_KEY, "Quiz lancés", "count", {
      reason: "Cet utilisateur n'est pas un apprenant.",
    });
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      studentId: context.studentId,
      startedAt: { gte: context.from, lte: context.to },
    },
    select: { origin: true, startedAt: true, finishedAt: true },
    orderBy: { startedAt: "asc" },
  });

  const perDay = new Map<string, number>();
  for (const attempt of attempts) {
    const key = toDayKey(attempt.startedAt);
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }

  const byOrigin = attempts.reduce<Record<string, number>>((acc, attempt) => {
    acc[attempt.origin] = (acc[attempt.origin] ?? 0) + 1;
    return acc;
  }, {});

  return {
    key: QUIZ_INTERACTIONS_KEY,
    label: "Quiz lancés",
    value: attempts.length,
    unit: "count",
    available: true,
    series: [...perDay.entries()].map(([date, value]) => ({ date, value })),
    meta: {
      selfTest: byOrigin.self_test ?? 0,
      byOrigin,
      completed: attempts.filter((attempt) => attempt.finishedAt !== null).length,
    },
  };
}
