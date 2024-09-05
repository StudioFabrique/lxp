import Role, { IRole } from "../../utils/interfaces/db/role";
import User from "../../utils/interfaces/db/user";
import { getPagination } from "../../utils/services/getPagination";
import { prisma } from "../../utils/db";

async function getUsersByRole(
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

  const groupsSql = await prisma.group.findMany({
    select: {
      idMdb: true,
      parcours: {
        select: {
          parcours: {
            select: {
              title: true,
              formation: {
                select: { title: true },
              },
            },
          },
        },
      },
    },
  });

  let groupsData = Array<any>();
  for (const group of groupsSql) {
    groupsData = [
      ...groupsData,
      {
        groupId: group.idMdb,
        parcours:
          group.parcours.length > 0 ? group.parcours[0].parcours.title : "-",
        formation:
          group.parcours.length > 0
            ? group.parcours[0].parcours.formation.title
            : "-",
      },
    ];
  }

  /**
 Tri dynamique de la liste des utilisateurs avec Mongoose.
 Par défaut la liste est triée par la propriété "stype" passée
 en argument, puis par noms croissants et prénoms croissants.
 Les cas ou la propriété dynamique utilisée pour le tri est le nom
 ou le prénom sont pris en compte
  */

  const sortObject: any = {};

  if (stype === "firstname") {
    sortObject["firstname"] = dir; // tri dynamique par firstname
    sortObject["lastname"] = 1; // tri secondaire par lastname
  } else if (stype === "lastname") {
    sortObject["lastname"] = dir; // tri dynamique par lastname
    sortObject["firstname"] = 1; // tri secondaire par firstname
  } else {
    sortObject[stype] = dir; // tri dynamique pour n'importe quelle autre propriété
    sortObject["lastname"] = 1; // tri dynamique par lastname
    sortObject["firstname"] = 1; // tri dynamique par firstname
  }

  const data = await User.find(
    { roles: { $in: fetchedRoles } },
    { _id: 1, firstname: 1, lastname: 1, email: 1, avatar: 1, isActive: 1 },
  )
    .populate("group")
    .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
    .sort(sortObject)
    .skip(getPagination(page, limit))
    .limit(limit);
  const total = await User.count({ roles: { $in: fetchedRoles } });

  let users = data.map((user) => {
    return {
      ...user.toObject(),
      parcours:
        user.group && user.group.length > 0
          ? groupsData.find(
              (item) => user.group[0]._id.toString() === item.groupId,
            ).parcours
          : "-",
      formation:
        user.group && user.group.length > 0
          ? groupsData.find(
              (item) => user.group[0]._id.toString() === item.groupId,
            ).formation
          : "-",
      avatar: user.avatar ? user.avatar.toString("base64") : null,
    };
  });
  return { total, users };
}
export default getUsersByRole;
