import Group from "../../utils/interfaces/db/group";
import { prisma } from "../../utils/db";

export default async function getGroupDetails(groupId: string) {
  const group = await Group.findOne({
    _id: groupId,
  })
    .populate("users")
    .lean();

  const groupPrisma = await prisma.group.findFirst({
    select: {
      parcours: {
        select: {
          parcours: {
            select: {
              formation: { select: { title: true } },
              title: true,
            },
          },
        },
      },
    },
    where: { idMdb: groupId },
  });

  if (!(group && groupPrisma)) return;

  return {
    ...group,
    formation:
      groupPrisma?.parcours && groupPrisma?.parcours.length > 0
        ? `${groupPrisma?.parcours[0].parcours.formation.title} - ${groupPrisma?.parcours[0].parcours.title}`
        : undefined,
  };
}
