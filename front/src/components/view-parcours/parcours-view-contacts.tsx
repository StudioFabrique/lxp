import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";
import Contact from "../../utils/interfaces/contact";

const ParcoursViewContacts = () => {
  const contacts = useSelector(
    (state: any) => state.parcoursContacts.currentContacts
  ) as Contact[];

  const contactsList =
    contacts.length > 0 ? (
      contacts.map((contact) => (
        <div className="flex justify-between">
          <p>{contact.name}</p>
          <p>{contact.role}</p>
        </div>
      ))
    ) : (
      <p>Aucun contacts</p>
    );

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Ressources & Contacts</h2>
      <div>{contactsList}</div>
    </Wrapper>
  );
};

export default ParcoursViewContacts;
