import mongoose from "mongoose";
import Permission from "../../utils/interfaces/db/permission.ts";
import Role, { type IRole } from "../../utils/interfaces/db/role.ts";
import {
  resourcesRbac,
  getPermissionsByRank,
} from "../../utils/rbac/config/ressources-rbac.ts";
import {
  addPermissionToRole,
  createOrUpdateRoleWithPermissions,
  getAllActionsPermissionsForRole,
  getAllRoles,
  getAllRolesWithSearch,
  removePermissionFromRole,
} from "../../utils/rbac/rbac-utils.ts";

type RoleIdentifier =
  | { identifier: "role"; role: string }
  | { identifier: "_id"; _id: string };

function fail(statusCode: number, message: string): never {
  throw { statusCode, message };
}

export const listRoles = () => getAllRoles();
export const searchRoles = (value: string) => getAllRolesWithSearch(value);
export const listRolePermissions = (role: string) =>
  getAllActionsPermissionsForRole({ identifier: "role", role });
export const grantPermission = (roleId: string, permission: string) =>
  addPermissionToRole(roleId, permission);
export const revokePermission = (roleId: string, permission: string) =>
  removePermissionFromRole(roleId, permission);

export async function getRoleResources(identifier: RoleIdentifier) {
  const [permissions, roles] = await Promise.all([
    getAllActionsPermissionsForRole(identifier),
    Role.find({ role: { $not: { $regex: "^interface:" } } }),
  ]);
  if (!permissions) fail(404, "aucune permissions n'a été trouvé");
  if (resourcesRbac.length === 0)
    fail(404, "aucune ressources n'a été trouvé");

  const data: Record<string, unknown> = {
    permissions,
    ressources: {
      ressources: resourcesRbac,
      roles: roles.map((role) => role.role),
    },
  };
  if (identifier.identifier === "_id") {
    data.role = await Role.findById(identifier._id);
  }
  return data;
}

export async function createRole(role: string, label: string, rank: number) {
  const createdRole = await createOrUpdateRoleWithPermissions(
    role,
    label,
    rank,
    undefined,
    await getPermissionsByRank(rank),
  );
  if (!createdRole) fail(500, "Erreur lors de la création du rôle");

  const adminRole = await Role.findOne({ role: "admin" });
  const permissions = await Promise.all(
    ["read", "write", "update", "delete"].map((action) =>
      Permission.create({ name: `${action}:${createdRole.role}`, isRole: true }),
    ),
  );
  if (adminRole) {
    await Role.findByIdAndUpdate(adminRole._id, {
      $addToSet: { permissions: { $each: permissions.map((item) => item._id) } },
    });
  }
}

export async function updateRole(
  id: string,
  role: string,
  label: string,
  rank: number,
) {
  const existingRole = await Role.findById(id);
  return existingRole?.rank !== rank
    ? createOrUpdateRoleWithPermissions(
        role,
        label,
        rank,
        id,
        await getPermissionsByRank(rank),
      )
    : createOrUpdateRoleWithPermissions(role, label, rank, id);
}

export async function resetRole(id: string) {
  const role = await Role.findById(id);
  if (!role) fail(400, "Paramètres de requête non conformes.");
  return createOrUpdateRoleWithPermissions(
    role.role,
    role.label,
    role.rank,
    id,
    await getPermissionsByRank(role.rank),
    true,
  );
}

async function removeRolePermissions(roleNames: string[]) {
  const permissionNames = roleNames.flatMap((role) =>
    ["write", "read", "delete", "update"].map(
      (action) => `${action}:${role}`,
    ),
  );
  const permissions = await Permission.find({
    name: { $in: permissionNames },
  }).select("_id");
  await Role.updateMany(
    { role: { $not: /^interface:/ } },
    { $pull: { permissions: { $in: permissions.map((item) => item._id) } } },
  );
  await Permission.deleteMany({ name: { $in: permissionNames } });
}

export async function deleteRole(id: string, currentRoles: IRole[]) {
  if (currentRoles.some((role) => role._id.toString() === id))
    fail(400, "Impossible de supprimer ses propres rôle");

  const role = await Role.findById(id);
  if (!role)
    fail(404, "Le rôle demandé pour la suppression n'existe pas");
  if (role.protection >= 1)
    fail(400, "Impossible de supprimer un rôle protégé");

  const rolesWithUsers = await Role.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "roles",
        as: "usersWithRole",
      },
    },
  ]);
  if (rolesWithUsers[0]?.usersWithRole?.length > 0)
    fail(
      400,
      "Impossible de supprimer un rôle associé à plus d'un utilisateur",
    );

  await removeRolePermissions([role.role]);
  await Role.deleteOne({ _id: id });
}

export async function deleteManyRoles(ids: string[], currentRoles: IRole[]) {
  if (currentRoles.some((role) => ids.includes(role._id.toString())))
    fail(400, "Impossible de supprimer ses propres rôles");

  const protectedRoles = await Role.find({
    _id: { $in: ids },
    protection: { $in: [1, 2] },
  });
  if (protectedRoles.length > 0)
    fail(400, "Impossible de supprimer des rôles protégés");

  const rolesWithUsers = await Role.aggregate([
    {
      $match: {
        _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "roles",
        as: "usersWithRole",
      },
    },
  ]);
  if (rolesWithUsers.some((role) => role.usersWithRole?.length > 0))
    fail(400, "Impossible de supprimer un rôle associé à plus d'un utilisateur");

  const rolesToDelete = await Role.find({ _id: { $in: ids } });
  await removeRolePermissions(rolesToDelete.map((role) => role.role));
  await Role.deleteMany({ _id: { $in: ids } });
}
