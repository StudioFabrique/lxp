import { prisma } from "../../utils/db";

async function postCourse(course: any) {
  let existingModule: any = {};
  if (course.moduleId) {
    existingModule = await prisma.module.findFirst({
      where: { id: course.moduleId },
    });

    if (!existingModule) {
      const error = new Error("Le module n'existe pas");
      (error as any).statusCode = 404;
      throw error;
    }
  }

  const newCourse = await prisma.course.create({
    data: course,
    select: { id: true },
  });

  if (existingModule) {
    await prisma.coursesOnModule.create({
      data: {
        moduleId: course.moduleId,
        courseId: newCourse.id,
      },
    });
  }

  return newCourse;
}

export default postCourse;
