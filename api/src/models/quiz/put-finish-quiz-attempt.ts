import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

/**
 * Clôt une passation et fige ses totaux.
 *
 * Les compteurs sont recalculés depuis `QuizAnswer` plutôt que repris du
 * client : c'est la seule façon qu'ils restent cohérents avec le détail.
 * Idempotent — une tentative déjà close conserve son `finishedAt`.
 */
export default async function putFinishQuizAttempt(
  attemptId: number,
  userIdMdb: string,
) {
  const attempt = await prisma.orm.public.QuizAttempt.where((row) =>
    whereFromObject(row, { id: attemptId }),
  )
    .select("id", "finishedAt")
    .include("student", (related25) => related25.select("idMdb"))
    .first();

  if (!attempt) return null;

  if (attempt.student!.idMdb !== userIdMdb) {
    throw {
      message: "Cette tentative ne vous appartient pas.",
      statusCode: 403,
    };
  }

  const answers = await prisma.orm.public.QuizAnswer.where((row) =>
    whereFromObject(row, { attemptId }),
  )
    .select("isCorrect")
    .all();

  return prisma.orm.public.QuizAttempt.where((row) =>
    whereFromObject(row, { id: attemptId }),
  )
    .select("id", "finishedAt", "totalQuestions", "correctAnswers")
    .update({
      finishedAt: attempt.finishedAt ?? new Date().toISOString(),
      totalQuestions: answers.length,
      correctAnswers: answers.filter((answer) => answer.isCorrect).length,
    })
    .then(requireDatabaseRow);
}
