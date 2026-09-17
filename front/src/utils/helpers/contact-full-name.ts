import { toTitleCase } from "./text-helpers";
import type Contact from "../interfaces/contact";

export const getContactFullName = (
  contact: Pick<Contact, "firstname" | "lastname">,
) =>
  toTitleCase([contact.firstname, contact.lastname].filter(Boolean).join(" ").trim()) ||
  "Ressource supprimée";
