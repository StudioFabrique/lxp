import Group from "../../utils/interfaces/db/group";
import Role from "../../utils/interfaces/db/role";
import { getPagination } from "../../utils/services/getPagination";

async function searchGroup(
  entity: string,
  value: string,
  role: string,
  page: number,
  limit: number,
  stype: string,
  sdir: string
) {
  const dir = sdir === "asc" ? 1 : -1;

  const fetchedRole = await Role.findOne({ role: role });

  if (!fetchedRole) {
    return false;
  }

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

  console.log({ field });

  if (fetchedRole.rank < 3) {
    const groups = await Group.find(
      { [entity]: field, roles: fetchedRole._id },
      { password: 0 }
    )
      .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
      .sort({ [stype]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);
    const total = await Group.count({
      [entity]: field,
      roles: fetchedRole._id,
    });
    return { total, groups };
  } else if (fetchedRole.rank > 2) {
    const groups = await Group.find(
      { [entity]: field, roles: fetchedRole._id },
      { password: 0 }
    )
      .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
      .sort({ [stype]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);
    const total = await Group.count({
      [entity]: field,
      roles: fetchedRole._id,
    });
    return { total, groups };
  }
}

export default searchGroup;
