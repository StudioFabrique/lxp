import { prisma } from "../../utils/db";

export default async function deleteLesson(lessonId: number) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
  });

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }
  try {
    await prisma.lesson.delete({
      where: { id: lessonId },
    });
    return true;
  } catch (error: any) {
    const returnedError: any = {
      message:
        "La leçon n'a pas pu être supprimée. Une raison possible est qu'il existe des activités attachées à la leçon.",
      statusCode: 500,
    };
    throw returnedError;
  }
}
