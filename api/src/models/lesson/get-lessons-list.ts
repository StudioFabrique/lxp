import { prisma } from "../../utils/db";

export default async function getLessonsList() {
  const existingLessons = await prisma.lesson.findMany({
    select: {
      id: true,
      title: true,
      modalite: true,
      tag: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      author: true,
      adminId: true,
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return existingLessons;
}
