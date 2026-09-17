import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

async function putCourseDates(
  courseId: number,
  minDate: string,
  maxDate: string,
  synchroneDuration: number,
  asynchroneDuration: number,
  id: number,
  startTime?: string,
  endTime?: string,
) {
  const existingCourse = await prisma.orm.public.Course.where((row) =>
    whereFromObject(row, { id: courseId }),
  )
    .select("dates")
    .first();

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let existingDates = existingCourse.dates;
  existingDates = [
    ...existingDates,
    {
      minDate,
      maxDate,
      synchroneDuration,
      asynchroneDuration,
      id,
      ...(startTime && endTime ? { startTime, endTime } : {}),
    },
  ];

  const updatedCourse = await prisma.orm.public.Course.where((row) =>
    whereFromObject(row, { id: courseId }),
  )
    .select("dates")
    .update({
      calendarInitialized: true,
      dates: existingDates,
    })
    .then(requireDatabaseRow);

  return updatedCourse;
}

export default putCourseDates;
