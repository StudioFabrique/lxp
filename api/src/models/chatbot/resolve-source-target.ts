import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import { type CourseSource } from "../../utils/interfaces/db/chat-dialogs.ts";

export default async function resolveSourceTarget(source: CourseSource) {
  const numericActivityId = Number(source.activity);
  const activity = await prisma.orm.public.Activity.where((row) =>
    whereFromObject(row, {
      lesson: { course: { courseSlug: source.course } },
      OR: [
        ...(Number.isInteger(numericActivityId)
          ? [{ id: numericActivityId }]
          : []),
        { title: { equals: source.activity, mode: "insensitive" as const } },
      ],
    }),
  )
    .select("id")
    .include("lesson", (related19) =>
      related19
        .select("id")
        .include("course", (related20) => related20.select("moduleId")),
    )
    .first();

  const lesson =
    activity?.lesson ??
    (await prisma.orm.public.Lesson.where((row) =>
      whereFromObject(row, { course: { courseSlug: source.course } }),
    )
      .select("id")
      .include("course", (related21) => related21.select("moduleId"))
      .orderBy((row) => row.order.asc())
      .first());

  return {
    moduleId: lesson?.course?.moduleId,
    lessonId: lesson?.id,
    activityId: activity?.id,
  };
}
