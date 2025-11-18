import { ContactIcon } from "lucide-react";
import Contact from "../../../utils/interfaces/contact";
import Wrapper from "../../UI/wrapper/wrapper.component";

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
              {contact.name}
            </li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
};

export default Contacts;
