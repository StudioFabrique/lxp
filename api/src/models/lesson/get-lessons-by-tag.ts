import { and } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

type Result = {
  id: number;
  title: string;
  activitiesCount: number;
  source: "resource" | "lesson";
  sourceTitle?: string;
};

export default async function getLessonsByTag(
  tagId: number,
  includeCourseContents = false,
  supplementaryResources = false,
  scope: AccessScope = null,
) {
  // Les leçons sont bornées au périmètre de l'appelant ; les ressources, elles,
  // forment une bibliothèque transverse sans rattachement à un parcours et
  // restent donc gouvernées par la seule permission `read:resource`.
  const filterLessons = (query: typeof prisma.orm.public.Lesson) =>
    query.where((lesson) =>
      and(
        lesson.tagId.eq(tagId),
        ...(scope
          ? [
              lesson.course.some((course) =>
                course.module.some((module) =>
                  scope.moduleIds === null
                    ? module.parcoursId.in(scope.parcoursIds)
                    : module.id.in(scope.moduleIds),
                ),
              ),
            ]
          : []),
      ),
    );
  if (supplementaryResources) {
    const resources = await prisma.orm.public.Resource.where((row) =>
      row.tags.some((tags) => tags.tagId.eq(tagId)),
    )
      .select("id", "title")
      .include("bonusActivities", (related123) => related123.select("id"))
      .orderBy((row) => row.title.asc())
      .all();

    const resourceResults: Result[] = resources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      activitiesCount: resource.bonusActivities.length,
      source: "resource",
    }));

    if (!includeCourseContents) return resourceResults;

    const lessons = await filterLessons(prisma.orm.public.Lesson)
      .select("id", "title")
      .include("activities", (related124) => related124.select("id"))
      .include("course", (related125) => related125.select("title"))
      .orderBy((row) => row.title.asc())
      .all();

    return [
      ...resourceResults,
      ...lessons.map((lesson): Result => ({
        id: lesson.id,
        title: lesson.title,
        activitiesCount: lesson.activities.length,
        source: "lesson",
        sourceTitle: lesson.course!.title,
      })),
    ];
  }

  const lessons = await filterLessons(prisma.orm.public.Lesson)
    .select("id", "title")
    .include("activities", (related126) => related126.select("id"))
    .all();

  let result: Result[] = [];

  for (const lesson of lessons) {
    if (
      !result.find(
        (item: Result) =>
          item.title === lesson.title &&
          item.activitiesCount === lesson.activities.length,
      )
    ) {
      result = [
        ...result,
        {
          id: lesson.id,
          title: lesson.title,
          activitiesCount: lesson.activities.length,
          source: "lesson",
        },
      ];
    }
  }

  return result;
}
