import { FC, useContext, useState } from "react";
import { Context } from "../../store/context.store";
import Role from "../../utils/interfaces/role";
import { hasRole } from "../../utils/hasRole";
import Can from "../UI/can/can.component";

const RoleSelect: FC<{
  roleTab: Role;
  onGroupRolesChange: (updatedRoles: Array<Role>) => void;
}> = (props) => {
  const [newRoles, setNewRoles] = useState<Array<Role>>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { roles } = useContext(Context);

  const handleSetNewRoles = (newRole: Role) => {
    if (newRoles.find((role) => role._id === newRole._id)) {
      const updatedNewRoles = newRoles.filter(
        (role) => role._id !== newRole._id
      );
      setNewRoles(updatedNewRoles);
    } else {
      setNewRoles((prevNewRoles) => [...prevNewRoles, newRole]);
    }
  };

  const handleToggleDropdown = () => {
    setNewRoles([]);

    setDropdownOpen(true);
  };

  const handleSubmitChange = () => {
    props.onGroupRolesChange(newRoles);
    setDropdownOpen(false);
  };

  return (
    <div className="flex gap-x-4">
      <p className="text-xs flex items-center">
        Changer les rôles des éléments sélectionnés
      </p>
      <div className="dropdown dropdown-end">
        <button
          className="btn btn-accent btn-xs flex gap-x-2"
          onClick={handleToggleDropdown}
        >
          rôles
        </button>
        {dropdownOpen ? (
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {roles.map((role) => (
              <>
                {props.roleTab.rank === role.rank ? (
                  <Can action={"update"} subject={role.role}>
                    <li className="bg-primary/20" key={role._id}>
                      <div className="flex gap-x-4">
                        <input
                          className="checkbox checkbox-secondary"
                          type="checkbox"
                          checked={hasRole(role.role, newRoles)}
                          onChange={() => handleSetNewRoles(role)}
                        />
                        <p className="font-bold">{role.label}</p>
                      </div>
                    </li>
                  </Can>
                ) : null}
              </>
            ))}
            <li>
              <button
                className="btn btn-secondary mt-2"
                onMouseDown={handleSubmitChange}
              >
                Valider
              </button>
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default RoleSelect;
