import { FC } from "react";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";

const AddUserToGroupDrawer: FC<{ selectedUsers: Array<any> }> = ({
  selectedUsers,
}) => {
  return (
    <RightSideDrawer
      id="add-user-to-group"
      visible={false}
      title="Ajouter un Utilisateur à un Groupe"
    >
      {"toto"}
    </RightSideDrawer>
  );
};

export default AddUserToGroupDrawer;
