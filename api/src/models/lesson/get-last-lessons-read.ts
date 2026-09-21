import { and } from "@prisma/orm-postgres/orm-client";

import { calculateCourseProgress } from "../../helpers/calculate-module-progress.ts";
import { prisma } from "../../utils/db.ts";
import Group from "../../utils/interfaces/db/group.ts";
import { loadSkillAchievements } from "../../helpers/skill-achievement-query.ts";

/**
 * Get the list of last read lessons by a student and not finished.
 * If none is currently in progress, return an empty list so the dashboard can
 * display the parcours card instead.
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

  if (groupIds.length === 0) return [];

  // Fetch last opened, unfinished lessons
  const lessons = await prisma.orm.public.LessonRead.where((row) =>
    and(
      row.student.some((student) => student.idMdb.eq(userIdMdb)),
      row.lesson.some((lesson) =>
        and(
          lesson.visibility.eq(true),
          lesson.activities.some((activity) => activity.id.gt(0)),
          lesson.course.some((course) =>
            and(
              course.isPublished.eq(true),
              course.visibility.eq(true),
              course.module.some((module) =>
                module.parcours.some((parcours) =>
                  and(
                    parcours.isPublished.eq(true),
                    parcours.groups.some((groups) =>
                      groups.group.some((group) => group.idMdb.in(groupIds)),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      row.finishedAt.isNull(),
    ),
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
                .where((lesson) =>
                  and(
                    lesson.visibility.eq(true),
                    lesson.activities.some((activity) => activity.id.gt(0)),
                  ),
                )
                .select("id")
                .include("lessonsRead", (related109) =>
                  related109
                    .where((row) =>
                      row.student.some((student) =>
                        student.idMdb.eq(userIdMdb),
                      ),
                    )
                    .select("id", "finishedAt"),
                ),
            )
            .include("assignment", (related110) =>
              related110.include("submissions", (related111) =>
                related111
                  .where((row) =>
                    row.student.some((student) => student.idMdb.eq(userIdMdb)),
                  )
                  .select("submittedAt"),
              ),
            ),
        ),
    )
    .orderBy((row) => row.lastOpenedAt.desc())
    .limit(max ?? 4)
    .all();

  // Sans leçon en cours, le dashboard affiche la carte du parcours. Il ne doit
  // pas transformer arbitrairement une leçon jamais ouverte en reprise.
  if (!lessons.length) return [];

  // Récupère la dernière activité ouverte dans chacune des leçons afin que la
  // reprise ramène l'apprenant exactement où il s'est arrêté.
  const lessonIds = lessons.flatMap(({ lesson }) =>
    lesson?.id ? [lesson.id] : [],
  );
  const activityReads = lessonIds.length
    ? await prisma.orm.public.ActivityRead.where((row) =>
        and(
          row.student.some((student) => student.idMdb.eq(userIdMdb)),
          row.activity.some((activity) => activity.lessonId.in(lessonIds)),
        ),
      )
        .select("activityId", "lastOpenedAt")
        .include("activity", (activity) => activity.select("lessonId"))
        .orderBy((row) => row.lastOpenedAt.desc())
        .all()
    : [];
  const latestActivityByLesson = new Map<number, number>();
  for (const read of activityReads) {
    const lessonId = read.activity?.lessonId;
    if (lessonId && !latestActivityByLesson.has(lessonId)) {
      latestActivityByLesson.set(lessonId, read.activityId);
    }
  }

  // L'ordre par dernière ouverture est conservé : le premier élément devient
  // la reprise principale du tableau de bord.
  const skillAchievements = await loadSkillAchievements(userIdMdb, {
    skillIds: lessons.flatMap(
      ({ lesson }) =>
        lesson?.course?.module?.bonusSkills.map(
          ({ bonusSkillId }) => bonusSkillId,
        ) ?? [],
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
        activityId: latestActivityByLesson.get(lesson.id),
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
    });

  return lessonsReformattedWithSkillBadge;
}
