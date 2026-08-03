import { prisma } from "../../utils/db.ts";

export default async function postReportQuizQuestion(
  externalId: string,
  comment: string,
) {
  const question = await prisma.quizQuestion.findFirst({
    where: { externalId },
  });

  if (!question) return null;

  return prisma.quizQuestionReport.create({
    data: { quizQuestionId: question.id, commentaire: comment },
  });
}
