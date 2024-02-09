import Group from "../../utils/interfaces/db/group";

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
  const groupsWhereStudentIs = await Group.find({ users: userIdMdb });

  const groupIds: string[] = groupsWhereStudentIs.map((group) => group.id);

  if (!(groupIds.length > 0)) return null;

  const lessons = await prisma?.lessonRead.findMany({
    where: {
      student: { idMdb: userIdMdb },
      lesson: {
        course: {
          module: {
            parcours: {
              every: {
                parcours: {
                  groups: { some: { group: { idMdb: { in: groupIds } } } },
                },
              },
            },
          },
        },
      },
      finishedAt: null,
    },
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
        course: {
          module: {
            parcours: {
              every: {
                parcours: {
                  groups: { some: { group: { idMdb: { in: groupIds } } } },
                },
              },
            },
          },
        },
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
