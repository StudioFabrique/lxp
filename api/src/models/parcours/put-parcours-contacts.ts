import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import type { Contact } from "../../prisma/model-types.ts";

import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { prisma } from "../../utils/db.ts";
import { getAdmin } from "../../helpers/get-admin.ts";
import { removeParcoursContactsFromModules } from "./remove-parcours-contacts-from-modules.ts";

async function putParcoursContacts(
  parcoursId: number,
  newContacts: Array<any>,
  userId: string,
) {
  try {
    const transaction = await prisma.transaction(async (tx) => {
      const admin = await getAdmin(userId);
      const currentParcoursContacts =
        await tx.orm.public.ContactsOnParcours.where((row) =>
          whereFromObject(row, { parcoursId }),
        )
          .select("contactId")
          .all();

      if (newContacts.length === 0) {
        await removeParcoursContactsFromModules(
          tx,
          parcoursId,
          currentParcoursContacts.map(({ contactId }) => contactId),
        );
        const updatedParcours = await tx.orm.public.ContactsOnParcours.where(
          (row) => whereFromObject(row, { parcoursId }),
        )
          .deleteAndCount()
          .then((count) => ({ count }));
        return updatedParcours;
      }

      const contacts = await prisma.orm.public.Contact.all();

      const contactsToCreate = Array<Contact>();

      for (const newContact of newContacts) {
        const contact = contacts.find(
          (item: Contact) => item.idMdb === newContact.idMdb,
        );
        if (!contact) {
          contactsToCreate.push(newContact);
        }
      }

      if (contactsToCreate.length > 0) {
        await prisma.orm.public.Contact.createAndCount(
          contactsToCreate.map((contact) => ({
            idMdb: contact.idMdb,
            role: contact.role,
            email: contact.email,
            phone: contact.phone,
          })),
        ).then((count) => ({ count }));
      }

      const existingContacts = await prisma.orm.public.Contact.where((row) =>
        whereFromObject(row, {
          idMdb: {
            in: newContacts.map((item: any) => item.idMdb),
          },
        }),
      ).all();

      const existingParcours = await prisma.orm.public.Parcours.where((row) =>
        whereFromObject(row, { id: parcoursId }),
      )
        .include("admin", (related13) => related13.select("id"))
        .first();

      if (!existingParcours /* || admin.id !== existingParcours.admin.id */) {
        throw {
          message: "Vous n'avez pas accès à ce parcours",
          status: 403,
        };
      }
      const retainedContactIds = new Set(existingContacts.map(({ id }) => id));
      await removeParcoursContactsFromModules(
        tx,
        parcoursId,
        currentParcoursContacts
          .map(({ contactId }) => contactId)
          .filter((contactId) => !retainedContactIds.has(contactId)),
      );
      await tx.orm.public.ContactsOnParcours.where((row) =>
        whereFromObject(row, { parcoursId }),
      )
        .deleteAndCount()
        .then((count) => ({ count }));

      const updatedParcours = await prisma.orm.public.Parcours.where((row) =>
        whereFromObject(row, { id: parcoursId }),
      )
        .include("contacts", (related14) =>
          related14.include("contact", (related15) =>
            related15.select("id", "idMdb", "role"),
          ),
        )
        .update({
          contacts: (relation) =>
            relation.create(
              existingContacts.map((existingContact: Contact) => {
                return {
                  contact: {
                    connect: { id: existingContact.id },
                  },
                };
              }),
            ),
        })
        .then(requireDatabaseRow);
      return updatedParcours;
    });
    if (!("contacts" in transaction)) return transaction;

    const contacts = await enrichContactsWithNames(
      transaction.contacts.map(({ contact }) => contact),
    );
    return {
      ...transaction,
      contacts: contacts.map((contact) => ({ contact })),
    };
  } catch (error: any) {
    throw error;
  }
}

export default putParcoursContacts;
