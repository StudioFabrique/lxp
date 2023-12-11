import { Objective } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putCourseNewObjective(courseId: number, objective: Objective) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
    select: {
      id: true,
      module: {
        select: {
          parcours: {
            select: {
              parcours: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let newObjective: Objective;

  const transaction = await prisma.$transaction(async (tx) => {
    const parcoursId = existingCourse.module!.parcours[0].parcours.id;
    newObjective = await tx.objective.create({
      data: { ...objective, parcoursId },
    });
    return newObjective;

    /*     const updatedCourse = await tx.course.update({
      where: { id: courseId },
      data: {
        objectives: {
          create: {
            objective: {
              connect: { id: newObjective.id },
            },
          },
        },
      },
    });
    return newObjective; */
  });

  return transaction;
}

export default putCourseNewObjective;
