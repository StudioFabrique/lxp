import { prisma } from "../../utils/db";

export default async function deleteCourseFromModule(courseId: number) {
  const existingCourse = await prisma.course.findFirst({
    where: {
      id: courseId,
    },
  });

  if (!existingCourse)
    throw { statusCode: 404, message: "Le cours n'existe pas !" };

  await prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      moduleId: undefined,
    },
  });
}
