import { prisma } from "../../utils/db.ts";

async function getContacts() {
  const contacts = await prisma.contact.findMany();

  return contacts;
}

export default getContacts;
