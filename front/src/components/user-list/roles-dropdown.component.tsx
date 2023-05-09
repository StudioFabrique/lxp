import { FC, useContext, useState } from "react";
import { Context } from "../../store/context.store";

let roles = ["admin", "teacher", "student"];

const RolesDropdown: FC<{
  userId: string;
  userRoles: Array<string>;
  onRolesChange: (newRoles: Array<string>, userId: string) => void;
}> = ({ userRoles, userId, onRolesChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [newRoles, setNewRoles] = useState<Array<string>>(userRoles);
  const { user } = useContext(Context);

  const handleShowDropDown = () => {
    if (!showDropdown) {
      setNewRoles(userRoles);
    }
    setShowDropdown(true);
  };

  const handleSetNewRoles = (newRole: string) => {
    if (newRoles.includes(newRole)) {
      const updatedNewRoles = newRoles.filter((role) => role !== newRole);
      setNewRoles(updatedNewRoles);
    } else {
      setNewRoles((prevNewRoles) => [...prevNewRoles, newRole]);
    }
  };

  const handleSubmitChange = () => {
    console.log("hello");
    onRolesChange(newRoles, userId);
    setShowDropdown(false);
  };

  return (
    <div className="dropdown dropdown-end">
      <button className="flex gap-x-2" onClick={handleShowDropDown}>
        {userRoles.map((role) => (
          <span key={role}>{role}</span>
        ))}
      </button>
      {showDropdown ? (
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
  );
};

export default RolesDropdown;
