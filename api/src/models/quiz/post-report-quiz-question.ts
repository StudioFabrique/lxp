import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

export default async function postReportQuizQuestion(
  externalId: string,
  comment: string,
) {
  const question = await prisma.orm.public.QuizQuestion.where((row) =>
    whereFromObject(row, { externalId }),
  ).first();

  if (!question) return null;

  return prisma.orm.public.QuizQuestionReport.create({
    quizQuestionId: question.id,
    commentaire: comment,
  });
}
