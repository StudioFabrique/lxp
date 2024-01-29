import { prisma } from "../../utils/db";

export default async function getTeacherParcours(userId: string) {
  const existingAdmin = await prisma.teacher.findFirstOrThrow({
    where: { idMdb: userId },
  });

  const parcours = await prisma.parcours.findMany({
    where: { adminId: existingAdmin.id },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      author: true,
      isPublished: true,
      visibility: true,
      formation: {
        select: {
          title: true,
          level: true,
        },
      },
    },
  });

  const result = parcours.map((item) => ({
    ...item,
    formation: item.formation.title,
    level: item.formation.level,
  }));

  return result;
}
