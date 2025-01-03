import { resourcesRbac } from "./config/ressources-rbac";
import Permission from "../interfaces/db/permission";
import Role, { IRole } from "../interfaces/db/role";
import User from "../interfaces/db/user";
import {
  permissionsList,
  componentPermissionsList,
  layoutPermissionsList,
} from "./config/permissions-list";

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
 * Assigne le rôle 'user' à un utilisateur spécifique
 * @param userId - L'identifiant de l'utilisateur
 */
export async function assignRoleToUser(userId: string) {
  const userRole = await Role.findOne({ name: "user" });
  if (!userRole) {
    console.error("Le rôle n'existe pas");
    return;
  }

  const user = await User.findByIdAndUpdate(userId, {
    $addToSet: { roles: userRole._id },
  });

  if (!user) {
    console.log("L'utilisateur n'existe pas");
    return;
  }
}

/**
 * Assigne un rôle à un utilisateur et synchronise avec la base de données
 * @param userId - L'identifiant de l'utilisateur
 * @param role - Le rôle à assigner
 */
export async function assignRoleAndSync(userId: string, role: string) {
  const userRole = await Role.findOne({ name: role });
  if (!userRole) {
    throw new Error("Role not found");
  }

  const user = await User.findByIdAndUpdate(userId, {
    $addToSet: { roles: userRole._id },
  });

  if (!user) {
    throw new Error("User not found");
  }
}

/**
 * Récupère tous les rôles d'un utilisateur spécifique
 * @param userId - L'identifiant de l'utilisateur
 * @returns La liste des rôles de l'utilisateur
 */
export async function getRolesForUser(userId: string) {
  const user = await User.findById(userId).populate("roles");
  if (!user) {
    return [];
  }
  const roles = user.roles.map((role: IRole) => role.role);

  return roles;
}

export async function getAllRoles() {
  const roles = await Role.find({
    role: { $not: { $regex: "^interface:" } },
  }).populate("permissions");

  return roles.map((role) => {
    const permissions = role.permissions.map((perm) => perm.name);
    return {
      _id: role._id,
      role: role.role,
      label: role.label,
      rank: role.rank,
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

export async function getAllRolesWithSearch(search: string) {
  const query = {
    role: { $not: { $regex: "^interface:" } },
  };

  // Construction de la query avec la valeur de recherche
  // Recherche dans la propriété role mais aussi dans la propriété
  const queryWithSearch = {
    ...query,
    $or: [
      { role: { $regex: search, $options: "i" } },
      { label: { $regex: search, $options: "i" } },
    ],
  };
  const roles = await Role.find(queryWithSearch).populate("permissions");

  return roles.map((role) => {
    const permissions = role.permissions.map((perm) => perm.name);
    return {
      _id: role._id,
      role: role.role,
      label: role.label,
      rank: role.rank,
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

/**
 * Récupère la liste des utilisateurs ayant un rôle spécifique
 * @param role - Le rôle dont on veut récupérer les utilisateurs
 * @returns Une liste des identifiants utilisateurs ayant ce rôle
 */
export async function getUsersThatHaveRole(role: string) {
  const foundRole = await Role.findOne({ name: role });
  if (!foundRole) {
    console.log("Le rôle n'existe pas.");
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
export async function removeRoleFromUser(userId: string, role: string) {
  const userRole = await Role.findOne({ name: role });
  if (!userRole) {
    console.error(`Le rôle ${role} n'existe pas`);
    return;
  }

  const user = await User.findByIdAndUpdate(userId, {
    $pull: { roles: userRole._id },
  });

  if (user) {
    console.log(`Rôle ${role} retiré avec succès`);
  }
}

/**
 * Récupère toutes les permissions d'un rôle
 * @param role - Le nom du rôle
 * @returns La liste des permissions du rôle
 */
export async function getAllActionsPermissionsForRole(
  role:
    | { identifier: "_id"; _id: string }
    | { identifier: "role"; role: string },
): Promise<string[]> {
  const roleDoc = await (role.identifier === "_id"
    ? Role.findById(role._id)
    : Role.findOne({ role: role }));
  if (!roleDoc) {
    return [];
  }

  const permissions = await Permission.find({
    roles: roleDoc._id,
    name: { $not: { $regex: "^interface:" } },
  }).select("name -_id");
  const permissionList = permissions.map((p) => p.name);
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
  const user = await User.findById(userId).populate("roles");
  if (!user) {
    return [];
  }

  const roleIds = user.roles.map((role: IRole) => role._id);
  const permissions = await Permission.find({ roles: { $in: roleIds } }).select(
    "name -_id",
  );
  const permissionList = Array.from(new Set(permissions.map((p) => p.name)));

  return permissionList;
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
) {
  try {
    let formattedPermissions: string[] = [];

    if (permissions !== undefined) {
      if (
        !permissions.every((permission) =>
          resourcesRbac.map((r) => r.name).includes(permission.resource),
        )
      ) {
        throw new Error("Invalid resource in permissions");
      }

      formattedPermissions = permissions.flatMap((permission) =>
        permission.actions.map((action) => `${action}:${permission.resource}`),
      );
    }

    let foundRole;
    if (_id) {
      foundRole = await Role.findById(_id);
      if (foundRole) {
        foundRole = await Role.findByIdAndUpdate(
          _id,
          { role: roleName, label, rank },
          { new: true },
        );
      }
    }

    if (!foundRole) {
      foundRole = new Role({ role: roleName, label, rank });
      await foundRole.save();
    }

    // Only update permissions if they were provided
    if (permissions !== undefined) {
      // Remove existing role references from all permissions
      await Permission.updateMany(
        { roles: foundRole._id },
        { $pull: { roles: foundRole._id } },
      );

      const permissionIds = [];
      for (const permissionName of formattedPermissions) {
        const permission = await Permission.findOneAndUpdate(
          { name: permissionName },
          { $addToSet: { roles: foundRole._id } },
          { upsert: true, new: true },
        );
        permissionIds.push(permission._id);
      }

      const updatedRole = await Role.findOneAndUpdate(
        { _id: foundRole._id },
        { $set: { permissions: permissionIds } },
        { new: true },
      );

      return updatedRole;
    }

    return foundRole;
  } catch (error) {
    console.error(`Error creating role ${roleName}:`, error);
    throw new Error(`Failed to create role with permissions`);
  }
}

/**
 * Crée un rôle conçu pour conditionner l'affichage de l'interface avec des
 * dispositions et des permissions spécifiques
 * @param roleName - Le nom du rôle d'interface à créer
 * @param layouts - Les noms des dispositions à associer
 * @param components - Les composants à associer
 * @returns Promise<void>
 */
export async function createOrUpdateInterfaceRoleWithPermissions(
  roleName: string,
  layouts?: string[],
  components?: string[],
): Promise<void> {
  try {
    if (
      !(
        layouts?.every((layout) => layoutPermissionsList.includes(layout)) &&
        components?.every((component) =>
          componentPermissionsList.includes(component),
        )
      )
    ) {
      throw new Error("Invalid resource in permissions");
    }

    const formattedRoleName = `interface:${roleName}`;

    const layoutPermissions = layouts?.map((layout) => `layout:${layout}`);
    const componentsPermissions = components?.map(
      (component) => `component:${component}`,
    );
    const allPermissions = [
      ...(layoutPermissions || []),
      ...(componentsPermissions || []),
    ];

    let role = await Role.findOne({ name: formattedRoleName });
    if (!role) {
      role = new Role({ name: formattedRoleName });
      await role.save();
    }

    for (const permissionName of allPermissions) {
      await Permission.findOneAndUpdate(
        { name: permissionName },
        { $addToSet: { roles: role._id } },
        { upsert: true },
      );
    }
  } catch (error) {
    console.error(`Error creating interface role ${roleName}:`, error);
    throw new Error(`Failed to create interface role with permissions`);
  }
}
