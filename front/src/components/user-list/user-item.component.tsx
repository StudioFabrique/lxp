import { FC, useContext } from "react";
import toTitleCase from "../../utils/toTitleCase";
import { Link } from "react-router-dom";
import { Context } from "../../store/context.store";
import RolesDropdown from "./roles-dropdown.component";
//import RolesDropdown from "./roles-dropdown.component";

const UserItem: FC<{
  userItem: any;
  onRowCheck: (id: string) => void;
  onRolesChange: (newRoles: Array<string>, userId: string) => void;
}> = ({ userItem, onRowCheck, onRolesChange }) => {
  const { user } = useContext(Context);

  return (
    <>
      <td className="bg-transparent">
        <input
          className="my-auto checkbox"
          type="checkbox"
          checked={userItem.isSelected}
          onChange={() => onRowCheck(userItem._id)}
        />
      </td>
      <td className="font-bold bg-transparent">{userItem.index}</td>
      <td className="bg-transparent">{`${toTitleCase(
        userItem.lastname
      )} ${toTitleCase(userItem.firstname)}`}</td>
      <td className="bg-transparent">{userItem.email}</td>
      <td className="bg-transparent">{userItem.createdAt}</td>
      <td className="bg-transparent">
        {user &&
        user.roles[0] === "admin" &&
        !userItem.roles.includes("admin") ? (
          <RolesDropdown
            userId={userItem._id}
            userRoles={userItem.roles}
            onRolesChange={onRolesChange}
          />
        ) : (
          <ul className="flex gap-x-2">
            {userItem.roles.map((role: string) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        )}
      </td>
      <td className="bg-transparent font-bold text-xs">
        <div className="flex gap-x-2">
          <Link to="#">Détails</Link>
          <Link to="#">Editer</Link>
          <Link to="#">Supprimer</Link>
        </div>
      </td>
    </>
  );
};

export default UserItem;
