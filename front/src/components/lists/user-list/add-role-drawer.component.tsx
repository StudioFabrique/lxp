import { FC } from "react";
import Role from "../../../utils/interfaces/role";
import { DrawerProvider } from "../../../store/drawer.store";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import DropDownRoles from "./dropdown-roles.component";

const AddRoleDrawer: FC<{
  roleTab: Role;
  onGroupRolesChange: (updatedRoles: Array<Role>) => void;
}> = ({ roleTab, onGroupRolesChange }) => {
  const handleCloseDrawer = (idDrawer: string) => {
    document.getElementById(idDrawer)?.click();
  };

  return (
    <DrawerProvider>
      <RightSideDrawer
        id="add-role"
        visible={false}
        title="Ajouter un Rôle à un Utilisateur"
        onCloseDrawer={handleCloseDrawer}
      >
        <DropDownRoles
          roleTab={roleTab}
          onGroupRolesChange={onGroupRolesChange}
          drawerId="add-role"
        />
      </RightSideDrawer>
    </DrawerProvider>
  );
};

export default AddRoleDrawer;
