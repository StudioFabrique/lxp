/* eslint-disable @typescript-eslint/no-explicit-any */

import { useDispatch, useSelector } from "react-redux";
import InheritedItems from "../../inherited-items/inherited-items";
import InheritedTextList from "../../inherited-items/inherited-text-list";
import NotSelectedContacts from "./not-selected-contacts";
import Contact from "../../../utils/interfaces/contact";
import { useCallback, useEffect, useRef, useState } from "react";
import { parcoursContactsAction } from "../../../store/redux-toolkit/parcours/parcours-contacts";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import useHttp from "../../../hooks/use-http";
import User from "../../../utils/interfaces/user";

interface ContactsWithDrawerProps {
  loading: boolean;
  onSubmit: (items: any[]) => void;
}

const ContactsWithDrawer = (props: ContactsWithDrawerProps) => {
  const [submit, setSubmit] = useState<boolean>(false);
  const isInitialRender = useRef(true);
  const dispatch = useDispatch();
  const { sendRequest } = useHttp();
  const currentContacts = useSelector(
    (state: any) => state.parcoursContacts.currentContacts
  ) as Contact[];
  const initialContacts = useSelector(
    (state: any) => state.parcoursContacts.initialContacts
  ) as Contact[];

  /**
   * met à jour la liste des contacts associés au parcours dans le state partagé
   */
  const handleUpdateContacts = useCallback(
    (contacts: Contact[]) => {
      setSubmit(true);
      dispatch(parcoursContactsAction.setCurrentContacts(contacts));
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
   * envoie une requête http pour récup la liste des formateurs et la stocke dans un slice redux
   */
  useEffect(() => {
    const applyData = (data: Array<User>) => {
      dispatch(parcoursContactsAction.initContacts(data));
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
      {initialContacts && initialContacts.length > 0 ? (
        <InheritedItems
          drawerId="add-contacts"
          drawerTitle="Ajouter des Contacts"
          title="Contacts et Ressources"
          loading={props.loading}
          initialList={initialContacts}
          selectedItems={currentContacts}
          property="name"
          onSubmit={handleUpdateContacts}
        >
          <InheritedTextList />
          <NotSelectedContacts />
        </InheritedItems>
      ) : null}
    </>
  );
};

export default ContactsWithDrawer;
