import Role from "../../utils/interfaces/db/role";
import User from "../../utils/interfaces/db/user";
import { prisma } from "../../utils/db";

/**
 * Updates roles for multiple users with proper authorization checks
 *
 * This function validates that users exist, roles are valid, and ensures proper
 * role hierarchy constraints are respected before updating user roles in bulk.
 *
 * @param usersToUpdate - Array of user MongoDB IDs to update
 * @param rolesId - Array of role MongoDB IDs to assign to the users
 * @returns Promise<BulkWriteResult> - MongoDB bulk operation result
 * @throws Error with message and statusCode for various validation failures
 */
async function updateUserRoles(
  usersToUpdate: Array<string>,
  rolesId: Array<string>
) {
  // Fetch existing users with their current roles (including rank for authorization)
  let actualUsers = await User.find({ _id: usersToUpdate }).populate("roles", {
    rank: 1,
  });

  // Validate that users exist
  if (!actualUsers) {
    throw {
      message: "Aucun utilisateur trouvé avec les ID fournis.",
      statusCode: 404,
    };
  }

  // Fetch the roles to be assigned
  let roles = await Role.find({ _id: rolesId });
  {
    // Validate that roles exist
    if (!roles || roles.length === 0) {
      throw {
        message: "Aucun rôle trouvé avec les ID fournis.",
        statusCode: 404,
      };
    }
  }

  if (roles.some((role) => role.rank == 2))
    await prisma.contact.createMany({
      data: actualUsers.map((user) => ({
        idMdb: user._id.toString(),
        name: `${user.firstname} ${user.lastname}`,
        role: "équipe pédagogique",
        email: user.email,
      })),
      skipDuplicates: true,
    });
  else
    await prisma.contact.deleteMany({
      where: {
        idMdb: { in: actualUsers.map((user) => user._id.toString()) },
        role: "équipe pédagogique",
      },
    });

  // Generate interface role names for additional role lookup
  const tmp = roles.map((role) => `interface:${role.role}`);

  // Find corresponding interface roles that should be included
  const rolesToSet = await Role.find({ role: { $in: tmp } });

  // Combine base roles with their corresponding interface roles
  roles = [...roles, ...rolesToSet];

  console.log("ROLES TO SET", rolesToSet);

  // Verify that all requested users were found (data integrity check)
  if (actualUsers.length !== usersToUpdate.length) {
    throw {
      message: "Un ou plusieurs utilisateurs n'existent pas.",
      statusCode: 404,
    };
  }

  // Authorization check: Ensure role hierarchy constraints are respected
  // This prevents unauthorized role escalation/demotion based on rank system
  for (let i = 0; i < usersToUpdate.length; i++) {
    for (const role of roles) {
      // Check if trying to assign high-rank role to low-rank user (escalation)
      if (role.rank > 2 && actualUsers[i].roles[0].rank <= 2) {
        throw {
          message:
            "Un ou plusieurs utilisateurs ne peuvent pas être mis à jour.",
          statusCode: 400,
        };
      }
      // Check if trying to assign low-rank role to high-rank user (demotion)
      else if (role.rank <= 2 && actualUsers[i].roles[0].rank > 2) {
        throw {
          message:
            "Un ou plusieurs utilisateurs ne peuvent pas être mis à jour.",
          statusCode: 400,
        };
      }
    }
  }

  // Debug logging: Display current user roles before update
  for (const actualUser of actualUsers) {
    console.log("ACTUAL USER ROLES", actualUser.roles);
  }

  // Prepare bulk update operations for efficient database modification
  const bulkUpdate = usersToUpdate.map((student: string) => {
    return {
      updateOne: {
        filter: {
          _id: student,
        },
        update: {
          roles, // Replace existing roles with new role set
        },
      },
    };
  });

  // Execute bulk update operation on all users simultaneously
  const updatedUsers = await User.bulkWrite(bulkUpdate);

  return updatedUsers;
}

export default updateUserRoles;
