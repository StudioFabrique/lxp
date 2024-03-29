import Permission from "../../utils/interfaces/db/permission";
import Role from "../../utils/interfaces/db/role";

export default async function getRoles() {
  const roles = await Role.find();
  const rolesArray = [];

  for (const role of roles) {
    const permCount: any = {};
    (await Permission.find({ role: role.role })).forEach((perm) => {
      permCount[perm.action] = perm.ressources.length;
    });

    rolesArray.push({
      _id: role._id,
      role: role.role,
      label: role.label,
      rank: role.rank,
      isActive: role.isActive,
      permCount: permCount,
    });
  }

  return rolesArray;
}
