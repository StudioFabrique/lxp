import { FC } from "react";
import toTitleCase from "../../utils/toTitleCase";
import { Link } from "react-router-dom";
import Role from "../../utils/interfaces/role";
import Can from "../UI/can/can.component";

const UserItem: FC<{
  userItem: any;
  onRowCheck: (id: string) => void;
  onRolesChange: (newRoles: Array<Role>, userId: string) => void;
}> = ({ userItem, onRowCheck, onRolesChange }) => {
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
      <td className="bg-transparent flex justify-center items-center">
        <div className="avatar">
          <div className="w-6 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={userItem.avatar}
              alt={`avatar de ${userItem.firstname} ${userItem.lastname}`}
            />
          </div>
        </div>
      </td>
      <td className="bg-transparent">{toTitleCase(userItem.lastname)}</td>
      <td className="bg-transparent">{toTitleCase(userItem.firstname)}</td>
      <td className="bg-transparent">{userItem.email}</td>
      <td
        className={`bg-transparent ${userItem.formation ? "" : "text-center"}`}
      >
        {userItem.formation || "-"}
      </td>
      <td className="bg-transparent">
        <div
          className={
            userItem.isActive
              ? "badge badge-success text-base-100"
              : "badge badge-error"
          }
        >
          {userItem.isActive ? "Actif" : "Inactif"}
        </div>
      </td>
      <td className="bg-transparent font-bold text-xs">
        <div className="flex gap-x-2">
          <Can action="update" subject={userItem.roles[0].role}>
            <Link to="#">Editer</Link>
          </Can>

          <Can action="delete" subject={userItem.roles[0].role}>
            <Link to="#">Supprimer</Link>
          </Can>
        </div>
      </td>
    </>
  );
};

export default UserItem;
