/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";
import { ContactWithMail } from "../../utils/interfaces/contact";

const Contacts = () => {
  const contacts = useSelector(
    (state: any) => state.parcoursContacts.currentContacts
  ) as ContactWithMail[];

  const contactsList =
    contacts.length > 0 ? (
      contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex flex-col bg-secondary p-4 rounded-lg text-secondary-content"
        >
          <span className="flex justify-between items-center">
            <p className="capitalize font-bold">{contact.name}</p>
            <p className="capitalize text-xs">{contact.role}</p>
          </span>
          <p className="text-xs underline">
            {contact.email ?? "Non renseigné"}
          </p>
        </div>
      ))
    ) : (
      <p>Aucun contacts</p>
    );

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">
        Ressources pédagogiques
      </h2>
      <div className="flex flex-col gap-y-5 overflow-y-auto h-[60vh]">
        {contactsList}
      </div>
    </Wrapper>
  );
};

export default Contacts;
