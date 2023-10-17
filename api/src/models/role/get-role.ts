import Permission from "../../utils/interfaces/db/permission";
import Role from "../../utils/interfaces/db/role";

export default async function getRole(roleName: string, withPerms = false) {
  const role = await Role.findOne({ role: roleName });

  if (!role) return null;

  const permCount: any = {};
  const permissions: any = {};
  (await Permission.find({ role: role.role })).forEach((perm) => {
    permCount[perm.action] = perm.ressources.length + 1;
    if (withPerms) permissions[perm.action] = perm.ressources;
  });

  return {
    _id: role._id,
    role: role.role,
    permCount: permCount,
    perms: withPerms ? permissions : undefined,
  };
}