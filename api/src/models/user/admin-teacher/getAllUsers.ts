import Student from "../../../utils/interfaces/db/student/student.model";
import User from "../../../utils/interfaces/db/teacher-admin/teacher.model";
import { getPagination } from "../../../utils/services/getPagination";

async function getAllUsers(page: number, limit: number, role: string) {
  console.log({ limit });

  if (role === "admin" || role === "teacher") {
    const users = await User.find({ roles: role })
      .skip(getPagination(page, limit))
      .limit(limit);
    return users;
  } else if (role === "student") {
    const users = await Student.find({ roles: role })
      .skip(getPagination(page, limit))
      .limit(limit);
    return users;
  }
}

export default getAllUsers;
