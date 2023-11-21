/* eslint-disable @typescript-eslint/no-explicit-any */

import Contact from "../../../utils/interfaces/contact";
import InheritedItems from "../../inherited-items/inherited-items";
import InheritedTextList from "../../inherited-items/inherited-text-list";
import NotSelectedContacts from "./not-selected-contacts";

interface ContactsWithDrawerProps {
  loading: boolean;
  initialList: Contact[];
  currentItems: Contact[];
  property: string;
  onSubmit: (items: any[]) => void;
}

const ContactsWithDrawer = (props: ContactsWithDrawerProps) => {
  return (
    <InheritedItems
      drawerId="add-contacts"
      drawerTitle="Ajouter des Contacts"
      title="Contacts et Ressources"
      loading={props.loading}
      initialList={props.initialList}
      selectedItems={props.currentItems}
      property={props.property}
      onSubmit={props.onSubmit}
    >
      <InheritedTextList />
      <NotSelectedContacts />
    </InheritedItems>
  );
};

export default ContactsWithDrawer;
