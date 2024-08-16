/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, ChangeEventHandler, FC } from "react";
import User from "../../../utils/interfaces/user";
import { AvatarSmall } from "../../UI/avatar/avatar.component";
import { DeleteIcon } from "lucide-react";

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
      className={`bg-secondary/10 hover:bg-primary hover:text-primary-content rounded-lg ${
        flex && "flex justify-between items-center"
      }`}
    >
      {onCheckRow && (
        <td className="bg-transparent rounded-l-xl p-5">
          <input
            type="checkbox"
            className="checkbox checkbox-primary mt-1"
            onChange={() => onCheckRow(user._id)}
            checked={user.isSelected}
          />
        </td>
      )}
      <td
        className={
          onCheckRow ? "bg-transparent" : "bg-transparent rounded-l-xl p-2"
        }
      >
        {user.avatar && <AvatarSmall url={user.avatar} />}
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
        <button
          type="button"
          className="btn btn-ghost hover:btn-ghost"
          onClick={() => onDeleteUser(user)}
        >
          <DeleteIcon />
        </button>
      </td>
    </tr>
  );
};
export default GroupUserItem;
