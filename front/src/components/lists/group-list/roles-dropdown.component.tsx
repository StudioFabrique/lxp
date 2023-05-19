import { FC, useContext, useState } from "react";
import { Context } from "../../../store/context.store";
import Role from "../../../utils/interfaces/role";
import { hasRole } from "../../../utils/hasRole";
import { Link } from "react-router-dom";
import { sortArray } from "../../../utils/sortArray";

const RolesDropdown: FC<{
  groupId: string;
  groupRoles: Array<Role>;
  onRolesChange: (newRoles: Array<Role>, groupId: string) => void;
}> = ({ groupRoles, groupId, onRolesChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [newRoles, setNewRoles] = useState<Array<Role>>(groupRoles);
  const { roles } = useContext(Context);

  const handleShowDropDown = () => {
    setNewRoles(groupRoles);
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
    onRolesChange(sortArray(newRoles, "rank"), groupId);
    setShowDropdown(false);
  };

  return (
    <div className="dropdown dropdown-end flex gap-x-2 items-center">
      <p className="flex gap-x-2">{groupRoles[0].label}</p>
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
            <>
              {role.rank >= groupRoles[0].rank ? (
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
              ) : null}
            </>
          ))}
          <li>
            <Link className="text-sm" to="#">
              Créer un nouveau rôle
            </Link>
          </li>
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
