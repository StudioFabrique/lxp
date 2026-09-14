import Role from "../../utils/interfaces/db/role.ts";
import User from "../../utils/interfaces/db/user.ts";
import { prisma } from "../../utils/db.ts";

/** Remplace le rôle unique, après validation de l'ensemble du lot. */
async function updateUserRoles(usersToUpdate: string[], rolesId: string[]) {
  if (!Array.isArray(rolesId) || rolesId.length !== 1) {
    throw { statusCode: 400, message: "Un utilisateur doit avoir exactement un rôle." };
  }
  if (!Array.isArray(usersToUpdate) || usersToUpdate.length === 0 ||
      new Set(usersToUpdate).size !== usersToUpdate.length) {
    throw { statusCode: 400, message: "La liste d'utilisateurs est invalide." };
  }
  const role = await Role.findById(rolesId[0]);
  if (!role) throw { statusCode: 404, message: "Le rôle n'existe pas." };
  // La création/promotion root passe par les parcours dédiés avec clé serveur.
  if (role.rank === 0) {
    throw { statusCode: 403, message: "Utilisez le parcours de promotion root avec une clé d'activation." };
  }
  const users = await User.find({ _id: { $in: usersToUpdate } }).populate("roles");
  if (users.length !== usersToUpdate.length) {
    throw { statusCode: 404, message: "Un ou plusieurs utilisateurs n'existent pas." };
  }
  if (users.some((user) => user.roles.length !== 1 ||
      user.roles[0].rank === 0 || (role.rank <= 2) !== (user.roles[0].rank <= 2))) {
    throw { statusCode: 400, message: "Un ou plusieurs utilisateurs ne peuvent pas être mis à jour." };
  }

  // Aucune écriture SQL avant validation : un lot refusé ne doit pas modifier
  // les contacts pédagogiques des utilisateurs.
  if (role.rank === 2) {
    await prisma.contact.createMany({
      data: users.map((user) => ({
        idMdb: user._id.toString(), role: "équipe pédagogique", email: user.email,
      })),
      skipDuplicates: true,
    });
  } else {
    await prisma.contact.deleteMany({
      where: { idMdb: { in: usersToUpdate }, role: "équipe pédagogique" },
    });
  }
  return User.updateMany(
    { _id: { $in: usersToUpdate } },
    { $set: { roles: [role._id] } },
    { runValidators: true },
  );
}

export default updateUserRoles;
