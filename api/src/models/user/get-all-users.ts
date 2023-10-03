import User from "../../utils/interfaces/db/user";
import { getPagination } from "../../utils/services/getPagination";

async function getAllUsers(
  page: number,
  limit: number,
  stype: string,
  sdir: string
) {
  const dir = sdir === "asc" ? 1 : -1;

  const users = await User.find({}, { password: 0 })
    .populate("roles")
    .sort({ [stype]: dir })
    .skip(getPagination(page, limit))
    .limit(limit);
  const total = await User.count({});
  return { total, users };
}

export default getAllUsers;
