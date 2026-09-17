import { and } from "@prisma/orm-postgres/orm-client";

import Role, { type IRole } from "../../utils/interfaces/db/role.ts";
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
  const users = await User.find({ _id: { $in: usersToUpdate } }).populate<{
    roles: IRole[];
  }>("roles");
  if (users.length !== usersToUpdate.length) {
    throw {
      statusCode: 404,
      message: "Un ou plusieurs utilisateurs n'existent pas.",
    };
  }
  if (
    users.some((user) => user.roles.length !== 1 || user.roles[0].rank === 0)
  ) {
    throw {
      statusCode: 400,
      message: "Un ou plusieurs utilisateurs ne peuvent pas être mis à jour.",
    };
  }

  // Aucune écriture SQL n'est effectuée avant la validation complète du lot.
  await prisma.transaction(async (tx) => {
    if (role.rank <= 2) {
      const existingAdmins = await tx.orm.public.Admin.where((row) =>
        row.idMdb.in(usersToUpdate),
      )
        .select("idMdb")
        .all();
      const existingAdminIds = new Set(
        existingAdmins.map(({ idMdb }) => idMdb),
      );
      const missingAdmins = usersToUpdate
        .filter((idMdb) => !existingAdminIds.has(idMdb))
        .map((idMdb) => ({ idMdb }));

      if (missingAdmins.length > 0) {
        await tx.orm.public.Admin.createAndCount(missingAdmins).then(
          (count) => ({ count }),
        );
      }
    }

    if (role.rank === 2) {
      await tx.orm.public.Contact.createAndCount(
        users.map((user) => ({
          idMdb: user._id.toString(),
          role: "équipe pédagogique",
          email: user.email,
        })),
      ).then((count) => ({ count }));
    } else {
      const contacts = await tx.orm.public.Contact.where((row) =>
        row.idMdb.in(usersToUpdate),
      )
        .select("id")
        .all();
      const contactIds = contacts.map(({ id }) => id);

      // Les liaisons Contact utilisent RESTRICT : un formateur affecté doit
      // être détaché avant que sa fiche pédagogique puisse être supprimée.
      if (contactIds.length > 0) {
        await tx.orm.public.ContactsOnCourse.where((row) =>
          row.contactId.in(contactIds),
        )
          .deleteAndCount()
          .then((count) => ({ count }));
        await tx.orm.public.ContactsOnModule.where((row) =>
          row.contactId.in(contactIds),
        )
          .deleteAndCount()
          .then((count) => ({ count }));
        await tx.orm.public.ContactsOnParcours.where((row) =>
          row.contactId.in(contactIds),
        )
          .deleteAndCount()
          .then((count) => ({ count }));
        await tx.orm.public.Contact.where((row) => row.id.in(contactIds))
          .deleteAndCount()
          .then((count) => ({ count }));
      }
    }

    if (role.rank === 3) {
      await tx.orm.public.Student.createAndCount(
        users.map((user) => ({ idMdb: user._id.toString() })),
      ).then((count) => ({ count }));
    }

    if (role.rank > 2) {
      await tx.orm.public.Teacher.where((row) => row.idMdb.in(usersToUpdate))
        .deleteAndCount()
        .then((count) => ({ count }));

      const admins = await tx.orm.public.Admin.where((row) =>
        row.idMdb.in(usersToUpdate),
      )
        .select("id")
        .all();

      if (admins.length > 0) {
        if (!replacementOwnerId) {
          throw {
            statusCode: 409,
            message:
              "Impossible de modifier ces rôles : aucun autre compte ne peut reprendre les contenus pédagogiques.",
          };
        }
        const replacementAdmin = await tx.orm.public.Admin.where((row) =>
          and(
            row.idMdb.eq(replacementOwnerId),
            row.id.notIn(admins.map(({ id }) => id)),
          ),
        )
          .select("id")
          .first();
        if (!replacementAdmin) {
          throw {
            statusCode: 409,
            message:
              "Impossible de modifier ces rôles : aucun autre compte ne peut reprendre les contenus pédagogiques.",
          };
        }

        const previousAdminIds = admins.map(({ id }) => id);
        await tx.orm.public.Activity.where((row) =>
          row.authorId.in(previousAdminIds),
        )
          .updateAndCount({ authorId: replacementAdmin.id })
          .then((count) => ({ count }));
        await tx.orm.public.BonusActivity.where((row) =>
          row.adminId.in(previousAdminIds),
        )
          .updateAndCount({ adminId: replacementAdmin.id })
          .then((count) => ({ count }));
        await tx.orm.public.Course.where((row) =>
          row.adminId.in(previousAdminIds),
        )
          .updateAndCount({ adminId: replacementAdmin.id })
          .then((count) => ({ count }));
        await tx.orm.public.Formation.where((row) =>
          row.adminId.in(previousAdminIds),
        )
          .updateAndCount({ adminId: replacementAdmin.id })
          .then((count) => ({ count }));
        await tx.orm.public.Lesson.where((row) =>
          row.adminId.in(previousAdminIds),
        )
          .updateAndCount({ adminId: replacementAdmin.id })
          .then((count) => ({ count }));
        await tx.orm.public.Mediatheque.where((row) =>
          row.authorId.in(previousAdminIds),
        )
          .updateAndCount({ authorId: replacementAdmin.id })
          .then((count) => ({ count }));
        await tx.orm.public.Module.where((row) =>
          row.adminId.in(previousAdminIds),
        )
          .updateAndCount({ adminId: replacementAdmin.id })
          .then((count) => ({ count }));
        await tx.orm.public.Parcours.where((row) =>
          row.adminId.in(previousAdminIds),
        )
          .updateAndCount({ adminId: replacementAdmin.id })
          .then((count) => ({ count }));
        await tx.orm.public.Resource.where((row) =>
          row.adminId.in(previousAdminIds),
        )
          .updateAndCount({ adminId: replacementAdmin.id })
          .then((count) => ({ count }));
        await tx.orm.public.Admin.where((row) => row.id.in(previousAdminIds))
          .deleteAndCount()
          .then((count) => ({ count }));
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
