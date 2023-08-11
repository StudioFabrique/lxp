import { FC } from "react";
import User from "../../../../../utils/interfaces/user";
import { AvatarSmall } from "../../../../UI/avatar/avatar.component";
import toTitleCase from "../../../../../utils/toTitleCase";
import { SelectionButton } from "./buttons.component";

const GroupManageUserItem: FC<{
  user: User;
  usersToAdd?: User[];
  onAddSelectedUser: (user: User) => void;
  onDeleteSelectedUser: (uniqueProperty: string) => void;
}> = ({ user, usersToAdd, onAddSelectedUser, onDeleteSelectedUser }) => {
  return (
    <span className="flex items-center gap-x-4 p-2 pl-5 w-full bg-secondary-content rounded-lg">
      <SelectionButton
        currentUser={user}
        onAddSelectedUser={onAddSelectedUser}
        onDeleteSelectedUser={onDeleteSelectedUser}
      />
      {user.avatar && <AvatarSmall url={user.avatar} />}
      <p>{toTitleCase(user.firstname)}</p>
      <p>{toTitleCase(user.lastname)}</p>
    </span>
  );
};

export default GroupManageUserItem;
