import Group from "../../utils/interfaces/db/group";
import Role from "../../utils/interfaces/db/role";
import { getPagination } from "../../utils/services/getPagination";

async function getAllGroups(
  page: number,
  limit: number,
  role: string,
  stype: string,
  sdir: string
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
    .limit(limit);
  const total = await Group.count({ roles: { $in: fetchedRoles } });
  return { total, groups };
}

export default getAllGroups;
