import { prisma } from "../../utils/db.ts";
import { quizRepository } from "./quiz-repository.ts";
import { toQuizApiQuestion } from "../../services/quiz/quiz-question.ts";

/** Retrouve la dernière passation du diagnostic, limitée à l'apprenant connecté. */
export default async function getPreliminaryQuizProgress(moduleId: number, userIdMdb: string) {
  const student = await quizRepository.findStudentByMongoId(userIdMdb);
  if (!student) return null;

  const quiz = await quizRepository.findPreliminaryQuiz(moduleId);
  if (!quiz) return null;

  const attempt = await prisma.orm.public.QuizAttempt.where({
    quizId: quiz.id,
    studentId: student.id,
    origin: "preliminary",
  })
    .select("id", "finishedAt")
    .orderBy((row) => row.id.desc())
    .first();
  if (!attempt) return null;

  const answers = await prisma.orm.public.QuizAnswer.where({ attemptId: attempt.id })
    .select("quizQuestionId", "isCorrect", "userAnswer")
    .all();
  const externalIds = new Map(quiz.questions.map((question) => [question.id, question.externalId]));

  return {
    attemptId: attempt.id,
    finished: attempt.finishedAt !== null,
    questions: [...quiz.questions]
      .sort((a, b) => a.id - b.id)
      .map(toQuizApiQuestion),
    answers: answers.flatMap((answer) => {
      const externalId = externalIds.get(answer.quizQuestionId);
      return externalId
        ? [{ externalId, isCorrect: answer.isCorrect, userAnswer: answer.userAnswer }]
        : [];
    }),
  };
}
