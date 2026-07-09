import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import InheritedItems from "../../../../../../src/components/inherited-items/inherited-items";
import InheritedTextList from "../../../../../../src/components/inherited-items/inherited-text-list";
import NotSelectedContacts from "./not-selected-contacts";
import Contact from "../../../../../../src/utils/interfaces/contact";
import { useCallback, useEffect, useRef, useState } from "react";
import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";
import toast from "react-hot-toast";
import { parcoursApi } from "../../../api/parcours.api";

interface ContactsWithDrawerProps {
  loading: boolean;
  onSubmit: (items: any[]) => void;
}

const ContactsWithDrawer = (props: ContactsWithDrawerProps) => {
  const [submit, setSubmit] = useState<boolean>(false);
  const hasFetched = useRef(false);
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
    if (!hasFetched.current) {
      hasFetched.current = true;
      parcoursApi.queries
        .getContacts()
        .then((data) => {
          dispatch({ type: "INIT_CONTACTS", payload: data });
        })
        .catch(() => toast.error("Erreur lors du chargement des contacts"));
    }
  }, [dispatch]);

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
