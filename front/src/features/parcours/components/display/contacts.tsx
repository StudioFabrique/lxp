import { useContext } from "react";
import { Mail, Phone } from "lucide-react";
import { AuthContext } from "../../../../store/AuthProvider";
import { useParams } from "react-router";
import { useParcoursQuery } from "../../hooks/useParcoursQuery";
import { AbilityContext } from "../../../../rbac/AbilityProvider";
import { getContactFullName } from "../../../../utils/helpers/contact-full-name";
import CollapsibleSection from "./collapsible-section";

const Contacts = () => {
  const { user } = useContext(AuthContext);
  const ability = useContext(AbilityContext);
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(id ? Number(id) : undefined);
  const contacts = parcours?.contacts ?? [];

  if (contacts.length === 0) return null;

  const previewContacts = contacts.slice(0, 2);
  const remainingContacts = contacts.length - previewContacts.length;

  const contactsList = contacts.map((contact) => (
    <div
      key={contact.id}
      className="flex flex-col bg-base-200 border border-base-300 p-4 rounded-lg text-base-content"
    >
      <span className="flex justify-between items-center">
        <p className="capitalize font-bold text-primary">
          {getContactFullName(contact)}
        </p>
        <p className="capitalize text-xs opacity-70">{contact.role}</p>
      </span>
      <span className="text-xs flex flex-col items-start opacity-80">
        {contact.email && (
          <p className="flex gap-x-2 items-center">
            <Mail className="w-3 h-3" /> {contact.email ?? "Non renseigné"}
          </p>
        )}
        {user &&
        contact.phone &&
        ability.can("update", "parcours") &&
        parcours?.canManage !== false ? (
          <div className="flex items-center gap-x-2">
            <Phone className="w-3 h-3" />
            <p>{contact.phone ?? "Non renseigné"}</p>
          </div>
        ) : null}
      </span>
    </div>
  ));

  return (
    <CollapsibleSection
      title="Ressources pédagogiques"
      preview={
        <span className="flex min-w-0 flex-col gap-1.5 text-sm">
          {previewContacts.map((contact, index) => (
            <span
              key={contact.id}
              className="flex min-w-0 items-center justify-between gap-3"
            >
              <span className="truncate font-semibold text-primary">
                {getContactFullName(contact)}
              </span>
              <span className="shrink-0 text-xs capitalize opacity-60">
                {contact.role}
                {index === previewContacts.length - 1 && remainingContacts > 0
                  ? ` +${remainingContacts}`
                  : ""}
              </span>
            </span>
          ))}
        </span>
      }
    >
      <div className="flex flex-col gap-y-2 overflow-y-auto max-h-72">
        {contactsList}
      </div>
    </CollapsibleSection>
  );
};

export default Contacts;
