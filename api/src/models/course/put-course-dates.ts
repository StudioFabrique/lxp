import { Prisma } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putCourseDates(
  courseId: number,
  minDate: string,
  maxDate: string,
  synchroneDuration: number,
  asynchroneDuration: number
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
    { minDate, maxDate, synchroneDuration, asynchroneDuration },
  ];

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: {
      dates: existingDates,
    } as Prisma.CourseUpdateInput,
    select: {
      dates: true,
    },
  });

  return updatedCourse;
}

export default putCourseDates;
