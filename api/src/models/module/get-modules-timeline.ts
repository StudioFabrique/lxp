import { prisma } from "../../utils/db";

import Group from "../../utils/interfaces/db/group";

export default async function getModulesTimeline(
  userIdMdb: string,
  max?: number
) {
  const groupsWhereStudentIs = await Group.find({ users: userIdMdb });

  const groupIds: string[] = groupsWhereStudentIs.map((group) => group.id);

  if (!(groupIds.length > 0)) return null;

  const modulesWithMinMaxDates = await prisma.moduleMetadata.findMany({
    select: {
      id: true,
      minDate: true,
      maxDate: true,
      module: { select: { title: true } },
    },
    where: {
      parcours: {
        groups: { some: { group: { idMdb: { in: groupIds } } } },
      },
    },
    orderBy: { minDate: "asc" },
    take: max,
  });

  return modulesWithMinMaxDates.map((item) => {
    return {
      id: item.id,
      title: item.module.title,
      minDate: item.minDate,
      maxDate: item.maxDate,
    };
  });
}
