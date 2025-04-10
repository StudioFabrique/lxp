import { FC, useMemo, useState } from "react";
import Role from "../../../utils/interfaces/role";
import Can from "../../UI/can/can.component";
import AddRoleDrawer from "./add-role-drawer.component";
import AddUserToGroupDrawer from "./add-user-to-group-drawer.component";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemsList: Array<any>;
  roleTab: Role;
  onGroupRolesChange: (updatedRoles: Array<Role>) => void;
  onUpdateManyStatus: (value: string) => void;
  onSendManyInvitations: () => void;
};

const DropdownActionsUser: FC<Props> = ({
  itemsList,
  roleTab,
  onGroupRolesChange,
  onUpdateManyStatus,
  onSendManyInvitations,
}) => {
  const [showDropDown, setShowDropDown] = useState(false);

  const handleAddRoleToUser = () => {
    setShowDropDown(false);
    document.getElementById("add-role")?.click();
  };

  const handleAddUserToGroup = () => {
    setShowDropDown(false);
    document.getElementById("add-user-to-group")?.click();
  };

  const anyItemSelected = useMemo(() => {
    return itemsList.some((item) => item.isSelected);
  }, [itemsList]);

  const dropDownStyle = useMemo(() => {
    return itemsList.some((item) => item.isSelected)
      ? "btn btn-ghost text-left"
      : "btn btn-ghost text-left text-base-content/50";
  }, [itemsList]);

  const handleUpdateManyStatus = (value: string) => {
    onUpdateManyStatus(value);
    setShowDropDown(false);
  };

  return (
    <>
      <div className="dropdown dropdown-bottom dropdown-end flex gap-y-4 z-50">
        <button
          className="btn btn-outline btn-sm btn-circle border-none text-primary"
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
          <div className="dropdown-content menu p-1 shadow-sm bg-base-100 rounded-box w-48 mt-4">
            <Can action="update" object={roleTab.role}>
              <button
                className={dropDownStyle}
                onClick={handleAddUserToGroup}
                disabled={!anyItemSelected}
              >
                Ajouter à un groupe
              </button>
            </Can>

            <Can action="update" object={roleTab.role}>
              <button
                className={dropDownStyle}
                disabled={!anyItemSelected}
                onClick={handleAddRoleToUser}
              >
                Ajouter un rôle
              </button>
            </Can>

            <Can action="update" object={roleTab.role}>
              <button
                className={dropDownStyle}
                onClick={() => handleUpdateManyStatus("actif")}
                disabled={!anyItemSelected}
              >
                Activer
              </button>
            </Can>

            <Can action="update" object={roleTab.role}>
              <button
                className={dropDownStyle}
                onClick={() => handleUpdateManyStatus("inactif")}
                disabled={!anyItemSelected}
              >
                Désactiver
              </button>
            </Can>

            <Can action="write" object={roleTab.role}>
              <button className={dropDownStyle} disabled={!anyItemSelected}>
                Supprimer
              </button>
            </Can>

            <Can action="update" object={roleTab.role}>
              <button
                className={dropDownStyle}
                onClick={onSendManyInvitations}
                disabled={!anyItemSelected}
              >
                Envoyer une invitation
              </button>
            </Can>
          </div>
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
