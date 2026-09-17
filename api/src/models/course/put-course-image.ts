import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

async function putCourseImage(courseId: number, image: any) {
  const existingCourse = await prisma.orm.public.Course.where({
    id: courseId,
  }).first();

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const updatedCourse = await prisma.orm.public.Course.where({ id: courseId })
    .update({ image })
    .then(requireDatabaseRow);

  return updatedCourse;
}

export default putCourseImage;
