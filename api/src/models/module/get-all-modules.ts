import { prisma } from "../../utils/db";

export default async function getAllModules() {
  const existingModules = await prisma.module.findMany({
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
    },
  });

  const serializedModules = existingModules.map((item) => {
    if (item.formations.length > 0) {
      return {
        ...item,
        formation: item.formations[0].formation.title,
        thumb: item.thumb
          ? Buffer.from(item.thumb as any).toString("base64")
          : null,
      };
    }
  });

  /*   const updatedModules = serializedModules.map((item: any) => {
    if (item.courses) {
      return { ...item, courses: item.courses.length };
    }
  }); */

  return serializedModules ?? [];
}
