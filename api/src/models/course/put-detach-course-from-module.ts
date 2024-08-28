import { prisma } from "../../utils/db";

export default async function putDetachCourseFromModule(courseId: number) {
  const existingCourse = await prisma.course.findFirst({
    where: {
      id: courseId,
    },
  });
  if (!existingCourse) {
    throw { statusCode: 404, message: "Le cours n'existe pas." };
  }
  const updatedCourse = await prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      moduleId: 10000,
    },
  });
  return updatedCourse;
}
