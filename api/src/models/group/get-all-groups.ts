import Group from "../../utils/interfaces/db/group";
import Role from "../../utils/interfaces/db/role";
import Student from "../../utils/interfaces/db/student/student.model";
import { getPagination } from "../../utils/services/getPagination";

async function getAllGroups(
  page: number,
  limit: number,
  role: string,
  stype: string,
  sdir: string
) {
  const dir = sdir === "asc" ? 1 : -1;

  console.log({ role });

  const fetchedRole = await Role.findOne({ role: role });

  if (!fetchedRole) {
    return false;
  }

  console.log({ fetchedRole });

  if (fetchedRole.rank < 3) {
    const groups = await Group.find({ roles: fetchedRole._id })
      .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
      .sort({ [stype]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);
    const total = await Group.count({ roles: fetchedRole._id });
    return { total, groups };
  } else if (fetchedRole.rank > 2) {
    const groups = await Group.find({ roles: fetchedRole._id })
      .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
      .sort({ [stype]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);
    const total = await Group.count({ roles: fetchedRole._id });

    return { total, groups };
  }
}

export default getAllGroups;
