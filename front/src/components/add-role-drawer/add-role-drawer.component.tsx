import React, { FC } from "react";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import DropDownRoles from "../lists/user-list/dropdown-roles.component";
import Role from "../../utils/interfaces/role";

const AddRoleDrawer: FC<{
  roleTab: Role;
  onGroupRolesChange: (updatedRoles: Array<Role>) => void;
}> = ({ roleTab, onGroupRolesChange }) => {
  return (
    <RightSideDrawer id="add-role" visible={false} title="Ajouter un Rôle">
      <DropDownRoles
        roleTab={roleTab}
        onGroupRolesChange={onGroupRolesChange}
      />
    </RightSideDrawer>
  );
};

export default AddRoleDrawer;
