import { FC } from "react";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import AddUserToGroup from "./add-user-to-group.component";

const AddUserToGroupDrawer: FC<{ selectedUsers: Array<any> }> = ({
  selectedUsers,
}) => {
  const handleCloseDrawer = (idDrawer: string) => {
    document.getElementById(idDrawer)?.click();
  };

  return (
    <RightSideDrawer
      id="add-user-to-group"
      visible={false}
      title="Ajouter des Utilisateurs à des Groupes"
      onCloseDrawer={handleCloseDrawer}
    >
      <AddUserToGroup selectedUsers={selectedUsers} />
    </RightSideDrawer>
  );
};

export default AddUserToGroupDrawer;
