/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import ContactItem from "./contact-item";
import Contact from "../../../utils/interfaces/contact";
import useHttp from "../../../hooks/use-http";
import User from "../../../utils/interfaces/user";
import { parcoursContactsAction } from "../../../store/redux-toolkit/parcours/parcours-contacts";
import SearchDropdown from "../../UI/search-dropdown/search-dropdown";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import UserQuickCreate from "../../user-quick-create/user-quick-create";

type Props = {
  contacts: any[];
  notSelectedContacts: Contact[];
  setSubmit: (value: boolean) => void;
};

type Teacher = {
  firstname: string;
  lastname: string;
  email: string;
  nickname?: string;
  address?: string;
  city?: string;
  postCode?: string;
  phoneNumber?: string;
  isActive: boolean;
};

const Contacts: FC<Props> = ({ setSubmit, contacts, notSelectedContacts }) => {
  const dispatch = useDispatch();
  const { sendRequest, error } = useHttp();

  const filteredContacts = useSelector(
    (state: any) => state.parcoursContacts.filteredContacts
  );

  // reset le filtre
  const handleResetFilter = useCallback(() => {
    dispatch(parcoursContactsAction.resetFilter());
  }, [dispatch]);

  const handleAddContact = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (name: string, _property: string) => {
      const contact = notSelectedContacts.find(
        (item: Contact) => item.name === name
      );
      if (contact) {
        setSubmit(true);
        dispatch(parcoursContactsAction.addContact(contact.idMdb));
        handleResetFilter();
      }
    },
    [notSelectedContacts, setSubmit, dispatch, handleResetFilter]
  );

  const handleRemoveContact = (contact: Contact) => {
    const contactId = contacts.find(
      (item: Contact) => item.idMdb === contact.idMdb
    ).idMdb;
    if (contactId) {
      setSubmit(true);
      dispatch(parcoursContactsAction.removeContact(contactId));
    }
  };

  // créé la liste de contacts à afficher dans le dropdown
  const handleFilterContacts = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (name: string, _poperty: string) => {
      dispatch(parcoursContactsAction.filterContacts(name));
    },
    [dispatch]
  );

  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  /**
   * envoi d'une requête pour enregistrer dans la bdd un formateur créé à la volée
   */
  const submitNewTeacher = (teacher: Teacher) => {
    const processData = (data: {
      success: boolean;
      message: string;
      contact: User;
    }) => {
      if (data.success) {
        toast.success(data.message);
        dispatch(parcoursContactsAction.addNewContact(data.contact));
        dispatch(parcoursContactsAction.setNotSelectedContacts());
      }
    };
    sendRequest(
      {
        path: "/user/new-teacher",
        method: "post",
        body: teacher,
      },
      processData
    );
  };

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      {contacts && contacts.length < 0 ? null : (
        <div className="w-full flex flex-col gap-y-4">
          <h3 className="w-full font-bold text-xl">Ressources et Contacts</h3>
          <div className="w-full flex gap-x-2">
            <SearchDropdown
              addItem={handleAddContact}
              filterItems={handleFilterContacts}
              resetFilterItems={handleResetFilter}
              filteredItems={filteredContacts}
              property="name"
              placeHolder="Ajouter un nouveau contact..."
            />
            <RightSideDrawer
              id="new-contact"
              title="Ajouter un Formateur"
              //onCloseDrawer={handleCloseDrawer}
            >
              <UserQuickCreate
                onCloseDrawer={handleCloseDrawer}
                onSubmitUser={submitNewTeacher}
              />
            </RightSideDrawer>
          </div>
          <ul className="flex flex-col gap-y-2">
            {contacts && contacts.length > 0
              ? contacts.map((user: Contact) => (
                  <li
                    className="bg-base-100 px-4 py-2 rounded-lg"
                    key={user.idMdb}
                  >
                    <ContactItem
                      user={user}
                      onRemoveUser={handleRemoveContact}
                    />
                  </li>
                ))
              : null}
          </ul>
        </div>
      )}
    </>
  );
};

export default Contacts;
