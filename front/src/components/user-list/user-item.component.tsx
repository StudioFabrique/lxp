import { FC, useEffect, useState } from "react";
import toTitleCase from "../../utils/toTitleCase";
import { Link } from "react-router-dom";
import Role from "../../utils/interfaces/role";
import { hasPermission } from "../../utils/hasPermission";

const UserItem: FC<{
  userItem: any;
  onRowCheck: (id: string) => void;
  onRolesChange: (newRoles: Array<Role>, userId: string) => void;
}> = ({ userItem, onRowCheck, onRolesChange }) => {
  const [canSeeDetails, setCanSeeDetails] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    const setActions = async () => {
      setCanSeeDetails(await hasPermission("read", userItem.roles[0].role));
      setCanEdit(await hasPermission("write", userItem.roles[0].role));
      setCanDelete(await hasPermission("delete", userItem.roles[0].role));
    };
    setActions();
  }, [userItem.roles]);

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
      <td>
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
            userItem.isActive ? "badge badge-success" : "badge badge-error"
          }
        >
          {userItem.isActive ? "Actif" : "Inactif"}
        </div>
      </td>
      <td className="bg-transparent font-bold text-xs">
        <div className="flex gap-x-2">
          {canSeeDetails ? (
            <Link to="#">Détails</Link>
          ) : (
            <p className="text-black/50">Détails</p>
          )}
          {canEdit ? (
            <Link to="#">Editer</Link>
          ) : (
            <p className="text-black/50">Editer</p>
          )}{" "}
          {canDelete ? (
            <Link to="#">Supprimer</Link>
          ) : (
            <p className="text-black/50">Supprimer</p>
          )}
        </div>
      </td>
    </>
  );
};

export default UserItem;
