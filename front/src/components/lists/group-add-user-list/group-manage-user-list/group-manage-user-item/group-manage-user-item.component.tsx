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
    /* usersToAdd && */ <span className="flex gap-x-2 p-2 pl-5 w-full bg-secondary-content rounded-lg">
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
