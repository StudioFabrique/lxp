import Contact from "../../utils/interfaces/contact";
import Wrapper from "../UI/wrapper/wrapper.component";

type ContactsProps = {
  contacts: Contact[];
};

const Contacts = ({ contacts }: ContactsProps) => {
  return (
    <Wrapper>
      <div className="flex flex-col gap-2 p-2">
        <h3 className="text-xl font-bold">Ressources & Contacts</h3>
        <ul className="list-disc pl-5">
          {contacts.map((contact) => (
            <li key={contact.id}>{contact.name}</li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
};

export default Contacts;
