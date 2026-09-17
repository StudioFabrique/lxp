import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

async function deleteCourseDates(courseId: number, datesId: number) {
  const existingCourse = await prisma.orm.public.Course.where({
    id: courseId,
  }).first();

  if (!existingCourse) {
    const error: Error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let dates = existingCourse.dates;

  if (dates && dates.length > 0) {
    dates = dates.filter((item: any) => item.id !== datesId);
  }

  const updatedCourse = await prisma.orm.public.Course.where({ id: courseId })
    .update({ calendarInitialized: true, dates })
    .then(requireDatabaseRow);

  return updatedCourse;
}

export default deleteCourseDates;
