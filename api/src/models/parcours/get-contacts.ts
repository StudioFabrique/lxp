import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { prisma } from "../../utils/db.ts";

async function getContacts() {
  const contacts = await prisma.contact.findMany();

  return enrichContactsWithNames(contacts);
}

export default getContacts;
