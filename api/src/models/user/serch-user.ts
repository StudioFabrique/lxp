import Student from "../../utils/interfaces/db/student/student.model";
import User from "../../utils/interfaces/db/teacher-admin/teacher.model";
import { getPagination } from "../../utils/services/getPagination";

async function searchUser(
  entity: string,
  value: string,
  userType: number,
  page: number,
  limit: number,
  sdir: string
) {
  const dir = sdir === "asc" ? 1 : -1;

  let field: any;

  if (entity === "createdAt") {
    field = new Date(value);
  } else {
    field = new RegExp(value, "i");
  }

  console.log({ field });

  if (userType < 3) {
    const users = await User.find({ [entity]: field }, { password: 0 })
      .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
      .sort({ [entity]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);
    const total = await User.count({ [entity]: field });
    return { total, users };
  } else if (userType > 2) {
    const users = await Student.find({ [entity]: field }, { password: 0 })
      .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
      .sort({ [entity]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);
    const total = await Student.count({ [entity]: field });
    return { total, users };
  }
}

export default searchUser;
