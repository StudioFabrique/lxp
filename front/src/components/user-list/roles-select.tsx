import { FC, useContext, useState } from "react";
import { Context } from "../../store/context.store";

let roles = ["admin", "teacher", "student"];

const RoleSelect: FC<{
  onGroupRolesChange: (updatedRoles: Array<string>) => void;
}> = (props) => {
  const [newRoles, setNewRoles] = useState<Array<string>>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user } = useContext(Context);

  const handleSetNewRoles = (newRole: string) => {
    if (newRoles.includes(newRole)) {
      const updatedNewRoles = newRoles.filter((role) => role !== newRole);
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
    console.log("hello");

    props.onGroupRolesChange(newRoles);
    setDropdownOpen(false);
  };

  return (
    <div className="flex gap-x-4">
      <p>Changer les rôles des éléments sélectionnés</p>
      <div className="dropdown dropdown-end">
        <button
          className="btn btn-xs flex gap-x-2"
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
              <li className="bg-primary/20" key={role}>
                <div className="flex gap-x-4">
                  <input
                    className="checkbox checkbox-secondary"
                    type="checkbox"
                    checked={newRoles.includes(role)}
                    onChange={() => handleSetNewRoles(role)}
                  />
                  <p className="font-bold">{role}</p>
                </div>
              </li>
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
