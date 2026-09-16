import User from "../utils/interfaces/db/user.ts";

type ContactReference = {
  idMdb: string;
};

type ContactName = {
  firstname: string;
  lastname: string;
};

export type ContactWithNames<T extends ContactReference> = T & ContactName;

/**
 * Ajoute aux références PostgreSQL le prénom et le nom conservés dans MongoDB.
 * La requête est groupée pour ne pas interroger MongoDB contact par contact.
 */
export async function enrichContactsWithNames<T extends ContactReference>(
  contacts: readonly (T | null)[],
): Promise<Array<ContactWithNames<T>>> {
  const existingContacts = contacts.filter((contact): contact is T => contact !== null);
  if (existingContacts.length === 0) return [];

  const ids = [...new Set(existingContacts.map(({ idMdb }) => idMdb))];
  const users = await User.find(
    { _id: { $in: ids } },
    { _id: 1, firstname: 1, lastname: 1 },
  ).lean();
  const namesById = new Map<string, ContactName>(
    users.map((user) => [
      user._id.toString(),
      {
        firstname: user.firstname,
        lastname: user.lastname,
      },
    ]),
  );

  return existingContacts.map((contact) => ({
    ...contact,
    firstname: namesById.get(contact.idMdb)?.firstname ?? "",
    lastname: namesById.get(contact.idMdb)?.lastname ?? "",
  }));
}
