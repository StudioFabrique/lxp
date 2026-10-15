import { ContactIcon } from "lucide-react";
import Contact from "../../../../../src/utils/interfaces/contact";
import BoxWrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { getContactFullName } from "../../../../utils/helpers/contact-full-name";
import { useRoleLabels } from "../../../role/hooks/useRoleLabels";

type ContactsProps = {
  contacts: Contact[];
};

const Contacts = ({ contacts }: ContactsProps) => {
  const { teamLabel } = useRoleLabels();
  return (
    <BoxWrapper className="w-full">
      <div className="flex flex-col gap-2 p-2">
        <div className="flex gap-2">
          <ContactIcon />
          <h3 className="text-xl font-bold">{teamLabel}</h3>
        </div>
        <ul className="list-disc pl-5">
          {contacts.map((contact) => (
            <li key={contact.id} className="capitalize">
              {getContactFullName(contact)}
            </li>
          ))}
        </ul>
      </div>
    </BoxWrapper>
  );
};

export default Contacts;
