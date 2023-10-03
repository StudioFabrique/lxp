import Role, { IRole } from "../../utils/interfaces/db/role";
import User from "../../utils/interfaces/db/user";
import { getPagination } from "../../utils/services/getPagination";

async function getUsersByRole(
  page: number,
  limit: number,
  role: string,
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

  const users = await User.find(
    { roles: { $in: fetchedRoles } },
    { password: 0 }
  )
    .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
    .sort({ [stype]: dir })
    .skip(getPagination(page, limit))
    .limit(limit);
  const total = await User.count({ roles: { $in: fetchedRoles } });
  return { total, users };
}
export default getUsersByRole;
