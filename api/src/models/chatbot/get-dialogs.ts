import { prisma } from "../../utils/db";
import ChatDialogs from "../../utils/interfaces/db/chat-dialogs";

export default async function getDialogs(userId: string) {
  const dialogs = await ChatDialogs.find({ userId }).sort({ createdAt: 1 });

  const formattedDialogs: any[] = [];

  for await (const doc of dialogs) {
    formattedDialogs.push({
      origin: "user",
      message: doc.question.message,
      date: doc.question.date,
      textSelection: doc.textSelection || undefined,
    });

    const sources = doc.sources
      ? await Promise.all(
          doc.sources?.map(async (source) => {
            const lesson = await prisma.lesson.findFirst({
              select: {
                id: true,
                course: { select: { moduleId: true } },
              },
              where: { course: { courseSlug: source.course } },
            });

            return {
              activity: source.activity,
              course: source.course,
              heading_path: source.heading_path,
              score: source.score,
              section: source.section,
              moduleId: lesson?.course.moduleId,
              lessonId: lesson?.id,
            };
          }),
        )
      : [];

    formattedDialogs.push({
      origin: "bot",
      message: doc.answer.message,
      date: doc.answer.date,
      type: "normal",
      sources,
    });
  }

  return formattedDialogs;
}
