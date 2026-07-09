/* eslint-disable @typescript-eslint/no-explicit-any */
import Contact from "../../utils/interfaces/contact";
import InheritedItems from "./inherited-items";
import InheritedTextList from "./inherited-text-list";
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
      drawerTitle="Ajouter des ressources pédagogiques"
      title="Ressources pédagogiques"
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
