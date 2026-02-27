import { Course } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putCourseInformations(course: Course) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: +course.id },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const updatedCourse = await prisma.course.update({
    where: { id: +course.id },
    data: {
      title: course.title,
      description: course.description ?? null,
      visibility: course.visibility,
    },
    select: {
      id: true,
      title: true,
      description: true,
      visibility: true,
    },
  });
  return updatedCourse;
}

export default putCourseInformations;
