import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import removeUserFromGroups from "./remove-user-from-groups.ts";

/**
 * Supprime un utilisateur et les données PostgreSQL qui représentent son rôle.
 *
 * Les contenus créés par un administrateur ou un formateur sont conservés :
 * leur propriété est transférée à l'utilisateur qui effectue la suppression.
 * Les affectations pédagogiques d'un formateur sont, elles, détachées.
 * Les traces d'apprentissage d'un apprenant sont supprimées par les cascades
 * déclarées dans le schéma Prisma.
 */
export default async function deleteUser(userId: string, connectedId: string) {
  if (userId === connectedId) {
    throw {
      message: "Vous ne pouvez pas supprimer votre propre compte.",
      statusCode: 400,
    };
  }

  const userToDelete = await User.findById(userId).select({ _id: 1 }).lean();

  if (!userToDelete) {
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };
  }

  await prisma.transaction(async (tx) => {
    /*
     * Un formateur peut être affecté à plusieurs niveaux. Les tables de
     * liaison utilisent RESTRICT côté Contact : on les vide explicitement
     * avant de supprimer sa fiche PostgreSQL.
     */
    const contact = await tx.orm.public.Contact.where((row) =>
      whereFromObject(row, { idMdb: userId }),
    )
      .select("id")
      .first();

    if (contact) {
      await tx.orm.public.ContactsOnCourse.where((row) =>
        whereFromObject(row, { contactId: contact.id }),
      )
        .deleteAndCount()
        .then((count) => ({ count }));
      await tx.orm.public.ContactsOnModule.where((row) =>
        whereFromObject(row, { contactId: contact.id }),
      )
        .deleteAndCount()
        .then((count) => ({ count }));
      await tx.orm.public.ContactsOnParcours.where((row) =>
        whereFromObject(row, { contactId: contact.id }),
      )
        .deleteAndCount()
        .then((count) => ({ count }));
      await tx.orm.public.Contact.where((row) =>
        whereFromObject(row, { id: contact.id }),
      )
        .delete()
        .then(requireDatabaseRow);
    }

    // Ancienne représentation, encore présente dans certaines installations.
    await tx.orm.public.Teacher.where((row) =>
      whereFromObject(row, { idMdb: userId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));

    /*
     * Admin sert aussi de propriétaire technique aux contenus créés par les
     * formateurs. Supprimer directement cette ligne déclenche notamment
     * Formation_adminId_fkey (RESTRICT). On transfère donc toutes les
     * références vers l'administrateur connecté avant la suppression.
     */
    const adminsToDelete = await tx.orm.public.Admin.where((row) =>
      whereFromObject(row, { idMdb: userId }),
    )
      .select("id")
      .all();

    if (adminsToDelete.length > 0) {
      const replacementAdmin = await tx.orm.public.Admin.where((row) =>
        whereFromObject(row, { idMdb: connectedId }),
      )
        .select("id")
        .first();

      if (!replacementAdmin) {
        throw {
          statusCode: 409,
          message:
            "Impossible de supprimer cet utilisateur : aucun autre compte ne peut reprendre ses contenus pédagogiques.",
        };
      }

      const adminIds = adminsToDelete.map(({ id }) => id);
      const fromDeletedAdmins = { in: adminIds };

      await tx.orm.public.Activity.where((row) =>
        whereFromObject(row, { authorId: fromDeletedAdmins }),
      )
        .updateAndCount({ authorId: replacementAdmin.id })
        .then((count) => ({ count }));
      await tx.orm.public.BonusActivity.where((row) =>
        whereFromObject(row, { adminId: fromDeletedAdmins }),
      )
        .updateAndCount({ adminId: replacementAdmin.id })
        .then((count) => ({ count }));
      await tx.orm.public.Course.where((row) =>
        whereFromObject(row, { adminId: fromDeletedAdmins }),
      )
        .updateAndCount({ adminId: replacementAdmin.id })
        .then((count) => ({ count }));
      await tx.orm.public.Formation.where((row) =>
        whereFromObject(row, { adminId: fromDeletedAdmins }),
      )
        .updateAndCount({ adminId: replacementAdmin.id })
        .then((count) => ({ count }));
      await tx.orm.public.Lesson.where((row) =>
        whereFromObject(row, { adminId: fromDeletedAdmins }),
      )
        .updateAndCount({ adminId: replacementAdmin.id })
        .then((count) => ({ count }));
      await tx.orm.public.Mediatheque.where((row) =>
        whereFromObject(row, { authorId: fromDeletedAdmins }),
      )
        .updateAndCount({ authorId: replacementAdmin.id })
        .then((count) => ({ count }));
      await tx.orm.public.Module.where((row) =>
        whereFromObject(row, { adminId: fromDeletedAdmins }),
      )
        .updateAndCount({ adminId: replacementAdmin.id })
        .then((count) => ({ count }));
      await tx.orm.public.Parcours.where((row) =>
        whereFromObject(row, { adminId: fromDeletedAdmins }),
      )
        .updateAndCount({ adminId: replacementAdmin.id })
        .then((count) => ({ count }));
      await tx.orm.public.Resource.where((row) =>
        whereFromObject(row, { adminId: fromDeletedAdmins }),
      )
        .updateAndCount({ adminId: replacementAdmin.id })
        .then((count) => ({ count }));
      await tx.orm.public.Admin.where((row) =>
        whereFromObject(row, { id: { in: adminIds } }),
      )
        .deleteAndCount()
        .then((count) => ({ count }));
    }

    // Les accomplissements et autres traces progressives suivent en cascade.
    await tx.orm.public.Student.where((row) =>
      whereFromObject(row, { idMdb: userId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));

    /*
     * Les groupes MongoDB portent eux aussi la relation vers l'utilisateur.
     * La supprimer uniquement depuis la collection User laissait donc des
     * ObjectId orphelins dans Group.users, visibles notamment dans le compteur
     * d'apprenants.
     *
     * MongoDB n'est pas transactionnel avec PostgreSQL. Ces opérations sont
     * placées en dernier dans le callback : toute erreur Mongo annule les
     * changements Prisma tant que leur transaction n'est pas encore validée.
     * Le retrait des groupes précède la suppression du compte ; si cette
     * dernière échoue exceptionnellement, le compte reste récupérable plutôt
     * que d'être supprimé en laissant à nouveau des références orphelines.
     */
    await removeUserFromGroups(userToDelete._id);

    const deletion = await User.deleteOne({ _id: userId });
    if (deletion.deletedCount !== 1) {
      throw {
        statusCode: 404,
        message: "L'utilisateur n'existe plus.",
      };
    }
  });
}
