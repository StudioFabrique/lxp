import Role from "../../utils/interfaces/db/role";
import Student from "../../utils/interfaces/db/student/student.model";
import User from "../../utils/interfaces/db/teacher-admin/teacher.model";
import { getPagination } from "../../utils/services/getPagination";

async function searchUser(
  entity: string,
  value: string,
  role: string,
  page: number,
  limit: number,
  sdir: string
) {
  const dir = sdir === "asc" ? 1 : -1;

  const fetchedRole = await Role.findOne({ role: role });

  if (!fetchedRole) {
    return false;
  }

  let field: any;

  if (entity === "createdAt") {
    const startDate = new Date(value);
    const endDate = new Date(value);
    endDate.setDate(endDate.getDate() + 1); // Ajouter 1 jour pour obtenir la fin de la plage

    field = {
      $gte: startDate,
      $lt: endDate,
    };
  } else {
    field = new RegExp(value, "i");
  }

  if (entity === "isActive") {
    field = value;
  }

  console.log({ field });

  if (fetchedRole.rank < 3) {
    const users = await User.find(
      { [entity]: field, roles: fetchedRole._id },
      { password: 0 }
    )
      .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
      .sort({ [entity]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);
    const total = await User.count({ [entity]: field, roles: fetchedRole._id });
    return { total, users };
  } else if (fetchedRole.rank > 2) {
    const users = await Student.find(
      { [entity]: field, roles: fetchedRole._id },
      { password: 0 }
    )
      .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
      .sort({ [entity]: dir })
      .skip(getPagination(page, limit))
      .limit(limit);
    const total = await Student.count({
      [entity]: field,
      roles: fetchedRole._id,
    });
    return { total, users };
  }
}

export default searchUser;
