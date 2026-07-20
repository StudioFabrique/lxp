import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import InheritedItems from "../../../../../../src/components/shared/inherited-items/inherited-items";
import InheritedTextList from "../../../../../../src/components/shared/inherited-items/inherited-text-list";
import NotSelectedContacts from "./not-selected-contacts";
import Contact from "../../../../../../src/utils/interfaces/contact";
import { useCallback, useEffect, useState } from "react";
import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";
import { useParcoursContactsQuery } from "../../../hooks/useParcoursQuery";

interface ContactsWithDrawerProps {
  loading: boolean;
  onSubmit: (items: Contact[]) => void;
}

const ContactsWithDrawer = (props: ContactsWithDrawerProps) => {
  const [submit, setSubmit] = useState<boolean>(false);
  const { data: availableContacts } = useParcoursContactsQuery();
  const dispatch = useParcoursDispatch();
  const currentContacts = useParcoursSelector(
    (state) => state.parcoursContacts.currentContacts
  );
  const initialContacts = useParcoursSelector(
    (state) => state.parcoursContacts.initialContacts
  );

  const handleUpdateContacts = useCallback(
    (contacts: Contact[]) => {
      setSubmit(true);
      dispatch({ type: "SET_CURRENT_CONTACTS", payload: contacts });
    },
    [dispatch]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (submit) {
        props.onSubmit(currentContacts);
        setSubmit(false);
      }
    }, autoSubmitTimer);
    return () => clearTimeout(timer);
  }, [props, submit, currentContacts]);

  useEffect(() => {
    if (availableContacts) {
      dispatch({ type: "INIT_CONTACTS", payload: availableContacts });
    }
  }, [availableContacts, dispatch]);

  return (
    <>
      {initialContacts ? (
        <InheritedItems
          drawerId="add-contacts"
          drawerTitle="Ajouter des Contacts"
          title="Ressources Pédagogiques"
          loading={props.loading}
          initialList={initialContacts}
          selectedItems={currentContacts}
          property="name"
          onSubmit={handleUpdateContacts}
        >
          <InheritedTextList additionalProperty="role" />
          <NotSelectedContacts />
        </InheritedItems>
      ) : null}
    </>
  );
};

export default ContactsWithDrawer;
