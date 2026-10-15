/* eslint-disable @typescript-eslint/no-explicit-any */
import Contact from "../../../utils/interfaces/contact";
import InheritedItems from "./inherited-items";
import InheritedTextList from "./inherited-text-list";
import NotSelectedContacts from "./not-selected-contacts";
import { useRoleLabels } from "../../../features/role/hooks/useRoleLabels";

interface ContactsWithDrawerProps {
  loading: boolean;
  initialList: Contact[];
  currentItems: Contact[];
  property: string | string[];
  onSubmit: (items: any[]) => void;
}

const ContactsWithDrawer = (props: ContactsWithDrawerProps) => {
  const { teamLabel } = useRoleLabels();
  return (
    <InheritedItems
      drawerId="add-contacts"
      drawerTitle={`Ajouter des membres « ${teamLabel} »`}
      title={teamLabel}
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
