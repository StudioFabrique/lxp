import InheritedItems from "../../../../../../src/components/shared/inherited-items/inherited-items";
import InheritedTextList from "../../../../../../src/components/shared/inherited-items/inherited-text-list";
import NotSelectedContacts from "./not-selected-contacts";
import Contact from "../../../../../../src/utils/interfaces/contact";
import { useCallback, useEffect, useMemo, useState } from "react";
import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";
import { useParcoursContactsQuery } from "../../../hooks/useParcoursContactsQuery";
import { useParams } from "react-router";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";

interface ContactsWithDrawerProps {
  loading: boolean;
  onSubmit: (items: Contact[]) => void;
}

const ContactsWithDrawer = (props: ContactsWithDrawerProps) => {
  const [submit, setSubmit] = useState<boolean>(false);
  const { data: availableContacts } = useParcoursContactsQuery();
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(id ? Number(id) : undefined);
  const [draftContacts, setDraftContacts] = useState<Contact[] | null>(null);
  const currentContacts = useMemo(
    () => draftContacts ?? parcours?.contacts ?? [],
    [draftContacts, parcours?.contacts],
  );

  const handleUpdateContacts = useCallback(
    (contacts: Contact[]) => {
      setSubmit(true);
      setDraftContacts(contacts);
    },
    [],
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

  return (
    <>
      {availableContacts ? (
        <InheritedItems
          drawerId="add-contacts"
          drawerTitle="Ajouter des Contacts"
          title="Ressources Pédagogiques"
          loading={props.loading}
          initialList={availableContacts}
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
