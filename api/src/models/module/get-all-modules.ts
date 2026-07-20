import { prisma } from "../../utils/db";

export default async function getAllModules() {
  const existingModules = await prisma.module.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      thumb: true,
      author: true,
      createdAt: true,
      updatedAt: true,
      formations: {
        select: {
          formation: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      metadatas: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: {
          id: true,
          parcoursId: true,
          parcours: { select: { title: true } },
          courses: { select: { id: true } },
        },
      },
    },
  });

  const serializedModules = existingModules.map((item) => {
    return {
      ...item,
      metadataId: item.metadatas[0]?.id ?? null,
      parcoursId: item.metadatas[0]?.parcoursId ?? null,
      parcours: item.metadatas[0]?.parcours.title ?? null,
      coursesCount: item.metadatas[0]?.courses.length ?? 0,
      formation: item.formations[0]?.formation.title ?? null,
      thumb: item.thumb
        ? Buffer.from(item.thumb as any).toString("base64")
        : null,
    };
  });

  /*   const updatedModules = serializedModules.map((item: any) => {
    if (item.courses) {
      return { ...item, courses: item.courses.length };
    }
  }); */

  return serializedModules ?? [];
}
