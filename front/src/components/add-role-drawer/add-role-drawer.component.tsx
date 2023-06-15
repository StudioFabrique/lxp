import { FC } from "react";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import DropDownRoles from "../lists/user-list/dropdown-roles.component";
import Role from "../../utils/interfaces/role";
import { DrawerProvider } from "../../store/drawer.store";

const AddRoleDrawer: FC<{
  roleTab: Role;
  onGroupRolesChange: (updatedRoles: Array<Role>) => void;
}> = ({ roleTab, onGroupRolesChange }) => {
  return (
    <DrawerProvider>
      <RightSideDrawer
        id="add-role"
        visible={false}
        title="Ajouter un Rôle à un Utilisateur"
      >
        <DropDownRoles
          roleTab={roleTab}
          onGroupRolesChange={onGroupRolesChange}
        />
      </RightSideDrawer>
    </DrawerProvider>
  );
};

export default AddRoleDrawer;
