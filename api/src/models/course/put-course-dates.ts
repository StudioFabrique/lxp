import { Prisma } from "@prisma/client";
import { prisma } from "../../utils/db.ts";

async function putCourseDates(
  courseId: number,
  minDate: string,
  maxDate: string,
  synchroneDuration: number,
  asynchroneDuration: number,
  id: number,
  startTime?: string,
  endTime?: string
) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
    select: { dates: true },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let existingDates = existingCourse.dates;
  existingDates = [
    ...existingDates,
    { minDate, maxDate, synchroneDuration, asynchroneDuration, id, ...(startTime && endTime ? { startTime, endTime } : {}) },
  ];

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: {
      calendarInitialized: true,
      dates: existingDates,
    } as Prisma.CourseUpdateInput,
    select: {
      dates: true,
    },
  });

  return updatedCourse;
}

export default putCourseDates;
