import { Course } from "@prisma/client";
import { prisma } from "../../utils/db";
import Module from "module";

async function postCourse(title: string, moduleId: number) {
  let existingModule: any = {};
  if (moduleId) {
    existingModule = await prisma.module.findFirst({
      where: { id: moduleId },
    });

    if (!existingModule) {
      const error = new Error("Le module n'existe pas");
      (error as any).statusCode = 404;
      throw error;
    }
  }

  const newCourse = await prisma.course.create({
    data: { title },
    select: { id: true },
  });

  let updatedModule: any = {};

  if (existingModule) {
    updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        courses: {
          create: [newCourse].map((item: any) => {
            return {
              course: {
                connect: {
                  id: newCourse.id,
                },
              },
            };
          }),
        },
      },
    });
  }

  return newCourse;
}

export default postCourse;
