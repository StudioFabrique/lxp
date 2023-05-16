import Role from "../../utils/interfaces/db/role";
import Student from "../../utils/interfaces/db/student/student.model";
import User from "../../utils/interfaces/db/teacher-admin/teacher.model";
import { getPagination } from "../../utils/services/getPagination";

async function getAllUsers(
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
    const users = await User.find({ roles: fetchedRole._id }, { password: 0 })
      .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
      .sort({ [stype]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);
    const total = await User.count({ roles: fetchedRole._id });
    return { total, users };
  } else if (fetchedRole.rank > 2) {
    const users = await Student.find(
      { roles: fetchedRole._id },
      { password: 0 }
    )
      .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
      .sort({ [stype]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);
    const total = await Student.count({ roles: fetchedRole._id });

    return { total, users };
  }
}

export default getAllUsers;
