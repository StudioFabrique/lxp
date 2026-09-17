import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import type { Course } from "../../prisma/model-types.ts";
import { prisma } from "../../utils/db.ts";

async function putCourseInformations(course: Course) {
  const existingCourse = await prisma.orm.public.Course.where({
    id: +course.id,
  }).first();

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const updatedCourse = await prisma.orm.public.Course.where({ id: +course.id })
    .select("id", "title", "description", "visibility")
    .update({
      title: course.title,
      description: course.description ?? null,
      visibility: course.visibility,
    })
    .then(requireDatabaseRow);
  return updatedCourse;
}

export default putCourseInformations;
