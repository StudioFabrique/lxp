import { Lesson } from "@prisma/client";
import { prisma } from "../../utils/db";

type LessonFromDb = {
  id: number;
  title: string;
  activities: { id: number }[];
};

type Result = {
  id: number;
  title: string;
  activitiesCount: number;
};

export default async function getLessonsByTag(tagId: number) {
  const lessons = await prisma.lesson.findMany({
    where: { tagId },
    select: {
      id: true,
      title: true,
      activities: { select: { id: true } },
    },
  });

  let result: Result[] = [];

  for (const lesson of lessons as LessonFromDb[]) {
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
        },
      ];
    }
  }

  return result;
}
