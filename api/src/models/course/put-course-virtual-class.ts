import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

async function putCourseVirtualClass(courseId: number, virtualClass: string) {
  const existingCourse = await prisma.orm.public.Course.where({
    id: courseId,
  }).first();

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const updatedCourse = await prisma.orm.public.Course.where({ id: courseId })
    .update({ virtualClass })
    .then(requireDatabaseRow);

  return updatedCourse;
}

export default putCourseVirtualClass;
