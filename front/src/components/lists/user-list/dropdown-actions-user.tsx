import { FC, useState } from "react";
import Role from "../../../utils/interfaces/role";
import Can from "../../UI/can/can.component";
import AddRoleDrawer from "./add-role-drawer.component";
import AddUserToGroupDrawer from "./add-user-to-group-drawer.component";

type Props = {
  itemsList: Array<any>;
  roleTab: Role;
  onGroupRolesChange: (updatedRoles: Array<Role>) => void;
  onUpdateManyStatus: (value: string) => void;
};

const DropdownActionsUser: FC<Props> = ({
  itemsList,
  roleTab,
  onGroupRolesChange,
  onUpdateManyStatus,
}) => {
  const [showDropDown, setShowDropDown] = useState(false);

  const handleAddRoleToUser = () => {
    if (!setDropDownStyle()) {
      setShowDropDown(false);
      document.getElementById("add-role")?.click();
    }
  };

  const handleAddUserToGroup = () => {
    if (!setDropDownStyle()) {
      setShowDropDown(false);
      document.getElementById("add-user-to-group")?.click();
    }
  };

  const setDropDownStyle = () => {
    return itemsList.some((item) => item.isSelected)
      ? ""
      : "text-base-content/50";
  };

  const handleUpdateManyStatus = (value: string) => {
    onUpdateManyStatus(value);
    setShowDropDown(false);
  };

  return (
    <>
      <div className="dropdown dropdown-bottom dropdown-end flex gap-y-4 w-fit z-50">
        <button
          className="btn btn-outline btn-sm border-none text-primary"
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
            className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-fit mt-4"
          >
            <Can action="update" subject={roleTab.role}>
              <li onClick={handleAddUserToGroup}>
                <p className={setDropDownStyle()}>Ajouter à un groupe</p>
              </li>
            </Can>

            <Can action="update" subject={roleTab.role}>
              <li onClick={handleAddRoleToUser}>
                <p className={setDropDownStyle()}>Ajouter un rôle</p>
              </li>
            </Can>

            <Can action="update" subject={roleTab.role}>
              <li>
                <p
                  className={setDropDownStyle()}
                  onClick={() => handleUpdateManyStatus("actif")}
                >
                  Activer
                </p>
              </li>
            </Can>

            <Can action="update" subject={roleTab.role}>
              <li>
                <p
                  className={setDropDownStyle()}
                  onClick={() => handleUpdateManyStatus("inactif")}
                >
                  Désactiver
                </p>
              </li>
            </Can>

            <Can action="write" subject={roleTab.role}>
              <li>
                <p className={setDropDownStyle()}>Supprimer</p>
              </li>
            </Can>
          </ul>
        ) : null}
      </div>
      {roleTab ? (
        <>
          <AddRoleDrawer
            roleTab={roleTab}
            onGroupRolesChange={onGroupRolesChange}
          />
          <AddUserToGroupDrawer selectedUsers={itemsList} />
        </>
      ) : null}
    </>
  );
};

export default DropdownActionsUser;
