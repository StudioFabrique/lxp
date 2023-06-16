import { FC } from "react";
import { DrawerProvider } from "../../../store/drawer.store";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import AddUserToGroup from "./add-user-to-group.component";

const AddUserToGroupDrawer: FC<{ selectedUsers: Array<any> }> = ({
  selectedUsers,
}) => {
  return (
    <DrawerProvider>
      <RightSideDrawer
        id="add-user-to-group"
        visible={false}
        title="Ajouter un Utilisateur à un Groupe"
      >
        <AddUserToGroup selectedUsers={selectedUsers} />
      </RightSideDrawer>
    </DrawerProvider>
  );
};

export default AddUserToGroupDrawer;
