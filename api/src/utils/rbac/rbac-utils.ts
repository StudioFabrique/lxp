import { resourcesRbac } from "./config/ressources-rbac.ts";
import Permission, { type IPermission } from "../interfaces/db/permission.ts";
import Role, { type IRole } from "../interfaces/db/role.ts";
import User from "../interfaces/db/user.ts";
import { logger } from "../logs/logger.ts";
import updateUserRoles from "../../models/user/update-user-roles.ts";

/**
 * Configure les rôles initiaux dans le système
 * Crée ou met à jour les rôles admin et user avec leurs permissions respectives
 */
// export async function setupRoles() {
//   await UserRoles.createNewRoleOrAddPermissions("admin", [
//     "read",
//     "write",
//     "update",
//     "delete",
//   ]);
//   await UserRoles.createNewRoleOrAddPermissions("user", ["read"]);
// }

/**
 * Assigne le rôle apprenant à un utilisateur spécifique
 * @param userId - L'identifiant de l'utilisateur
 */
export async function assignRoleToUser(userId: string) {
  return assignRoleAndSync(userId, "student");
}

/** Remplace le rôle, sans jamais cumuler les autorisations. */
export async function assignRoleAndSync(userId: string, role: string) {
  const userRole = await Role.findOne({ role });
  if (!userRole) throw new Error("Role not found");
  return updateUserRoles([userId], [userRole._id.toString()]);
}

/**
 * Récupère tous les rôles d'un utilisateur spécifique
 * @param userId - L'identifiant de l'utilisateur
 * @returns La liste des rôles de l'utilisateur
 */
export async function getRolesForUser(userId: string) {
  const user = await User.findById(userId).populate<{ roles: IRole[] }>(
    "roles",
  );
  if (!user) {
    return [];
  }
  const roles = user.roles.length === 1 ? [user.roles[0].role] : [];

  return roles;
}

export async function getAllRoles(minimumRank = 0) {
  const roles = await Role.find({
    rank: { $gt: minimumRank },
  }).populate<{ permissions: IPermission[] }>("permissions");

  return roles.map((role) => {
    const permissions = role.permissions.map((perm) => perm.name);
    return {
      _id: role._id,
      role: role.role,
      label: role.label,
      rank: role.rank,
      model: getRoleModelLabel(role.rank),
      protection: role.protection,
      countRead: permissions.filter((perm) => perm.startsWith("read:")).length,
      countWrite: permissions.filter((perm) => perm.startsWith("write:"))
        .length,
      countUpdate: permissions.filter((perm) => perm.startsWith("update:"))
        .length,
      countDelete: permissions.filter((perm) => perm.startsWith("delete:"))
        .length,
    };
  });
}

export async function getAllRolesWithSearch(search: string, minimumRank = 0) {
  // Construction de la query avec la valeur de recherche
  // Recherche dans la propriété role mais aussi dans la propriété
  const queryWithSearch = {
    $or: [
      { role: { $regex: search, $options: "i" } },
      { label: { $regex: search, $options: "i" } },
    ],
  };
  const roles = await Role.find({
    ...queryWithSearch,
    rank: { $gt: minimumRank },
  }).populate<{ permissions: IPermission[] }>("permissions");

  return roles.map((role) => {
    const permissions = role.permissions.map((perm) => perm.name);
    return {
      _id: role._id,
      role: role.role,
      label: role.label,
      rank: role.rank,
      model: getRoleModelLabel(role.rank),
      protection: role.protection,
      countRead: permissions.filter((perm) => perm.startsWith("read:")).length,
      countWrite: permissions.filter((perm) => perm.startsWith("write:"))
        .length,
      countUpdate: permissions.filter((perm) => perm.startsWith("update:"))
        .length,
      countDelete: permissions.filter((perm) => perm.startsWith("delete:"))
        .length,
    };
  });
}

function getRoleModelLabel(rank: number): string {
  return (
    {
      0: "root",
      1: "administrateur",
      2: "équipe pédagogique",
      3: "apprenant",
      4: "visiteur",
    }[rank] ?? "personnalisé"
  );
}

/**
 * Récupère la liste des utilisateurs ayant un rôle spécifique
 * @param role - Le rôle dont on veut récupérer les utilisateurs
 * @returns Une liste des identifiants utilisateurs ayant ce rôle
 */
export async function getUsersThatHaveRole(role: string) {
  const foundRole = await Role.findOne({ role });
  if (!foundRole) {
    return [];
  }

  const users = await User.find({ roles: foundRole._id });
  const userIds = users.map((user) => user._id.toString());
  return userIds;
}

/**
 * Supprime un rôle spécifique d'un utilisateur
 * @param userId - L'identifiant de l'utilisateur
 * @param role - Le rôle à supprimer
 */
export async function removeRoleFromUser(_userId: string, _role: string) {
  throw new Error(
    "Un utilisateur doit conserver un rôle. Attribuez un rôle de remplacement.",
  );
}

/**
 * Récupère toutes les permissions d'un rôle
 * @param role - Le nom du rôle
 * @returns La liste des permissions du rôle
 */
export async function getAllActionsPermissionsForRole(
  role:
    { identifier: "_id"; _id: string } | { identifier: "role"; role: string },
): Promise<string[]> {
  const roleDoc = await (role.identifier === "_id"
    ? Role.findById(role._id).populate("permissions")
    : Role.findOne({ role: role.role }).populate("permissions"));
  if (!roleDoc) {
    return [];
  }

  const permissionList = (roleDoc.permissions as any[]).map(
    (permission) => permission.name,
  );
  return permissionList;
}

/**
 * Récupère toutes les permissions pour un utilisateur spécifique
 * @param userId - L'identifiant de l'utilisateur
 * @returns La liste des permissions de l'utilisateur
 */
export async function getAllPermissionsForUser(
  userId: string,
): Promise<string[]> {
  const user = await User.findById(userId).populate<{
    roles: Array<Omit<IRole, "permissions"> & { permissions: IPermission[] }>;
  }>({
    path: "roles",
    populate: { path: "permissions" },
  });
  if (!user) {
    return [];
  }

  if (user.roles.length !== 1) return [];
  const permissionList: string[] = (user.roles[0].permissions || [])
    .map((permission: any) => permission.name)
    .filter(Boolean);

  return permissionList;
}

/**
 * Remove a permission from a role
 * @param roleId - ID of the role
 * @param permissionName - Name of the permission to remove
 */
export async function removePermissionFromRole(
  roleId: string,
  permissionName: string,
): Promise<void> {
  try {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new Error("Role not found");
    }

    if (role.protection === 2) {
      throw new Error("Cannot modify permissions of a protected role");
    }

    const permission = await Permission.findOne({ name: permissionName });
    if (!permission) {
      throw new Error("Permission not found");
    }

    // Remove permission from role
    await Role.findByIdAndUpdate(roleId, {
      $pull: { permissions: permission._id },
    });
  } catch (error) {
    logger.error(
      `Error removing permission ${permissionName} from role ${roleId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Add a permission to a role
 * @param roleId - ID of the role
 * @param permissionName - Name of the permission to add
 */
export async function addPermissionToRole(
  roleId: string,
  permissionName: string,
): Promise<void> {
  try {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new Error("Role not found");
    }

    if (role.protection === 2) {
      throw new Error("Cannot modify permissions of a protected role");
    }

    let permission = await Permission.findOne({ name: permissionName });
    if (!permission) {
      permission = new Permission({ name: permissionName });
      await permission.save();
    }

    // Add permission to role
    await Role.findByIdAndUpdate(roleId, {
      $addToSet: { permissions: permission._id },
    });
  } catch (error) {
    logger.error(
      `Error adding permission ${permissionName} to role ${roleId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Crée un rôle avec des permissions spécifiques suivant le modèle RBAC
 * @param roleName - Le nom du rôle à créer
 * @param permissions - Les permissions à associer au rôle, sous forme de tableau d'objets
 * @returns Promise<void>
 */
export async function createOrUpdateRoleWithPermissions(
  roleName: string,
  label: string,
  rank: number,
  _id?: string,
  permissions?: {
    resource: string;
    actions: Array<"read" | "write" | "update" | "delete">;
  }[],
  forceUpdatePermissions?: boolean,
) {
  let formattedPermissions: string[] = [];

  // This avoids preventing roles from being named the same as a resource (e.g. "course")
  // while still preventing exact name collisions with permission documents.
  const permissionConflict = await Permission.findOne({ name: roleName });
  if (permissionConflict) {
    const error = new Error(
      "Le nom du rôle est déjà utilisé par une permission",
    ) as any;
    error.statusCode = 409;
    throw error;
  }

  // Check if role name already exists
  const existingRole = await Role.findOne({ role: roleName });
  if (existingRole && (!_id || existingRole._id.toString() !== _id)) {
    const error = new Error("Le nom du rôle existe déjà") as any;
    error.statusCode = 409;
    throw error;
  }

  if (permissions !== undefined) {
    if (
      !permissions.every((permission) =>
        resourcesRbac.map((r) => r.name).includes(permission.resource),
      )
    ) {
      const error = new Error("Ressource invalide dans les permissions") as any;
      error.statusCode = 400;
      throw error;
    }

    formattedPermissions = permissions.flatMap((permission) =>
      permission.actions.map((action) => `${action}:${permission.resource}`),
    );
  }

  let foundRole;
  if (_id) {
    foundRole = await Role.findById(_id);
    if (foundRole) {
      if (foundRole.protection >= 1) {
        foundRole = await Role.findByIdAndUpdate(
          _id,
          { label },
          { returnDocument: "after" },
        );
      } else {
        foundRole = await Role.findByIdAndUpdate(
          _id,
          { role: roleName, label, rank },
          { returnDocument: "after" },
        );
      }
    }
  }

  if (!foundRole) {
    foundRole = new Role({ role: roleName, label, rank });
    await foundRole.save();
  }

  // Only update permissions if they were provided and role is not protected
  if (
    (permissions !== undefined && foundRole.protection !== 2) ||
    forceUpdatePermissions
  ) {
    const permissionIds = [];
    for (const permissionName of formattedPermissions) {
      const permission = await Permission.findOneAndUpdate(
        { name: permissionName },
        { $setOnInsert: { name: permissionName } },
        { upsert: true, returnDocument: "after" },
      );
      permissionIds.push(permission._id);
    }

    const updatedRole = await Role.findOneAndUpdate(
      { _id: foundRole._id },
      { $set: { permissions: permissionIds } },
      { returnDocument: "after" },
    );

    return updatedRole;
  }

  return foundRole;
}
