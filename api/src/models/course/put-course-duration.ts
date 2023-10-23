import { prisma } from "../../utils/db";

async function putCourseDuration(
  courseId: number,
  synchroneDuration: number,
  asynchroneDuration: number
) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: {
      synchroneDuration,
      asynchroneDuration,
    },
    select: {
      synchroneDuration: true,
      asynchroneDuration: true,
    },
  });

  return updatedCourse;
}

export default putCourseDuration;
