import { ContactIcon } from "lucide-react";
import Contact from "../../../../../src/utils/interfaces/contact";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { getContactFullName } from "../../../../utils/helpers/contact-full-name";

type ContactsProps = {
  contacts: Contact[];
};

const Contacts = ({ contacts }: ContactsProps) => {
  return (
    <Wrapper additionalClassname="w-full">
      <div className="flex flex-col gap-2 p-2">
        <div className="flex gap-2">
          <ContactIcon />
          <h3 className="text-xl font-bold">Ressources pédagogiques</h3>
        </div>
        <ul className="list-disc pl-5">
          {contacts.map((contact) => (
            <li key={contact.id} className="capitalize">
              {getContactFullName(contact)}
            </li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
};

export default Contacts;
