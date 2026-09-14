import Role from "../../utils/interfaces/db/role.ts";
import User from "../../utils/interfaces/db/user.ts";
import { prisma } from "../../utils/db.ts";

/** Remplace le rôle unique, après validation de l'ensemble du lot. */
async function updateUserRoles(
  usersToUpdate: string[],
  rolesId: string[],
  replacementOwnerId?: string,
) {
  if (!Array.isArray(rolesId) || rolesId.length !== 1) {
    throw {
      statusCode: 400,
      message: "Un utilisateur doit avoir exactement un rôle.",
    };
  }
  if (
    !Array.isArray(usersToUpdate) ||
    usersToUpdate.length === 0 ||
    new Set(usersToUpdate).size !== usersToUpdate.length
  ) {
    throw {
      statusCode: 400,
      message: "La liste d'utilisateurs est invalide.",
    };
  }
  const role = await Role.findById(rolesId[0]);
  if (!role) throw { statusCode: 404, message: "Le rôle n'existe pas." };
  // La création/promotion root passe par les parcours dédiés avec clé serveur.
  if (role.rank === 0) {
    throw {
      statusCode: 403,
      message:
        "Utilisez le parcours de promotion root avec une clé d'activation.",
    };
  }
  const users = await User.find({ _id: { $in: usersToUpdate } }).populate(
    "roles",
  );
  if (users.length !== usersToUpdate.length) {
    throw {
      statusCode: 404,
      message: "Un ou plusieurs utilisateurs n'existent pas.",
    };
  }
  if (
    users.some(
      (user) =>
        user.roles.length !== 1 ||
        user.roles[0].rank === 0,
    )
  ) {
    throw {
      statusCode: 400,
      message:
        "Un ou plusieurs utilisateurs ne peuvent pas être mis à jour.",
    };
  }

  // Aucune écriture SQL n'est effectuée avant la validation complète du lot.
  await prisma.$transaction(async (tx) => {
    if (role.rank <= 2) {
      const existingAdmins = await tx.admin.findMany({
        where: { idMdb: { in: usersToUpdate } },
        select: { idMdb: true },
      });
      const existingAdminIds = new Set(
        existingAdmins.map(({ idMdb }) => idMdb),
      );
      const missingAdmins = usersToUpdate
        .filter((idMdb) => !existingAdminIds.has(idMdb))
        .map((idMdb) => ({ idMdb }));

      if (missingAdmins.length > 0) {
        await tx.admin.createMany({ data: missingAdmins });
      }
    }

    if (role.rank === 2) {
      await tx.contact.createMany({
        data: users.map((user) => ({
          idMdb: user._id.toString(),
          role: "équipe pédagogique",
          email: user.email,
        })),
        skipDuplicates: true,
      });
    } else {
      const contacts = await tx.contact.findMany({
        where: { idMdb: { in: usersToUpdate } },
        select: { id: true },
      });
      const contactIds = contacts.map(({ id }) => id);

      // Les liaisons Contact utilisent RESTRICT : un formateur affecté doit
      // être détaché avant que sa fiche pédagogique puisse être supprimée.
      if (contactIds.length > 0) {
        await tx.contactsOnCourse.deleteMany({
          where: { contactId: { in: contactIds } },
        });
        await tx.contactsOnModule.deleteMany({
          where: { contactId: { in: contactIds } },
        });
        await tx.contactsOnParcours.deleteMany({
          where: { contactId: { in: contactIds } },
        });
        await tx.contact.deleteMany({ where: { id: { in: contactIds } } });
      }
    }

    if (role.rank === 3) {
      await tx.student.createMany({
        data: users.map((user) => ({ idMdb: user._id.toString() })),
        skipDuplicates: true,
      });
    }

    if (role.rank > 2) {
      await tx.teacher.deleteMany({ where: { idMdb: { in: usersToUpdate } } });

      const admins = await tx.admin.findMany({
        where: { idMdb: { in: usersToUpdate } },
        select: { id: true },
      });

      if (admins.length > 0) {
        if (!replacementOwnerId) {
          throw {
            statusCode: 409,
            message:
              "Impossible de modifier ces rôles : aucun autre compte ne peut reprendre les contenus pédagogiques.",
          };
        }
        const replacementAdmin = await tx.admin.findFirst({
          where: {
            idMdb: replacementOwnerId,
            id: { notIn: admins.map(({ id }) => id) },
          },
          select: { id: true },
        });
        if (!replacementAdmin) {
          throw {
            statusCode: 409,
            message:
              "Impossible de modifier ces rôles : aucun autre compte ne peut reprendre les contenus pédagogiques.",
          };
        }

        const previousAdminIds = { in: admins.map(({ id }) => id) };
        await tx.activity.updateMany({
          where: { authorId: previousAdminIds },
          data: { authorId: replacementAdmin.id },
        });
        await tx.bonusActivity.updateMany({
          where: { adminId: previousAdminIds },
          data: { adminId: replacementAdmin.id },
        });
        await tx.course.updateMany({
          where: { adminId: previousAdminIds },
          data: { adminId: replacementAdmin.id },
        });
        await tx.formation.updateMany({
          where: { adminId: previousAdminIds },
          data: { adminId: replacementAdmin.id },
        });
        await tx.lesson.updateMany({
          where: { adminId: previousAdminIds },
          data: { adminId: replacementAdmin.id },
        });
        await tx.mediatheque.updateMany({
          where: { authorId: previousAdminIds },
          data: { authorId: replacementAdmin.id },
        });
        await tx.module.updateMany({
          where: { adminId: previousAdminIds },
          data: { adminId: replacementAdmin.id },
        });
        await tx.parcours.updateMany({
          where: { adminId: previousAdminIds },
          data: { adminId: replacementAdmin.id },
        });
        await tx.resource.updateMany({
          where: { adminId: previousAdminIds },
          data: { adminId: replacementAdmin.id },
        });
        await tx.admin.deleteMany({ where: { id: previousAdminIds } });
      }
    }
  });
  return User.updateMany(
    { _id: { $in: usersToUpdate } },
    { $set: { roles: [role._id] } },
    { runValidators: true },
  );
}

export default updateUserRoles;
