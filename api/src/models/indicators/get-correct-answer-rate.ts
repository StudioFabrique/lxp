import { prisma } from "../../utils/db.ts";
import { emptyIndicator, type Indicator, type IndicatorContext } from "./types.ts";

export const CORRECT_ANSWER_RATE_KEY = "correct_answer_rate";

/**
 * Taux global de bonnes réponses aux quiz, en pourcentage.
 *
 * Calculé sur les réponses individuelles plutôt qu'en moyennant les scores des
 * tentatives : sinon un quiz d'une seule question pèserait autant qu'un quiz
 * de vingt. `isCorrect` est toujours issu de la correction serveur.
 */
export default async function getCorrectAnswerRate(
  context: IndicatorContext,
): Promise<Indicator<number>> {
  if (context.studentId === null) {
    return emptyIndicator(
      CORRECT_ANSWER_RATE_KEY,
      "Taux de bonnes réponses",
      "percent",
      { reason: "Cet utilisateur n'est pas un apprenant." },
    );
  }

  const answers = await prisma.quizAnswer.findMany({
    where: {
      attempt: {
        studentId: context.studentId,
        startedAt: { gte: context.from, lte: context.to },
      },
    },
    select: { isCorrect: true },
  });

  if (answers.length === 0) {
    return emptyIndicator(
      CORRECT_ANSWER_RATE_KEY,
      "Taux de bonnes réponses",
      "percent",
      { reason: "Aucune réponse enregistrée sur la période." },
    );
  }

  const correct = answers.filter((answer) => answer.isCorrect).length;

  return {
    key: CORRECT_ANSWER_RATE_KEY,
    label: "Taux de bonnes réponses",
    value: Math.round((correct / answers.length) * 100),
    unit: "percent",
    available: true,
    meta: { correctAnswers: correct, totalAnswers: answers.length },
  };
}
