import { FC, useContext, useState } from "react";
import { Context } from "../../store/context.store";
import Role from "../../utils/interfaces/role";
import { hasRole } from "../../utils/hasRole";

const RolesDropdown: FC<{
  userId: string;
  userRoles: Array<Role>;
  onRolesChange: (newRoles: Array<Role>, userId: string) => void;
}> = ({ userRoles, userId, onRolesChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [newRoles, setNewRoles] = useState<Array<Role>>(userRoles);
  const { user, roles } = useContext(Context);

  const handleShowDropDown = () => {
    setNewRoles(userRoles);
    setShowDropdown(true);
  };

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

  const handleSubmitChange = () => {
    onRolesChange(newRoles, userId);
    setShowDropdown(false);
  };

  return (
    <div className="dropdown dropdown-end flex gap-x-2 items-center">
      <div className="flex gap-x-2">
        {userRoles.map((role) => (
          <span key={role._id}>{role.label}</span>
        ))}
      </div>
      <button
        className="bg-primary rounded-full w-4 h-4"
        onMouseDown={handleShowDropDown}
      ></button>
      {showDropdown ? (
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {roles.map((role) => (
            <li className="bg-primary/20" key={role._id}>
              <div className="flex gap-x-4">
                <input
                  className="checkbox checkbox-secondary"
                  type="checkbox"
                  checked={hasRole(role.rank, newRoles)}
                  onChange={() => handleSetNewRoles(role)}
                />
                <p className="font-bold">{role.label}</p>
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
  );
};

export default RolesDropdown;
