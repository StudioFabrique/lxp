import { prisma } from "../../utils/db.ts";

async function getCourseDates(courseId: number) {
  const existingCourse = await prisma.orm.public.Course.where({ id: courseId })
    .select("dates")
    .first();

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }
  return existingCourse;
}

export default getCourseDates;
