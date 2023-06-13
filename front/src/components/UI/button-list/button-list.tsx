import { FC, useState } from "react";
import RightSideDrawer from "../right-side-drawer/right-side-drawer";
import RoleSelect from "../../lists/user-list/dropdown-roles.component";
import Role from "../../../utils/interfaces/role";
import Can from "../can/can.component";

const ButtonList: FC<{
  itemsList: Array<any>;
  roleTab: Role;
  onGroupRolesChange: (updatedRoles: Array<Role>) => void;
}> = ({ itemsList, roleTab, onGroupRolesChange }) => {
  const [showDropDown, setShowDropDown] = useState(false);

  const handleAddRoleToUser = () => {
    setShowDropDown(false);
    document.getElementById("my-drawer-4")?.click();
  };

  const countSelectedItems = () => {
    let selectedItemsCounter = 0;
    itemsList.forEach((item) => {
      if (item.isSelected) {
        selectedItemsCounter++;
      }
    });
    return selectedItemsCounter;
  };

  return (
    <>
      <div className="dropdown dropdown-bottom dropdown-end flex gap-y-4 w-full">
        <button
          className="btn btn-outline border-none text-primary"
          onClick={() => setShowDropDown(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {showDropDown ? (
          <ul
            tabIndex={0}
            className="dropdown-content menu p-1 shadow bg-base-100 z-50 rounded-box w-full mt-4   "
          >
            <Can action="update" subject="roleTab.role">
              <li onClick={handleAddRoleToUser}>
                <p>Ajouter un rôle</p>
              </li>
            </Can>

            <li>
              <p>Désactiver</p>
            </li>
            <li>
              <p>Supprimer</p>
            </li>
          </ul>
        ) : null}
      </div>
      <RightSideDrawer visible={false} title="Ajouter un Rôle">
        <RoleSelect roleTab={roleTab} onGroupRolesChange={onGroupRolesChange} />
      </RightSideDrawer>
    </>
  );
};

export default ButtonList;
