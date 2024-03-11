import { FC, useEffect, useState } from "react";
import User from "../../../../../utils/interfaces/user";
import { AvatarSmall } from "../../../../UI/avatar/avatar.component";
import toTitleCase from "../../../../../utils/toTitleCase";
import { SelectionButton } from "./buttons.component";
import { AddIcon2 } from "../../../../UI/svg/add-icons";

const GroupManageUserItem: FC<{
  user: User;
  allUserSelected: boolean;
  usersToAdd: User[];
  onAddSelectedUser: (user: User) => void;
  onDeleteSelectedUser: (user: User) => void;
  onAddUserInstantly: (user: User) => void;
}> = ({
  user,
  allUserSelected,
  usersToAdd,
  onAddSelectedUser,
  onDeleteSelectedUser,
  onAddUserInstantly,
}) => {
  const [disabled, setDisabled] = useState(false);

  const handleAddUserInstantly = () => {
    onAddUserInstantly(user);
  };

  useEffect(() => {
    usersToAdd.filter((userToAdd) => userToAdd._id === user._id).length > 0
      ? setDisabled(true)
      : setDisabled(false);
  }, [user, usersToAdd]);

  return (
    <div className="flex justify-between items-center gap-x-2">
      <span className="flex items-center gap-x-4 p-2 pl-5 w-full bg-secondary text-secondary-content rounded-lg">
        {disabled ? (
          <input type="checkbox" className="checkbox" disabled />
        ) : (
          <SelectionButton
            currentUser={user}
            allUserSelected={allUserSelected}
            onAddSelectedUser={onAddSelectedUser}
            onDeleteSelectedUser={onDeleteSelectedUser}
          />
        )}
        <AvatarSmall url={user.avatar} />
        <span className="flex gap-x-4">
          <p>{toTitleCase(user.firstname)}</p>
          <p>{toTitleCase(user.lastname)}</p>
        </span>
      </span>
      <button
        type="button"
        disabled={disabled}
        className="btn btn-square btn-sm bg-primary border-none text-base-100 hover:brightness-75 hover:bg-primary"
        onClick={handleAddUserInstantly}
      >
        <AddIcon2 />
      </button>
    </div>
  );
};

export default GroupManageUserItem;
