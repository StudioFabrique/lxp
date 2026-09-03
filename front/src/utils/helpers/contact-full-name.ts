import type Contact from "../interfaces/contact";

export const getContactFullName = (
  contact: Pick<Contact, "firstname" | "lastname">,
) =>
  [contact.firstname, contact.lastname].filter(Boolean).join(" ").trim() ||
  "Ressource supprimée";
