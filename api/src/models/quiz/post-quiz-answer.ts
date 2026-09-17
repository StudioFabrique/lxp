import { and } from "@prisma/orm-postgres/orm-client";

import { prisma } from "../../utils/db.ts";
import type { Models } from "../../prisma/contract.d.ts";
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
  const attempt = await prisma.orm.public.QuizAttempt.where({ id: attemptId })
    .select("id", "quizId")
    .include("student", (related24) => related24.select("idMdb"))
    .first();

  if (!attempt) return null;

  if (attempt.student!.idMdb !== userIdMdb) {
    throw {
      message: "Cette tentative ne vous appartient pas.",
      statusCode: 403,
    };
  }

  const question = await prisma.orm.public.QuizQuestion.where({
    quizId: attempt.quizId,
    externalId,
  })
    .select("id", "type", "data")
    .first();

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

  const answerData = userAnswer as Models.public_QuizAnswer["userAnswer"];
  return prisma.orm.public.QuizAnswer.where((row) =>
    and(row.attemptId.eq(attemptId), row.quizQuestionId.eq(question.id)),
  )
    .select("id", "isCorrect")
    .upsert({
      create: {
        attemptId,
        quizQuestionId: question.id,
        isCorrect,
        userAnswer: answerData,
      },
      update: {
        isCorrect,
        userAnswer: answerData,
        answeredAt: new Date().toISOString(),
      },
      conflictOn: { attemptId, quizQuestionId: question.id },
    });
}
