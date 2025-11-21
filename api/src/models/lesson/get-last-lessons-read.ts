import { prisma } from "../../utils/db";
import Group from "../../utils/interfaces/db/group";

/**
 * Get the list of last read lessons by a student and not finished.
 * If none started, return the first lesson of the first course in parcours.
 * @param userIdMdb Student ID
 * @param max Max number of lessons to retrieve
 * @returns
 */
export default async function getLastLessonsRead(
  userIdMdb: string,
  max?: number
) {
  const groupsWhereStudentIs = await Group.find({ users: userIdMdb });
  const groupIds = groupsWhereStudentIs.map((group) => group.id);

  if (groupIds.length === 0) return null;

  // Fetch last opened, unfinished lessons
  const lessons = await prisma.lessonRead.findMany({
    where: {
      student: { idMdb: userIdMdb },
      lesson: {
        course: {
          isPublished: true,
          visibility: true,
          module: {
            parcours: {
              isPublished: true,
              groups: { some: { group: { idMdb: { in: groupIds } } } },
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
          order: true, // lesson order important for sorting
          course: {
            select: {
              id: true,
              title: true,
              order: true, // course order for sorting
              module: {
                select: {
                  id: true,
                  module: { select: { title: true } },
                  parcours: { select: { id: true } },
                  bonusSkills: {
                    select: {
                      bonusSkill: { select: { id: true, badge: true } },
                    },
                  },
                },
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
        },
      },
    },
    orderBy: { lastOpenedAt: "desc" },
    take: max,
  });

  // If no lessons started, find the first lesson of the first course in parcours
  if (!lessons.length) {
    const firstLesson = await prisma.lesson.findFirst({
      where: {
        lessonsRead: { none: { student: { idMdb: userIdMdb } } },
        course: {
          isPublished: true,
          visibility: true,
          module: {
            parcours: {
              isPublished: true,
              groups: { some: { group: { idMdb: { in: groupIds } } } },
            },
          },
        },
      },
      include: {
        course: {
          select: {
            id: true,
            order: true, // course order
            title: true,
            module: {
              select: {
                id: true,
                module: { select: { title: true } },
                parcours: { select: { id: true } },
              },
            },
          },
        },
      },
      orderBy: [
        { course: { order: "asc" } },
        { order: "asc" }, // lesson order
      ],
    });

    if (!firstLesson) return null;

    const lessonReformatted = {
      lesson: {
        id: firstLesson.id,
        title: firstLesson.title,
        order: firstLesson.order,
        course: {
          ...firstLesson.course,
          module: {
            ...firstLesson.course.module,
            title: firstLesson.course.module.module.title,
          },
        },
        parcoursId: firstLesson.course.module.parcours.id,
      },
    };

    return [lessonReformatted];
  }

  // Student has started lessons, return sorted list by course order then lesson order
  const lessonsReformattedWithSkillBadge = lessons
    .map((lessonRead) => {
      const { course } = lessonRead.lesson;
      const bonusSkills = course.module.bonusSkills.map((b) => b.bonusSkill);

      return {
        ...lessonRead,
        lesson: {
          ...lessonRead.lesson,
          course: {
            ...course,
            module: { ...course.module, title: course.module.module.title },
            bonusSkills,
          },
        },
        parcoursId: lessonRead.lesson.course.module.parcours.id,
      };
    })
    .sort((a, b) => {
      if (a.lesson.course.order === b.lesson.course.order) {
        return a.lesson.order - b.lesson.order;
      }
      return a.lesson.course.order - b.lesson.course.order;
    });

  return lessonsReformattedWithSkillBadge;
}
