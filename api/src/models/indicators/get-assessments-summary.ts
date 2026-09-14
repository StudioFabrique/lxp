import { prisma } from "../../utils/db.ts";
import type { AssessmentsSummary } from "./model-features.ts";
import type { IndicatorContext } from "./types.ts";

/**
 * Seuil de réussite d'une évaluation, en pourcentage du barème.
 *
 * Reprend la convention du modèle IA, entraîné sur OULAD où une note inférieure
 * à 40 est un échec. Choisir un autre seuil ici décalerait le `pass_rate`
 * envoyé par rapport à la distribution sur laquelle le modèle a appris.
 */
export const PASS_THRESHOLD_PERCENT = 40;

type AssessmentRecord = { at: Date; rate: number | null };

/** Agrégation pure partagée par les sources quiz et devoir. */
export function summarizeAssessments(
  records: readonly AssessmentRecord[],
  from: Date,
): AssessmentsSummary {
  const gradedRates = records.flatMap(({ rate }) =>
    rate === null ? [] : [rate],
  );
  const passed = gradedRates.filter((rate) => rate >= PASS_THRESHOLD_PERCENT);

  return {
    periodCount: records.filter(({ at }) => at >= from).length,
    cumulativeCount: records.length,
    passRate:
      gradedRates.length === 0
        ? null
        : Math.round((passed.length / gradedRates.length) * 1000) / 1000,
  };
}

/**
 * Volumétrie des évaluations d'un apprenant, telle que l'attend le modèle IA.
 *
 * Ces trois variables n'ont pas d'indicateur d'affichage dédié : elles ne
 * servent qu'à la prédiction, d'où un calcul à l'écart du registre exposé par
 * `get-all-indicators`. Seuls les quiz terminés et les devoirs effectivement
 * rendus comptent ; un brouillon n'est jamais une évaluation rendue.
 *
 * Renvoie `null` quand l'utilisateur n'est pas un apprenant.
 */
export default async function getAssessmentsSummary(
  context: IndicatorContext,
): Promise<AssessmentsSummary | null> {
  if (context.studentId === null) return null;

  const [attempts, submissions] = await Promise.all([
    prisma.quizAttempt.findMany({
      where: {
        studentId: context.studentId,
        finishedAt: { not: null },
        startedAt: { lte: context.to },
      },
      select: { startedAt: true, totalQuestions: true, correctAnswers: true },
    }),
    prisma.assignmentSubmission.findMany({
      where: {
        studentId: context.studentId,
        submittedAt: { not: null, lte: context.to },
      },
      select: {
        submittedAt: true,
        grade: true,
        assignment: { select: { maxScore: true } },
      },
    }),
  ]);

  const records: AssessmentRecord[] = [
    ...attempts
      .map((attempt) => ({
        at: attempt.startedAt,
        rate:
          attempt.totalQuestions > 0
            ? (attempt.correctAnswers / attempt.totalQuestions) * 100
            : null,
      })),
    ...submissions.map((submission) => ({
      at: submission.submittedAt!,
      rate:
        submission.grade === null
          ? null
          : (submission.grade / submission.assignment.maxScore) * 100,
    })),
  ];

  return summarizeAssessments(records, context.from);
}
