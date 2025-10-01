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
      };
    }
  });

  /*   const updatedModules = serializedModules.map((item: any) => {
    if (item.courses) {
      return { ...item, courses: item.courses.length };
    }
  }); */

  const modules = serializedModules.map((item: any) => {
    if (item.thumb) {
      const base64Image = item.thumb.toString("base64");
      return { ...item, thumb: base64Image };
    } else {
      return item;
    }
  });

  return modules ?? [];
}
