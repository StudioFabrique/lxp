import { prisma } from "../../utils/db";

async function putCourseIsPublished(courseId: number) {
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
    data: { isPublished: true },
  });
  return updatedCourse;
}

export default putCourseIsPublished;
