import { prisma } from "../../utils/db.ts";
import {
  gradeAnswer,
  UngradableAnswerError,
} from "../../services/quiz/grade-answer.ts";

/**
 * Enregistre la réponse d'un apprenant à une question de quiz.
 *
 * La question est désignée par son `externalId`, seul identifiant que le
 * client connaisse : le flux de génération lui relaie la charge utile de l'IA
 * sans y injecter les identifiants Prisma. La résolution se fait dans le
 * périmètre du quiz de la tentative, où cet identifiant est unique.
 *
 * `isCorrect` est corrigé ici et n'est jamais accepté depuis le client.
 * Rejouer la même question dans une même tentative écrase la réponse
 * précédente : sinon le taux de bonnes réponses serait gonflé par les
 * doublons.
 */
export default async function postQuizAnswer(
  attemptId: number,
  externalId: string,
  userAnswer: unknown,
  userIdMdb: string,
) {
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    select: { id: true, quizId: true, student: { select: { idMdb: true } } },
  });

  if (!attempt) return null;

  if (attempt.student.idMdb !== userIdMdb) {
    throw {
      message: "Cette tentative ne vous appartient pas.",
      statusCode: 403,
    };
  }

  const question = await prisma.quizQuestion.findFirst({
    where: { quizId: attempt.quizId, externalId },
    select: { id: true, type: true, data: true },
  });

  if (!question) return null;

  let isCorrect: boolean;
  try {
    isCorrect = gradeAnswer(question.type, question.data, userAnswer);
  } catch (error) {
    if (error instanceof UngradableAnswerError) {
      throw { message: error.message, statusCode: error.statusCode };
    }
    throw error;
  }

  return prisma.quizAnswer.upsert({
    where: {
      attemptId_quizQuestionId: { attemptId, quizQuestionId: question.id },
    },
    create: {
      attemptId,
      quizQuestionId: question.id,
      isCorrect,
      userAnswer: userAnswer as object,
    },
    update: {
      isCorrect,
      userAnswer: userAnswer as object,
      answeredAt: new Date(),
    },
    select: { id: true, isCorrect: true },
  });
}
