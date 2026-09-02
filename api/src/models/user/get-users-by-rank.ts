import Role from "../../utils/interfaces/db/role.ts";
import User from "../../utils/interfaces/db/user.ts";
import { getPagination } from "../../utils/services/getPagination.ts";
import mongoose from "mongoose";

async function getUsersByRank(
  page: number,
  limit: number,
  rank: number,
  stype: string,
  sdir: string,
  searchValue?: string,
  excludedUserIds: string[] = [],
  actorRank = 0,
) {
  const dir = sdir === "asc" ? 1 : -1;
  const fetchedRoles = await Role.find({ rank: rank }, { _id: 1 });

  if (!fetchedRoles) {
    return false;
  }

  const filters: Record<string, unknown> = {
    roles: { $in: fetchedRoles },
  };

  const hiddenRoles = await Role.find(
    { rank: { $lte: actorRank } },
    { _id: 1 },
  );
  filters.$and = [
    { roles: { $nin: hiddenRoles.map(({ _id }) => _id) } },
  ];

  if (searchValue?.trim()) {
    const escapedSearchValue = searchValue
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchPattern = new RegExp(escapedSearchValue, "i");
    filters.$or = [
      { firstname: searchPattern },
      { lastname: searchPattern },
      { email: searchPattern },
    ];
  }

  if (excludedUserIds.length > 0) {
    filters._id = {
      $nin: excludedUserIds.map((id) => new mongoose.Types.ObjectId(id)),
    };
  }

  const users = await User.find(filters, { password: 0 })
    .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
    .sort({ [stype]: dir })
    .skip(getPagination(page, limit))
    .limit(limit);
  const total = await User.countDocuments(filters);
  return { total, users };
}
export default getUsersByRank;
