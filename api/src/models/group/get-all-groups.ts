import Group from "../../utils/interfaces/db/group.ts";
import Role from "../../utils/interfaces/db/role.ts";
import { getPagination } from "../../utils/services/getPagination.ts";
import { prisma } from "../../utils/db.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { getGroupVisibilityFilter } from "../../utils/services/permissions/accessible-groups.ts";
import type { QueryFilter } from "mongoose";
import type { IGroup } from "../../utils/interfaces/db/group.ts";

async function getAllGroups(
  page: number,
  limit: number,
  role: string,
  stype: string,
  sdir: string,
  auth: NonNullable<CustomRequest["auth"]>,
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

  const visibilityFilter = await getGroupVisibilityFilter(auth);
  const groupFilter: QueryFilter<IGroup> = {
    roles: { $in: fetchedRoles.map((role) => role._id) },
    ...visibilityFilter,
  };

  const groups = await Group.find(groupFilter)
    .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
    .sort({ [stype]: dir })
    .skip(getPagination(page, limit))
    .limit(limit)
    .lean();

  const groupsWithFormation = await Promise.all(
    groups.map(async (group) => {
      const groupPrisma = await prisma.orm.public.Group.where({
        idMdb: group._id.toString(),
      })
        .include("parcours", (related77) =>
          related77
            .select("parcoursId")
            .include("parcours", (related78) =>
              related78
                .select("title")
                .include("formation", (related79) => related79.select("title")),
            ),
        )
        .first();

      return {
        ...group,
        nbStudents: group.users?.length ?? 0,
        formation:
          groupPrisma?.parcours && groupPrisma?.parcours.length > 0
            ? `${groupPrisma.parcours[0]!.parcours!.formation!.title} - ${groupPrisma.parcours[0]!.parcours!.title}`
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

export default getAllGroups;
