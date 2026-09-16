import { whereFromObject } from "../../utils/prisma-query.ts";
import { calculateCourseProgress } from "../../helpers/calculate-module-progress.ts";
import { prisma } from "../../utils/db.ts";
import Group from "../../utils/interfaces/db/group.ts";
import { loadSkillAchievements } from "../../helpers/skill-achievement-query.ts";

/**
 * Get the list of last read lessons by a student and not finished.
 * If none started, return the first lesson of the first course in parcours.
 * @param userIdMdb Student ID
 * @param max Max number of lessons to retrieve
 * @returns
 */
export default async function getLastLessonsRead(
  userIdMdb: string,
  max?: number,
) {
  const groupsWhereStudentIs = await Group.find({ users: userIdMdb });
  const groupIds = groupsWhereStudentIs.map((group) => group.id);

  if (groupIds.length === 0) return null;

  // Fetch last opened, unfinished lessons
  const lessons = await prisma.orm.public.LessonRead.where((row) =>
    whereFromObject(row, {
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
    }),
  )
    .include("lesson", (related102) =>
      related102
        .select("id", "title", "order")
        .include("course", (related103) =>
          related103
            .select("id", "title", "order")
            .include("module", (related104) =>
              related104
                .select("id", "title")
                .include("parcours", (related105) => related105.select("id"))
                .include("bonusSkills", (related106) =>
                  related106.include("bonusSkill", (related107) => related107),
                ),
            )
            .include("lessons", (related108) =>
              related108
                .select("id")
                .include("lessonsRead", (related109) =>
                  related109
                    .where((row) =>
                      whereFromObject(row, { student: { idMdb: userIdMdb } }),
                    )
                    .select("id", "finishedAt"),
                ),
            )
            .include("assignment", (related110) =>
              related110.include("submissions", (related111) =>
                related111
                  .where((row) =>
                    whereFromObject(row, { student: { idMdb: userIdMdb } }),
                  )
                  .select("submittedAt"),
              ),
            ),
        ),
    )
    .orderBy((row) => row.lastOpenedAt.desc())
    .limit(max ?? 4)
    .all();

  // If no lessons started, find the first lesson of the first course in parcours
  if (!lessons.length) {
    const firstLesson = await prisma.orm.public.Lesson.where((row) =>
      whereFromObject(row, {
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
      }),
    )
      .include("course", (related112) =>
        related112
          .select("id", "order", "title")
          .include("module", (related113) =>
            related113
              .select("id", "title")
              .include("parcours", (related114) => related114.select("id"))
              .include("bonusSkills", (related115) =>
                related115.include("bonusSkill", (related116) => related116),
              ),
          ),
      )
      .orderBy((row) => row.order.asc())
      .first();

    if (!firstLesson) return null;
    const skillAchievements = await loadSkillAchievements(userIdMdb, {
      skillIds: firstLesson.course!.module!.bonusSkills.map(({ bonusSkillId }) => bonusSkillId),
    });

    const lessonReformatted = {
      parcoursId: firstLesson.course!.module!.parcours!.id,
      lesson: {
        id: firstLesson.id,
        title: firstLesson.title,
        order: firstLesson.order,
        course: {
          ...firstLesson.course,
          bonusSkills: firstLesson.course!.module!.bonusSkills.map(
            ({ bonusSkillId }) => skillAchievements.get(bonusSkillId)!,
          ),
          module: {
            ...firstLesson.course!.module,
            title: firstLesson.course!.module!.title,
          },
          // Aucune leçon n'a encore été ouverte dans ce parcours.
          stats: { progress: 0 },
        },
      },
    };

    return [lessonReformatted];
  }

  // Student has started lessons, return sorted list by course order then lesson order
  const skillAchievements = await loadSkillAchievements(userIdMdb, {
    skillIds: lessons.flatMap(({ lesson }) =>
      lesson?.course?.module?.bonusSkills.map(({ bonusSkillId }) => bonusSkillId) ?? [],
    ),
  });
  const lessonsReformattedWithSkillBadge = lessons
    .map((lessonRead) => {
      const lesson = lessonRead.lesson!;
      const course = lesson.course!;
      const bonusSkills = course.module!.bonusSkills.map(({ bonusSkillId }) =>
        skillAchievements.get(bonusSkillId)!,
      );

      return {
        ...lessonRead,
        lesson: {
          ...lesson,
          order: lesson.order,
          course: {
            ...course,
            module: { ...course.module!, title: course.module!.title },
            bonusSkills,
            // `lessons` est déjà chargé filtré par apprenant : le calcul ne
            // coûte rien de plus et évite au front de le refaire.
            stats: { progress: calculateCourseProgress(course) },
          },
        },
        parcoursId: course.module!.parcours!.id,
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
