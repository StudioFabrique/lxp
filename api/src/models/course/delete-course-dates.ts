import { prisma } from "../../utils/db";
import { Prisma } from "@prisma/client";

async function deleteCourseDates(courseId: number, datesId: number) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!existingCourse) {
    const error: Error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let dates = existingCourse.dates;

  if (dates && dates.length > 0) {
    dates = dates.filter((item: any) => item.id !== datesId);
  }

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: {
      dates,
    } as Prisma.CourseUpdateInput,
  });

  return updatedCourse;
}

export default deleteCourseDates;
