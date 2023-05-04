import Student from "../../../utils/interfaces/db/student/student.model";
import User from "../../../utils/interfaces/db/teacher-admin/teacher.model";
import { getPagination } from "../../../utils/services/getPagination";

async function getAllUsers(
  page: number,
  limit: number,
  role: string,
  stype: string,
  sdir: string
) {
  const dir = sdir === "asc" ? 1 : -1;

  if (role === "admin" || role === "teacher") {
    const users = await User.find({ roles: role })
      .sort({ [stype]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);
    const total = await User.count({ roles: role });
    return { total, users };
  } else if (role === "student") {
    const users = await Student.find({ roles: role })
      .sort({ [stype]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);
    const total = await Student.count();
    return { total, users };
  }
}

export default getAllUsers;
