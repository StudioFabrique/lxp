import Permission, { IPermission } from "../../utils/interfaces/db/permission";
import Role, { IRole } from "../../utils/interfaces/db/role";

export async function postRole(role: string, rank?: number) {
  try {
    const existingRole = await Role.findOne({ role: role });

    console.log({ existingRole });

    if (!!existingRole) {
      const existingPermissions = await Permission.find({ role: role });

      if (!existingPermissions) {
        return null;
      }

      const roleCreated = await Role.create({
        role: `${role}_copy`,
        label: role,
        rank: existingRole.rank,
      });

      await _buildPermissions(roleCreated.role, existingPermissions);

      return roleCreated;
    }

    const roleCreated = await Role.create({
      role,
      label: role,
      rank,
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
