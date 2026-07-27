import { prisma } from "../../utils/db";
import { CourseSource } from "../../utils/interfaces/db/chat-dialogs";

export default async function resolveSourceTarget(source: CourseSource) {
  const numericActivityId = Number(source.activity);
  const activity = await prisma.activity.findFirst({
    select: {
      id: true,
      lesson: {
        select: {
          id: true,
          course: { select: { moduleId: true } },
        },
      },
    },
    where: {
      lesson: { course: { courseSlug: source.course } },
      OR: [
        ...(Number.isInteger(numericActivityId)
          ? [{ id: numericActivityId }]
          : []),
        { title: { equals: source.activity, mode: "insensitive" as const } },
      ],
    },
  });

  const lesson =
    activity?.lesson ??
    (await prisma.lesson.findFirst({
      select: {
        id: true,
        course: { select: { moduleId: true } },
      },
      where: { course: { courseSlug: source.course } },
      orderBy: { order: "asc" },
    }));

  return {
    moduleId: lesson?.course.moduleId,
    lessonId: lesson?.id,
    activityId: activity?.id,
  };
}
