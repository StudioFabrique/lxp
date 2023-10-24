import Permission, { IPermission } from "../../utils/interfaces/db/permission";
import Role, { IRole } from "../../utils/interfaces/db/role";

export async function postRole(role: string, description: string) {
  try {
    /* const isCloneExist = await Role.findOne({ role: `${role}_clone` });

    if (isCloneExist) return null;

    const existingRole = await Role.findOne({ role: role });

    if (!!existingRole) {
      const existingPermissions = await Permission.find({ role: role });

      if (!existingPermissions) {
        return null;
      }

      const roleCreated = await Role.create({
        role: `${role}_clone`,
        label: role,
        rank: existingRole.rank,
      });

      await _buildPermissions(roleCreated.role, existingPermissions);

      return roleCreated;
    } */

    const existingRole = await Role.findOne({ role: role });

    if (!!existingRole) return null;

    const roleCreated = await Role.create({
      role,
      label: description,
      rank: 2,
    });

    return roleCreated;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function _buildPermissions(role: string, permissions: IPermission[]) {
  for (const permission of permissions)
    await Permission.create({
      role: role,
      action: permission.action,
      ressources: permission.ressources,
    });
}
