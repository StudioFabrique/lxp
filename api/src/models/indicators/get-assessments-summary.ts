import { whereFromObject } from "../../utils/prisma-query.ts";
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

export type AssessmentRecord = {
  at: Date;
  rate: number | null;
  weight?: number;
};

/** Pente pondérée des notes normalisées, par jour, sur tout l'historique connu. */
export function scoreEvolution(
  records: readonly AssessmentRecord[],
): number | null {
  const graded = records.filter(
    (r) => r.rate !== null && Number.isFinite(r.rate),
  );
  if (graded.length < 2) return null;
  const origin = graded[0]!.at.getTime();
  const points = graded.map((r) => ({
    x: (r.at.getTime() - origin) / 86_400_000,
    y: r.rate! / 100,
    w: r.weight && r.weight > 0 ? r.weight : 1,
  }));
  const sw = points.reduce((s, p) => s + p.w, 0);
  const mx = points.reduce((s, p) => s + p.w * p.x, 0) / sw;
  const my = points.reduce((s, p) => s + p.w * p.y, 0) / sw;
  const denominator = points.reduce((s, p) => s + p.w * (p.x - mx) ** 2, 0);
  if (denominator === 0) return null;
  return Number(
    (
      points.reduce((s, p) => s + p.w * (p.x - mx) * (p.y - my), 0) /
      denominator
    ).toFixed(6),
  );
}

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
    scoreEvolution: scoreEvolution(records),
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
    prisma.orm.public.QuizAttempt.where((row) =>
      whereFromObject(row, {
        studentId: context.studentId,
        finishedAt: { not: null, lte: context.to },
      }),
    )
      .select("finishedAt", "totalQuestions", "correctAnswers")
      .all(),
    prisma.orm.public.AssignmentSubmission.where((row) =>
      whereFromObject(row, {
        studentId: context.studentId,
        submittedAt: { not: null, lte: context.to },
      }),
    )
      .select("submittedAt", "grade", "gradedAt")
      .include("assignment", (related88) => related88.select("maxScore"))
      .all(),
  ]);

  const records: AssessmentRecord[] = [
    ...attempts.map((attempt) => ({
      at: new Date(attempt.finishedAt!),
      weight: 1,
      rate:
        attempt.totalQuestions > 0
          ? (attempt.correctAnswers / attempt.totalQuestions) * 100
          : null,
    })),
    ...submissions.map((submission) => ({
      at: new Date(submission.submittedAt!),
      weight: 1,
      rate:
        submission.grade === null ||
        submission.gradedAt === null ||
        Date.parse(submission.gradedAt) > context.to.getTime() ||
        submission.assignment!.maxScore <= 0
          ? null
          : (submission.grade / submission.assignment!.maxScore) * 100,
    })),
  ];

  return summarizeAssessments(records, context.from);
}
