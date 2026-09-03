import { type Contact } from "@prisma/client";

import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { prisma } from "../../utils/db.ts";
import { getAdmin } from "../../helpers/get-admin.ts";
import { removeParcoursContactsFromModules } from "./remove-parcours-contacts-from-modules.ts";

async function putParcoursContacts(
  parcoursId: number,
  newContacts: Array<any>,
  userId: string
) {
  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const admin = await getAdmin(userId);
      const currentParcoursContacts = await tx.contactsOnParcours.findMany({
        where: { parcoursId },
        select: { contactId: true },
      });

      if (newContacts.length === 0) {
        await removeParcoursContactsFromModules(
          tx,
          parcoursId,
          currentParcoursContacts.map(({ contactId }) => contactId),
        );
        const updatedParcours = await tx.contactsOnParcours.deleteMany({
          where: { parcoursId },
        });
        return updatedParcours;
      }

      const contacts = await prisma.contact.findMany();

      const contactsToCreate = Array<Contact>();

      for (const newContact of newContacts) {
        const contact = contacts.find(
          (item: Contact) => item.idMdb === newContact.idMdb
        );
        if (!contact) {
          contactsToCreate.push(newContact);
        }
      }

      if (contactsToCreate.length > 0) {
        await prisma.contact.createMany({
          data: contactsToCreate.map((contact) => ({
            idMdb: contact.idMdb,
            role: contact.role,
            email: contact.email,
            phone: contact.phone,
          })),
        });
      }

      const existingContacts = await prisma.contact.findMany({
        where: {
          idMdb: {
            in: newContacts.map((item: any) => item.idMdb),
          },
        },
      });

      const existingParcours = await prisma.parcours.findUnique({
        where: { id: parcoursId },
        select: { admin: { select: { id: true } } },
      });

      if (!existingParcours /* || admin.id !== existingParcours.admin.id */) {
        throw {
          message: "Vous n'avez pas accès à ce parcours",
          status: 403,
        };
      }
      const retainedContactIds = new Set(
        existingContacts.map(({ id }) => id),
      );
      await removeParcoursContactsFromModules(
        tx,
        parcoursId,
        currentParcoursContacts
          .map(({ contactId }) => contactId)
          .filter((contactId) => !retainedContactIds.has(contactId)),
      );
      await tx.contactsOnParcours.deleteMany({
        where: { parcoursId },
      });

      const updatedParcours = await prisma.parcours.update({
        where: { id: parcoursId },
        data: {
          contacts: {
            create: existingContacts.map((existingContact: Contact) => {
              return {
                contact: {
                  connect: { id: existingContact.id },
                },
              };
            }),
          },
        },
        select: {
          contacts: {
            select: {
              contact: {
                select: {
                  id: true,
                  idMdb: true,
                  role: true,
                },
              },
            },
          },
        },
      });
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
