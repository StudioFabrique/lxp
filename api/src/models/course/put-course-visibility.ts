import { prisma } from "../../utils/db";

async function putCourseVisibility(courseId: number, visibility: string) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const visibilityValue = visibility === "true";

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: {
      visibility: visibilityValue,
    },
  });

  return updatedCourse;
}

export default putCourseVisibility;
