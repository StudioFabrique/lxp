import { prisma } from "../../utils/db.ts";
import Group from "../../utils/interfaces/db/group.ts";
import Role from "../../utils/interfaces/db/role.ts";
import { getPagination } from "../../utils/services/getPagination.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { getGroupVisibilityFilter } from "../../utils/services/permissions/accessible-groups.ts";

async function searchGroup(
  entity: string,
  value: string,
  role: string,
  page: number,
  limit: number,
  stype: string,
  sdir: string,
  auth: NonNullable<CustomRequest["auth"]>,
) {
  const dir = sdir === "asc" ? 1 : -1;

  const fetchedRole = await Role.findOne({ role: role });

  if (!fetchedRole) {
    return false;
  }

  const visibilityFilter = await getGroupVisibilityFilter(auth);

  let field: any;

  if (entity === "createdAt") {
    const startDate = new Date(value);
    const endDate = new Date(value);
    endDate.setDate(endDate.getDate() + 1); // Ajouter 1 jour pour obtenir la fin de la plage

    field = {
      $gte: startDate,
      $lt: endDate,
    };
  } else {
    field = new RegExp(value, "i");
  }

  if (entity === "isActive") {
    field = value;
  }

  if (fetchedRole.rank < 3) {
    const groupFilter = {
      [entity]: field,
      roles: fetchedRole._id,
      ...visibilityFilter,
    };
    const groups = await Group.find(groupFilter)
      .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
      .sort({ [stype]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);

    const total = await Group.countDocuments(groupFilter);

    return { total, groupsWithFormation: groups };
  } else if (fetchedRole.rank > 2) {
    const groupFilter = {
      [entity]: field,
      roles: fetchedRole._id,
      ...visibilityFilter,
    };
    const groups = await Group.find(
      groupFilter,
      { password: 0 },
    )
      .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
      .sort({ [stype]: dir })
      .skip(getPagination(page, limit))
      .limit(limit)
      .lean();

    const groupsWithFormation = await Promise.all(
      groups.map(async (group) => {
        const groupPrisma = await prisma.group.findFirst({
          select: {
            parcours: {
              select: {
                parcoursId: true,
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
          nbStudents: group.users.length,
          formation:
            groupPrisma?.parcours && groupPrisma?.parcours.length > 0
              ? `${groupPrisma?.parcours[0].parcours.formation.title} - ${groupPrisma?.parcours[0].parcours.title}`
              : null,
          parcoursId:
            groupPrisma?.parcours && groupPrisma?.parcours.length > 0
              ? groupPrisma?.parcours[0].parcoursId
              : null,
        };
      }),
    );

    const total = await Group.countDocuments(groupFilter);
    return { total, groupsWithFormation };
  }
}

export default searchGroup;
