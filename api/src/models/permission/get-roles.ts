import Permission from "../../utils/interfaces/db/permission";
import Role from "../../utils/interfaces/db/role";

export default async function getRoles() {
  const roles = await Role.find();
  const rolesArray = [];

  for (const role of roles) {
    rolesArray.push({
      _id: role._id,
      role: role.role,
      permCount: await Permission.count({ role: role.role }),
    });
  }

  return rolesArray;
}
