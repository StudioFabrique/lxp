import { prisma } from "../../utils/db";

import Group from "../../utils/interfaces/db/group";

/**
 * Récupère la liste des dernières leçons lues par un étudiant et n'étant pas terminé.
 * @param userIdMdb L'id de l'étudiant
 * @param max Le nombre de leçons maximum à récupérer
 * @returns
 */
export default async function getLastLessonsRead(
  userIdMdb: string,
  max?: number,
) {
  const groupsWhereStudentIs = await Group.find({ users: userIdMdb });

  const groupIds: string[] = groupsWhereStudentIs.map((group) => group.id);

  if (!(groupIds.length > 0)) return null;

  const lessons = await prisma.lessonRead.findMany({
    where: {
      student: { idMdb: userIdMdb },
      lesson: {
        // isPublished: true,
        // visibility: true,
        course: {
          isPublished: true,
          visibility: true,
          module: {
            parcours: {
              every: {
                parcours: {
                  isPublished: true,
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
              id: true,
              title: true,
              order: true,
              module: {
                select: {
                  id: true,
                  title: true,
                  parcours: { select: { parcoursId: true } },
                },
              },
              bonusSkills: {
                select: { bonusSkill: { select: { id: true, badge: true } } },
              },
              lessons: {
                select: {
                  id: true,
                  lessonsRead: {
                    where: { student: { idMdb: userIdMdb } },
                    select: { id: true, finishedAt: true },
                  },
                },
              },
            },
          },
          order: true,
        },
      },
    },
    orderBy: { lastOpenedAt: "desc" },
    take: max,
  });

  if (lessons && !(lessons?.length > 0)) {
    const lesson = await prisma.lesson.findFirst({
      where: {
        // isPublished: true,
        // visibility: true,
        lessonsRead: { every: { NOT: { student: { idMdb: userIdMdb } } } },
        course: {
          isPublished: true,
          visibility: true,
          module: {
            parcours: {
              every: {
                parcours: {
                  isPublished: true,
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
            module: {
              select: {
                id: true,
                title: true,
                parcours: { select: { parcoursId: true } },
              },
            },
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    if (!lesson) return null;

    const lessonReformated = {
      lesson: {
        id: lesson?.id,
        title: lesson?.title,
        course: lesson?.course,
        parcoursId: lesson.course.module.parcours[0].parcoursId,
      },
    };

    return [lessonReformated];
  }

  const lessonsReformatedWithSkillBadge = lessons?.map((lessonRead) => {
    const { course } = lessonRead.lesson;

    const bonusSkills = course.bonusSkills.map((bonusSkill) => {
      return bonusSkill.bonusSkill;
    });

    return {
      ...lessonRead,
      lesson: {
        ...lessonRead.lesson,
        course: { ...course, bonusSkills },
      },
      parcoursId: lessonRead.lesson.course.module.parcours[0].parcoursId,
    };
  });

  return lessonsReformatedWithSkillBadge;
}
