import Role from "../../utils/interfaces/db/role";
import User from "../../utils/interfaces/db/user";
import { getPagination } from "../../utils/services/getPagination";

async function getUsersByRank(
  page: number,
  limit: number,
  rank: number,
  stype: string,
  sdir: string,
) {
  const dir = sdir === "asc" ? 1 : -1;
  let fetchedRoles;

  fetchedRoles = await Role.find({ rank: rank }, { _id: 1 });

  if (!fetchedRoles) {
    return false;
  }

  const users = await User.find(
    { roles: { $in: fetchedRoles } },
    { password: 0 },
  )
    .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
    .sort({ [stype]: dir })
    .skip(getPagination(page, limit))
    .limit(limit);
  const total = await User.count({ roles: { $in: fetchedRoles } });
  return { total, users };
}
export default getUsersByRank;
