import { Contact } from "@prisma/client";

import { prisma } from "../../utils/db";
import { getAdmin } from "../../helpers/get-admin";

async function putParcoursContacts(
  parcoursId: number,
  newContacts: Array<any>,
  userId: string
) {
  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const admin = await getAdmin(userId);

      if (newContacts.length === 0) {
        const updatedParcours = await prisma.contactsOnParcours.deleteMany({
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
          data: contactsToCreate,
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

      if (!existingParcours || admin.id !== existingParcours.admin.id) {
        throw {
          message: "Vous n'avez pas accès à ce parcours",
          status: 403,
        };
      }
      await prisma.contactsOnParcours.deleteMany({
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
      });
      return updatedParcours;
    });
    return transaction;
  } catch (error: any) {
    throw error;
  }
}

export default putParcoursContacts;
