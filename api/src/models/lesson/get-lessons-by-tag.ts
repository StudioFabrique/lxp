import { prisma } from "../../utils/db";

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
) {
  if (supplementaryResources) {
    const resources = await prisma.resource.findMany({
      where: { tags: { some: { tagId } } },
      select: {
        id: true,
        title: true,
        bonusActivities: { select: { id: true } },
      },
      orderBy: { title: "asc" },
    });

    const resourceResults: Result[] = resources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      activitiesCount: resource.bonusActivities.length,
      source: "resource",
    }));

    if (!includeCourseContents) return resourceResults;

    const lessons = await prisma.lesson.findMany({
      where: { tagId },
      select: {
        id: true,
        title: true,
        activities: { select: { id: true } },
        course: { select: { title: true } },
      },
      orderBy: { title: "asc" },
    });

    return [
      ...resourceResults,
      ...lessons.map(
        (lesson): Result => ({
          id: lesson.id,
          title: lesson.title,
          activitiesCount: lesson.activities.length,
          source: "lesson",
          sourceTitle: lesson.course.title,
        }),
      ),
    ];
  }

  const lessons = await prisma.lesson.findMany({
    where: { tagId },
    select: {
      id: true,
      title: true,
      activities: { select: { id: true } },
    },
  });

  let result: Result[] = [];

  for (const lesson of lessons) {
    if (
      !result.find(
        (item: Result) =>
          item.title === lesson.title &&
          item.activitiesCount === lesson.activities.length
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
