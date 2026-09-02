import Permission from "../../interfaces/db/permission.ts";
import Role from "../../interfaces/db/role.ts";
import User from "../../interfaces/db/user.ts";

/**
 * Retire l'ancien RBAC d'interface des bases déjà installées.
 *
 * L'accès aux espaces dépend désormais du rang du rôle métier, et les
 * autorisations CASL ne contiennent plus que des actions CRUD sur des
 * ressources. La migration est idempotente et peut donc tourner au démarrage.
 */
export default async function removeLegacyInterfaceRbac() {
  const [interfaceRoles, interfacePermissions] = await Promise.all([
    Role.find({ role: /^interface:/ }).select("_id"),
    Permission.find({ name: /^(layout|component):/ }).select("_id"),
  ]);

  const interfaceRoleIds = interfaceRoles.map(({ _id }) => _id);
  const interfacePermissionIds = interfacePermissions.map(({ _id }) => _id);

  if (interfaceRoleIds.length > 0) {
    await User.updateMany(
      { roles: { $in: interfaceRoleIds } },
      { $pull: { roles: { $in: interfaceRoleIds } } },
    );
    await Role.deleteMany({ _id: { $in: interfaceRoleIds } });
  }

  if (interfacePermissionIds.length > 0) {
    await Role.updateMany(
      { permissions: { $in: interfacePermissionIds } },
      { $pull: { permissions: { $in: interfacePermissionIds } } },
    );
    await Permission.deleteMany({ _id: { $in: interfacePermissionIds } });
  }
}
