import { Contact, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function putParcoursContacts(
  parcoursId: number,
  newContacts: Array<any>
) {
  const contacts = await prisma.contact.findMany();

  const contactsToCreate = Array<Contact>();

  for (const newContact of newContacts) {
    const contact = contacts.find(
      (item: Contact) => (item.idMdb = newContact.idMdb)
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
  console.log({ existingContacts });

  const existingParcours = await prisma.parcours.findUnique({
    where: { id: parcoursId },
  });

  if (!existingParcours) {
    throw new Error(`Le parcours avec l'id : ${parcoursId} n'existe pas`);
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
}

export default putParcoursContacts;
