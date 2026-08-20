import Role from "../../utils/interfaces/db/role.ts";
import User from "../../utils/interfaces/db/user.ts";
import { getPagination } from "../../utils/services/getPagination.ts";
import { isInvitationPending } from "../../utils/services/invitation-status.ts";

/**
 * Search users in the database based on various criteria.
 *
 * @param entity - The field to search by (e.g., "email", "createdAt", "isActive", etc.)
 * @param value - The value to search for (string or date, depending on entity)
 * @param role - The user role to filter by (or "everything" for all roles)
 * @param page - The page number for pagination (defaults to 1 if invalid)
 * @param limit - The number of results per page (defaults to 10 if invalid)
 * @param stype - The field to sort by
 * @param sdir - The sort direction ("asc" or "desc")
 * @returns An object containing the total number of results and the list of users, or false if no roles found
 *
 * The function supports:
 * - Filtering by role (or all roles)
 * - Searching by string fields (case-insensitive)
 * - Searching by creation date (returns users created on a specific day)
 * - Filtering by isActive status
 * - Pagination and sorting
 */
async function searchUser(
  entity: string,
  value: string,
  role: string,
  page: number,
  limit: number,
  stype: string,
  sdir: string
) {
  // Determine sort direction: 1 for ascending, -1 for descending
  const dir = sdir === "asc" ? 1 : -1;

  // Default page and limit if invalid
  if (isNaN(page)) page = 1;
  if (isNaN(limit)) limit = 10;

  // Using absolute values for page and limit to prevent errors due to possible negative values
  page = Math.abs(page);
  limit = Math.abs(limit);

  let fetchedRoles;

  // Fetch roles: all roles if "everything", or filter by specific role
  if (role === "everything") {
    fetchedRoles = await Role.find({}, { _id: 1 });
  } else {
    fetchedRoles = await Role.find({ role: role }, { _id: 1 });
  }

  // If no roles found, return false
  if (!fetchedRoles || fetchedRoles.length === 0) {
    throw { statusCode: 404, message: "Le rôle n'existe pas." };
  }

  let field: any;

  // Special handling for date search (createdAt)
  if (entity === "createdAt") {
    const startDate = new Date(value);
    const endDate = new Date(value);
    endDate.setDate(endDate.getDate() + 1); // Add 1 day to get the end of the range

    field = {
      $gte: startDate,
      $lt: endDate,
    };
  } else {
    // Default: case-insensitive regex search for string fields
    field = new RegExp(value, "i");
  }

  // Special handling for isActive field (exact match)
  if (entity === "isActive") {
    field = value;
  }

  // Query users with the specified criteria, excluding the password field
  const users = await User.find(
    { [entity]: field, roles: { $in: fetchedRoles } },
    { password: 0 }
  )
    .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 }) // Populate role details
    .sort({ [stype]: dir }) // Sort by specified field and direction
    .skip(getPagination(page, limit)) // Pagination: skip appropriate number of results
    .limit(limit); // Limit the number of results

  // Count total number of matching users for pagination
  const total = await User.count({
    [entity]: field,
    roles: { $in: fetchedRoles },
  });

  return {
    total,
    // Même état dérivé que la liste : l'indicateur d'envoi en cours ne doit pas
    // dépendre du fait qu'une recherche soit active ou non.
    users: users.map((user) => ({
      ...user.toObject(),
      invitationPending: isInvitationPending(user.invitationPendingSince),
    })),
  };
}

export default searchUser;
