import mongoose from "mongoose";
import User from "../../utils/interfaces/db/user.ts";

export type UserIdentity = {
  id: string;
  firstname: string;
  lastname: string;
  roleLabel: string | null;
};

/**
 * Identités minimales (nom, prénom, rôle) pour rattacher un identifiant relevé
 * dans les journaux à une personne, à l'affichage seulement.
 *
 * Sans filtre de rang, contrairement à `getUsersByIds` : le root consulte les
 * journaux de tous les comptes, dont les siens. Ni email ni mot de passe ne
 * sont lus.
 */
export default async function getUserIdentitiesByIds(
  userIds: string[],
): Promise<UserIdentity[]> {
  const validIds = [...new Set(userIds)].filter((userId) =>
    mongoose.isValidObjectId(userId),
  );
  if (validIds.length === 0) return [];

  const users = await User.find(
    { _id: { $in: validIds.map((userId) => new mongoose.Types.ObjectId(userId)) } },
    { firstname: 1, lastname: 1, roles: 1 },
  )
    .populate("roles", { label: 1 })
    .lean();

  return users.map((user) => {
    const [role] = (user.roles ?? []) as unknown as { label?: string }[];
    return {
      id: user._id.toString(),
      firstname: user.firstname,
      lastname: user.lastname,
      roleLabel: role?.label ?? null,
    };
  });
}
