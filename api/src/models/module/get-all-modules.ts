import { prisma } from "../../utils/db";

export default async function getAllModules() {
  const modules = await prisma.module.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      thumb: true,
      author: true,
      createdAt: true,
      updatedAt: true,
      parcoursId: true,
      parcours: {
        select: {
          title: true,
          formation: { select: { id: true, title: true } },
        },
      },
      courses: { select: { id: true } },
    },
  });

  return modules.map(({ parcours, courses, ...module }) => ({
    ...module,
    parcours: parcours.title,
    formationId: parcours.formation.id,
    formation: parcours.formation.title,
    coursesCount: courses.length,
    thumb: module.thumb
      ? Buffer.from(module.thumb as any).toString("base64")
      : null,
  }));
}
