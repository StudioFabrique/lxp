import User from "../../utils/interfaces/db/user.ts";
import deleteUser from "./delete-user.ts";

/** Valide toute la sélection avant d'appliquer les suppressions une à une. */
export default async function deleteManyUsers(
  userIds: string[],
  connectedId: string,
) {
  const uniqueIds = [...new Set(userIds)];

  if (uniqueIds.includes(connectedId)) {
    throw {
      statusCode: 400,
      message: "Vous ne pouvez pas supprimer votre propre compte.",
    };
  }

  const existingUsersCount = await User.countDocuments({
    _id: { $in: uniqueIds },
  });
  if (existingUsersCount !== uniqueIds.length) {
    throw {
      statusCode: 404,
      message: "Un ou plusieurs utilisateurs n'existent pas.",
    };
  }

  for (const userId of uniqueIds) {
    await deleteUser(userId, connectedId);
  }
}
