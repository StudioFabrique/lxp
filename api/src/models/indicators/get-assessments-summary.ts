import { prisma } from "../../utils/db.ts";
import type { AssessmentsSummary } from "./model-features.ts";
import type { IndicatorContext } from "./types.ts";

/**
 * Seuil de réussite d'une tentative de quiz, en pourcentage de bonnes réponses.
 *
 * Reprend la convention du modèle IA, entraîné sur OULAD où une note inférieure
 * à 40 est un échec. Choisir un autre seuil ici décalerait le `pass_rate`
 * envoyé par rapport à la distribution sur laquelle le modèle a appris.
 */
export const PASS_THRESHOLD_PERCENT = 40;

/**
 * Volumétrie des quiz d'un apprenant, telle que l'attend le modèle IA.
 *
 * Ces trois variables n'ont pas d'indicateur d'affichage dédié : elles ne
 * servent qu'à la prédiction, d'où un calcul à l'écart du registre exposé par
 * `get-all-indicators`. Seules les tentatives terminées comptent — une
 * tentative ouverte puis abandonnée n'est pas une évaluation rendue.
 *
 * Renvoie `null` quand l'utilisateur n'est pas un apprenant.
 */
export default async function getAssessmentsSummary(
  context: IndicatorContext,
): Promise<AssessmentsSummary | null> {
  if (context.studentId === null) return null;

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      studentId: context.studentId,
      finishedAt: { not: null },
      startedAt: { lte: context.to },
    },
    select: { startedAt: true, totalQuestions: true, correctAnswers: true },
  });

  const graded = attempts.filter((attempt) => attempt.totalQuestions > 0);
  const passed = graded.filter(
    (attempt) =>
      (attempt.correctAnswers / attempt.totalQuestions) * 100 >=
      PASS_THRESHOLD_PERCENT,
  );

  return {
    periodCount: attempts.filter((attempt) => attempt.startedAt >= context.from)
      .length,
    cumulativeCount: attempts.length,
    // `null` et non `0` : sans tentative notée, le taux n'existe pas, alors
    // qu'un zéro décrirait un apprenant qui a tout raté.
    passRate:
      graded.length === 0
        ? null
        : Math.round((passed.length / graded.length) * 1000) / 1000,
  };
}
