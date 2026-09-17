import { and, or } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";
import { type CourseSource } from "../../utils/interfaces/db/chat-dialogs.ts";

export default async function resolveSourceTarget(source: CourseSource) {
  const numericActivityId = Number(source.activity);
  const activity = await prisma.orm.public.Activity.where((row) =>
    and(
      row.lesson.some((lesson) =>
        lesson.course.some((course) => course.courseSlug.eq(source.course)),
      ),
      or(
        ...(Number.isInteger(numericActivityId)
          ? [row.id.eq(numericActivityId)]
          : []),
        row.title.ilike(source.activity.replace(/[\\%_]/g, "\\$&")),
      ),
    ),
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
      row.course.some((course) => course.courseSlug.eq(source.course)),
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
