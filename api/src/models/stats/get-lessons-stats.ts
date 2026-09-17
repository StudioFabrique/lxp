import { prisma } from "../../utils/db.ts";

export default async function getLessonsStats() {
  const lessons = await prisma.orm.public.Lesson.select("title")
    .include("lessonsRead")
    .orderBy((row) => row.createdAt.desc())
    .limit(10)
    .all();

  const result = lessons.map((item) => ({
    title: item.title,
    total: item.lessonsRead.length,
  }));
  return result;
}
