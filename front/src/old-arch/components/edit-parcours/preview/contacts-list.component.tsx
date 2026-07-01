import Contact from "../../../utils/interfaces/contact";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import ContactItem from "../informations/contact-item";

interface ContactListProps {
  contactsList: Contact[];
}

const ContactsList = (props: ContactListProps) => {
  return (
    <ul className="flex flex-col gap-y-2">
      {props.contactsList.map((contact) => (
        <li key={contact.id}>
          <SubWrapper>
            <ContactItem user={contact} />
          </SubWrapper>
        </li>
      ))}
    </ul>
  );
};

export default ContactsList;
