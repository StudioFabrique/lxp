import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";
import { defaultCourseDates } from "../../helpers/course-calendar-dates.ts";

export async function initializeCourseCalendar(moduleId: number) {
  return prisma.transaction(async (tx) => {
    const module = await tx.orm.public.Module.where({ id: moduleId })
      .include("courses", (related22) =>
        related22.orderBy([(row) => row.order.asc(), (row) => row.id.asc()]),
      )
      .first();
    if (!module) return null;
    for (const [index, course] of module.courses.entries()) {
      if (course.calendarInitialized) continue;
      await tx.orm.public.Course.where({
        id: course.id,
        calendarInitialized: false,
      })
        .updateAndCount({
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
        })
        .then((count) => ({ count }));
    }
    return tx.orm.public.Course.where({ moduleId: module.id })
      .select("id", "dates", "calendarColor")
      .orderBy([(row) => row.order.asc(), (row) => row.id.asc()])
      .all();
  });
}

export async function replaceCourseCalendarDates(
  courseId: number,
  dates: any[],
) {
  return prisma.orm.public.Course.where({ id: courseId })
    .select("id", "dates", "calendarColor")
    .update({ dates, calendarInitialized: true })
    .then(requireDatabaseRow);
}

export function replaceCourseCalendarColor(courseId: number, calendarColor: string) {
  return prisma.orm.public.Course.where({ id: courseId })
    .select("id", "dates", "calendarColor")
    .update({ calendarColor })
    .then(requireDatabaseRow);
}
