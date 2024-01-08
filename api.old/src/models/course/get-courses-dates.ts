import { prisma } from "../../utils/db";

async function getCourseDates(courseId: number) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
    select: { dates: true },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }
  return existingCourse;
}

export default getCourseDates;
