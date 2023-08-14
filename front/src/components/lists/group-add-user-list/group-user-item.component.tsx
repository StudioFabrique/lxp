import { ChangeEvent, ChangeEventHandler, FC } from "react";
import User from "../../../utils/interfaces/user";
import { AvatarSmall } from "../../UI/avatar/avatar.component";
import { DeleteButton, EditButton } from "./buttons";

const GroupUserItem: FC<{
  user: User;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}> = ({ user, onUpdateUser, onDeleteUser }) => {
  const handleToggleActiveState: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const userUpdated = user;
    userUpdated.isActive = event.target.checked;
    onUpdateUser(userUpdated);
  };

  return (
    <tr className="bg-secondary/10 hover:bg-blue-800 hover:text-white">
      <td className="bg-transparent rounded-l-xl p-5">
        <input type="checkbox" className="checkbox checkbox-primary" />
      </td>
      <td className="bg-transparent">
        {user.avatar && <AvatarSmall url={user.avatar} />}
      </td>
      <td className="bg-transparent">{user.firstname}</td>
      <td className="bg-transparent">{user.lastname}</td>
      <td className="bg-transparent">{user.email}</td>
      <td className="bg-transparent">CDA</td>
      <td className="bg-transparent text-primary">
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
      <td className="bg-transparent rounded-r-xl">
        <EditButton user={user} />
        <DeleteButton user={user} onDeleteUser={onDeleteUser} />
      </td>
    </tr>
  );
};
export default GroupUserItem;
