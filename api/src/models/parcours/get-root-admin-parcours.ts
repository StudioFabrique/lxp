import { prisma } from "../../utils/db";
import Group from "../../utils/interfaces/db/group";

export default async function getRootAdminParcours() {
  const parcours = await prisma.parcours.findMany({
    select: {
      id: true,
      title: true,
      startDate: true,
      visibility: true,
      formation: {
        select: { level: true },
      },
      modules: {
        select: {
          module: {
            select: {
              courses: { select: { id: true } },
              duration: true,
            },
          },
        },
      },
      groups: {
        select: {
          group: {
            select: { idMdb: true },
          },
        },
      },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  let result = Array<any>();
  for (const item of parcours) {
    const groups = item.groups.map((group) => group.group);
    let students = 0;
    const courses = item.modules.map((module) => module.module.courses);
    let duration = 0;
    const modules = item.modules.map((module) => module.module);

    for (const module of modules) {
      duration += module.duration!;
    }

    for (let group of groups) {
      const g = await Group.findOne({ _id: group.idMdb }, { _id: 1 }).populate(
        "users",
        { _id: 1 }
      );
      students += g?.users.length ?? 0;
    }

    const parc = {
      id: item.id,
      title: item.title,
      level: item.formation.level,
      courses: courses.length,
      students,
      duration,
      startDate: item.startDate,
      visibility: item.visibility,
    };
    result = [...result, parc];
  }
  return result;
}
