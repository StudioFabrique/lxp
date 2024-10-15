import Group from "../../utils/interfaces/db/group";
import Role from "../../utils/interfaces/db/role";
import { getPagination } from "../../utils/services/getPagination";
import { prisma } from "../../utils/db";

async function getAllGroups(
  page: number,
  limit: number,
  role: string,
  stype: string,
  sdir: string,
) {
  const dir = sdir === "asc" ? 1 : -1;
  let fetchedRoles;

  if (role === "everything") {
    fetchedRoles = await Role.find({}, { _id: 1 });
  } else {
    fetchedRoles = await Role.find({ role: role }, { _id: 1 });
  }

  if (!fetchedRoles) {
    return false;
  }

  const groups = await Group.find({ roles: { $in: fetchedRoles } })
    .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
    .sort({ [stype]: dir })
    .skip(getPagination(page, limit))
    .limit(limit)
    .lean();

  const groupsWithFormation = await Promise.all(
    groups.map(async (group) => {
      {
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
          where: { idMdb: group._id },
        });

        return {
          ...group,
          formation:
            groupPrisma?.parcours && groupPrisma?.parcours.length > 0
              ? `${groupPrisma?.parcours[0].parcours.formation.title} - ${groupPrisma?.parcours[0].parcours.title}`
              : undefined,
        };
      }
    }),
  );

  const total = await Group.count({ roles: { $in: fetchedRoles } });
  return { total, groupsWithFormation };
}

export default getAllGroups;
