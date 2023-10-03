import { prisma } from "../../utils/db";

async function putCourseImage(courseId: number, image: any) {
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
      image,
    },
  });

  return updatedCourse;
}

export default putCourseImage;
