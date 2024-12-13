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
      permCount: {
        read: permissions.filter((perm) => perm.startsWith("read:")).length,
        write: permissions.filter((perm) => perm.startsWith("write:")).length,
        update: permissions.filter((perm) => perm.startsWith("update:")).length,
        delete: permissions.filter((perm) => perm.startsWith("delete:")).length,
      },
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
  console.log({ users: userIds });
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
  role: string,
): Promise<string[]> {
  const roleDoc = await Role.findOne({ role: role });
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
  permissions: {
    resource: string;
    actions: Array<"read" | "write" | "update" | "delete">;
  }[],
): Promise<void> {
  try {
    if (
      !permissions.every((permission) =>
        permissionsList.includes(permission.resource),
      )
    ) {
      throw new Error("Invalid resource in permissions");
    }

    const formattedPermissions = permissions.flatMap((permission) =>
      permission.actions.map((action) => `${action}:${permission.resource}`),
    );

    let role = await Role.findOne({ name: roleName });
    if (!role) {
      role = new Role({ name: roleName, label: label });
      await role.save();
    }

    for (const permissionName of formattedPermissions) {
      await Permission.findOneAndUpdate(
        { name: permissionName },
        { $addToSet: { roles: role._id } },
        { upsert: true },
      );
    }
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
export async function createOrUpdateRoleWithInterfacePermissions(
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
