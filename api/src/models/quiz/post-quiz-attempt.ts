import type { QuizAttemptOrigin } from "../../config/quiz-attempt.ts";
import { prisma } from "../../utils/db.ts";
import { quizRepository } from "./quiz-repository.ts";

export type QuizAttemptScope = {
  courseId?: number;
  moduleId?: number;
};

/**
 * Ouvre une passation de quiz pour un apprenant.
 *
 * Le client ne connaît pas l'identifiant Prisma du quiz : le flux de
 * génération lui relaie la charge utile de l'IA telle quelle. Il transmet donc
 * le cours ou le module, et le quiz est retrouvé ici.
 *
 * Les questions « random » n'entrent pas dans ce cadre : ce sont des questions
 * isolées, sans ligne `Quiz`, générées à la volée pendant la lecture. Elles ne
 * sont pas comptabilisées comme passation.
 *
 * Renvoie `null` si l'utilisateur n'est pas un apprenant ou si aucun quiz ne
 * correspond au périmètre demandé.
 */
export default async function postQuizAttempt(
  origin: QuizAttemptOrigin,
  scope: QuizAttemptScope,
  userIdMdb: string,
) {
  const student = await prisma.student.findUnique({
    where: { idMdb: userIdMdb },
  });

  if (!student) return null;

  const quiz =
    origin === "preliminary"
      ? scope.moduleId
        ? await quizRepository.findPreliminaryQuiz(scope.moduleId)
        : null
      : scope.courseId
        ? await quizRepository.findEndingQuiz(scope.courseId, student.id)
        : null;

  if (!quiz) return null;

  return prisma.quizAttempt.create({
    data: { quizId: quiz.id, studentId: student.id, origin },
    select: { id: true, quizId: true, origin: true, startedAt: true },
  });
}
