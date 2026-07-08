/* eslint-disable @typescript-eslint/no-explicit-any */

import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import InheritedItems from "../../../../../../src.legacy/components/inherited-items/inherited-items";
import InheritedTextList from "../../../../../../src.legacy/components/inherited-items/inherited-text-list";
import NotSelectedContacts from "./not-selected-contacts";
import Contact from "../../../../../../src/utils/interfaces/contact";
import { useCallback, useEffect, useRef, useState } from "react";
import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";
import useHttp from "../../../../../../src/hooks/useHttp";
import User from "../../../../../../src/utils/interfaces/user";

interface ContactsWithDrawerProps {
  loading: boolean;
  onSubmit: (items: any[]) => void;
}

const ContactsWithDrawer = (props: ContactsWithDrawerProps) => {
  const [submit, setSubmit] = useState<boolean>(false);
  const isInitialRender = useRef(true);
  const dispatch = useParcoursDispatch();
  const { sendRequest } = useHttp();
  const currentContacts = useParcoursSelector(
    (state) => state.parcoursContacts.currentContacts
  );
  const initialContacts = useParcoursSelector(
    (state) => state.parcoursContacts.initialContacts
  );

  /**
   * met à jour la liste des contacts associés au parcours dans le state partagé
   */
  const handleUpdateContacts = useCallback(
    (contacts: Contact[]) => {
      setSubmit(true);
      dispatch({ type: "SET_CURRENT_CONTACTS", payload: contacts });
    },
    [dispatch]
  );

  /**
   * informe le composant parent qu'il peut initier la requête pour
   * mettre à jour la liste des contacts associés au parcours dans
   * la base de données
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (submit) {
        props.onSubmit(currentContacts);
        setSubmit(false);
      }
    }, autoSubmitTimer);
    return () => clearTimeout(timer);
  }, [props, submit, currentContacts]);

  /**
   * envoie une requête http pour récup la liste des formateurs et la stocke dans le state
   */
  useEffect(() => {
    const applyData = (data: Array<User>) => {
      dispatch({ type: "INIT_CONTACTS", payload: data });
    };
    if (isInitialRender.current) {
      sendRequest(
        {
          path: "/user/contacts",
        },
        applyData
      );
    } else {
      isInitialRender.current = false;
    }
  }, [dispatch, sendRequest]);

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
