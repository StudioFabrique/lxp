/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, ChangeEventHandler, FC } from "react";
import User from "../../../../src/utils/interfaces/user";
import { AvatarSmall } from "../../../components/avatar/AvatarSmall";
import { Trash2 } from "lucide-react";

const GroupUserItem: FC<{
  user: any;
  onDeleteUser: (user: User) => void;
  onUpdateUser?: (user: User) => void;
  onCheckRow?: (id: number) => void;
  flex?: boolean;
}> = ({ user, onUpdateUser, onDeleteUser, onCheckRow, flex = false }) => {
  const handleToggleActiveState: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (onUpdateUser) {
      const userUpdated = user;
      userUpdated.isActive = event.target.checked;
      onUpdateUser(userUpdated);
    }
  };

  return (
    <tr
      className={`bg-secondary/10 hover:bg-primary/20 hover:text-primary rounded-lg ${
        flex && "flex justify-between items-center"
      }`}
    >
      {onCheckRow && (
        <td className="bg-transparent rounded-l-xl pr-0">
          <div className="flex justify-center items-center">
            <input
              type="checkbox"
              className="checkbox checkbox-sm checkbox-primary"
              onChange={() => onCheckRow(user._id)}
              checked={user.isSelected}
            />
          </div>
        </td>
      )}
      <td
        className={
          onCheckRow ? "bg-transparent" : "bg-transparent rounded-l-xl p-2"
        }
      >
        <div className="flex justify-center items-center">
          {user.avatar && <AvatarSmall user={user} />}
        </div>
      </td>
      <td className="bg-transparent">{user.firstname}</td>
      <td className="bg-transparent">{user.lastname}</td>
      <td className="bg-transparent">{user.email}</td>
      {onUpdateUser && (
        <>
          <td className="bg-transparent">
            {user.isActive ? "Actif" : "Inactif"}
          </td>

          <td className="bg-transparent">
            <span className="flex items-center">
              <input
                type="checkbox"
                className="toggle"
                onChange={handleToggleActiveState}
                defaultChecked={user.isActive}
              />
            </span>
          </td>
        </>
      )}
      <td className="bg-transparent rounded-r-xl">
        <div className="w-full flex justify-center">
          <button
            type="button"
            className="tooltip btn btn-ghost hover:btn-ghost"
            data-tip="Supprimer"
            onClick={() => onDeleteUser(user)}
          >
            <Trash2 className="w-5 h-5 stroke-error" />
          </button>
        </div>
      </td>
    </tr>
  );
};
export default GroupUserItem;
