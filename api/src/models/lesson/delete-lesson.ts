import { prisma } from "../../utils/db";

export default async function deleteLesson(userId: string, lessonId: number) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
  });
  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAdmin) {
    const error: any = {
      message: "L'utilisateur n'existe pas.",
      statusCode: 401,
    };
    throw error;
  }

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  if (existingLesson.adminId !== existingAdmin.id) {
    const error: any = {
      message:
        "Vous n'êtes pas le propriétaire de cette ressource, rapprochez-vous d'un admin.",
      statusCode: 400,
    };
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
