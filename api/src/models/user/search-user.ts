import Role from "../../utils/interfaces/db/role";
import User from "../../utils/interfaces/db/user";
import { getPagination } from "../../utils/services/getPagination";

async function searchUser(
  entity: string,
  value: string,
  role: string,
  page: number,
  limit: number,
  stype: string,
  sdir: string
) {
  const dir = sdir === "asc" ? 1 : -1;

  let fetchedRoles;
  console.log({ role });

  if (role === "everything") {
    fetchedRoles = await Role.find({}, { _id: 1 });
  } else {
    fetchedRoles = await Role.find({ role: role }, { _id: 1 });
  }

  if (!fetchedRoles) {
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

  const users = await User.find(
    { [entity]: field, roles: { $in: fetchedRoles } },
    { password: 0 }
  )
    .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
    .sort({ [stype]: dir })
    .skip(getPagination(page, limit))
    .limit(limit);
  const total = await User.count({
    [entity]: field,
    roles: { $in: fetchedRoles },
  });
  return { total, users };
}

export default searchUser;
