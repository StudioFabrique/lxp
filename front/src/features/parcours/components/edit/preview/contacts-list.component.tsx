import Contact from "../../../../../../src/utils/interfaces/contact";
import SubWrapper from "../../../../../../src/components/wrappers/SubBoxWrapper";
import ContactItem from "../informations/contact-item";
import { useRoleLabels } from "../../../../role/hooks/useRoleLabels";

interface ContactListProps {
  contactsList: Contact[];
}

const ContactsList = (props: ContactListProps) => {
  const { teamLabel } = useRoleLabels();
  if (props.contactsList.length === 0) {
    return <SubWrapper>Aucun membre « {teamLabel} » renseigné</SubWrapper>;
  }

  return (
    <ul className="flex flex-col gap-y-2">
      {props.contactsList?.map((contact) => (
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
