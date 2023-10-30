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
        <div
          key={contact.id}
          className="flex justify-between bg-secondary p-4 rounded-lg text-secondary-content"
        >
          <p className="capitalize">{contact.name}</p>
          <p className="font-bold capitalize">{contact.role}</p>
        </div>
      ))
    ) : (
      <p>Aucun contacts</p>
    );

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Ressources & Contacts</h2>
      <div className="flex flex-col gap-y-5 overflow-y-auto h-[60vh]">
        {contactsList}
      </div>
    </Wrapper>
  );
};

export default ParcoursViewContacts;
