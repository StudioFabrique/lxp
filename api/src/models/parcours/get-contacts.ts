import { prisma } from "../../utils/db";

async function getContacts() {
  const contacts = await prisma.contact.findMany();

  return contacts;
}

export default getContacts;
