/**
 * Récupère la liste des dernières leçons lues par un étudiant et n'étant pas terminé.
 * @param userIdMdb L'id de l'étudiant
 * @param max Le nombre de leçons maximum à récupérer
 * @returns
 */
export default async function getLastLessonsRead(
  userIdMdb: string,
  max?: number
) {
  const lessons = await prisma?.lessonRead.findMany({
    where: { student: { idMdb: userIdMdb }, finishedAt: null },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          course: {
            select: {
              title: true,
              module: { select: { id: true, title: true } },
            },
          },
        },
      },
    },
    orderBy: { lastOpenedAt: "desc" },
    take: max,
  });

  if (lessons && !(lessons?.length > 0)) {
    const lesson = await prisma?.lesson.findFirst({
      where: {
        lessonsRead: { every: { NOT: { student: { idMdb: userIdMdb } } } },
      },
      include: {
        course: {
          select: {
            title: true,
            module: { select: { id: true, title: true } },
          },
        },
      },
    });

    if (!lesson) return null;

    const lessonReformated = {
      lesson: { id: lesson?.id, title: lesson?.title, course: lesson?.course },
    };

    return [lessonReformated];
  }

  return lessons;
}
