import { prisma } from "../../utils/db.ts";
import { defaultCourseDates } from "../../helpers/course-calendar-dates.ts";

export async function initializeCourseCalendar(moduleId: number) {
  return prisma.$transaction(async (tx) => {
    const module = await tx.module.findUnique({
      where: { id: moduleId },
      include: { courses: { orderBy: [{ order: "asc" }, { id: "asc" }] } },
    });
    if (!module) return null;
    for (const [index, course] of module.courses.entries()) {
      if (course.calendarInitialized) continue;
      await tx.course.updateMany({
        where: { id: course.id, calendarInitialized: false },
        data: {
          calendarInitialized: true,
          ...(course.dates.length === 0
            ? {
                dates: [
                  defaultCourseDates(
                    index,
                    module.courses.length,
                    module.minDate,
                    module.maxDate,
                  ),
                ],
              }
            : {}),
        },
      });
    }
    return tx.course.findMany({
      where: { moduleId: module.id },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: { id: true, dates: true },
    });
  });
}

export async function replaceCourseCalendarDates(courseId: number, dates: any[]) {
  return prisma.course.update({
    where: { id: courseId },
    data: { dates, calendarInitialized: true },
    select: { id: true, dates: true },
  });
}
