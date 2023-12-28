import { ChangeEvent, ChangeEventHandler, FC } from "react";
import User from "../../../utils/interfaces/user";
import { AvatarSmall } from "../../UI/avatar/avatar.component";
import { DeleteButton, EditButton } from "./buttons";

const GroupUserItem: FC<{
  itemProps: any;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onCheckRow: (id: number) => void;
}> = ({ itemProps, onUpdateUser, onDeleteUser, onCheckRow }) => {
  const handleToggleActiveState: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const userUpdated = itemProps;
    userUpdated.isActive = event.target.checked;
    onUpdateUser(userUpdated);
  };

  return (
    <tr className="bg-secondary/10 hover:bg-blue-800 hover:text-white">
      <td className="bg-transparent rounded-l-xl p-5">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          onChange={() => onCheckRow(itemProps._id)}
          checked={itemProps.isSelected}
        />
      </td>
      <td className="bg-transparent">
        {itemProps.avatar && <AvatarSmall url={itemProps.avatar} />}
      </td>
      <td className="bg-transparent">{itemProps.firstname}</td>
      <td className="bg-transparent">{itemProps.lastname}</td>
      <td className="bg-transparent">{itemProps.email}</td>
      <td className="bg-transparent">CDA</td>
      <td className="bg-transparent text-primary">
        {itemProps.isActive ? "Actif" : "Inactif"}
      </td>
      <td className="bg-transparent">
        <span className="flex items-center">
          <input
            type="checkbox"
            className="toggle"
            onChange={handleToggleActiveState}
            defaultChecked={itemProps.isActive}
          />
        </span>
      </td>
      <td className="bg-transparent rounded-r-xl">
        <EditButton user={itemProps} />
        <DeleteButton user={itemProps} onDeleteUser={onDeleteUser} />
      </td>
    </tr>
  );
};
export default GroupUserItem;