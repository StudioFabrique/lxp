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
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    select: {
      id: true,
      finishedAt: true,
      student: { select: { idMdb: true } },
    },
  });

  if (!attempt) return null;

  if (attempt.student.idMdb !== userIdMdb) {
    throw { message: "Cette tentative ne vous appartient pas.", statusCode: 403 };
  }

  const answers = await prisma.quizAnswer.findMany({
    where: { attemptId },
    select: { isCorrect: true },
  });

  return prisma.quizAttempt.update({
    where: { id: attemptId },
    data: {
      finishedAt: attempt.finishedAt ?? new Date(),
      totalQuestions: answers.length,
      correctAnswers: answers.filter((answer) => answer.isCorrect).length,
    },
    select: {
      id: true,
      finishedAt: true,
      totalQuestions: true,
      correctAnswers: true,
    },
  });
}
