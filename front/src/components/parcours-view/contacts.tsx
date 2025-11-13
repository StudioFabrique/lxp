/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";
import { ContactWithMail } from "../../utils/interfaces/contact";
import { useContext } from "react";
import { Mail, Phone } from "lucide-react";
import { Context } from "../../store/context.store";

const Contacts = () => {
  const { user } = useContext(Context);
  const contacts = useSelector(
    (state: any) => state.parcoursContacts.currentContacts
  ) as ContactWithMail[];

  const contactsList =
    contacts.length > 0 ? (
      contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex flex-col bg-secondary p-4 rounded-lg text-base-content"
        >
          <span className="flex justify-between items-center">
            <p className="capitalize font-bold">{contact.name}</p>
            <p className="capitalize text-xs">{contact.role}</p>
          </span>
          <span className="text-xs flex flex-col items-start opacity-80">
            <p className="flex gap-x-2 items-center">
              <Mail className="w-3 h-3" /> {contact.email ?? "Non renseigné"}
            </p>
            {user && user.roles[0].rank < 3 ? (
              <div className="flex items-center gap-x-2">
                <Phone className="w-3 h-3" />
                <p>{contact.phone ?? "Non renseigné"}</p>
              </div>
            ) : null}
          </span>
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
      <div className="flex flex-col gap-y-2 overflow-y-auto h-[60vh]">
        {contactsList}
      </div>
    </Wrapper>
  );
};

export default Contacts;
