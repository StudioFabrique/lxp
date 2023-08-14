import { FC, useEffect, useState } from "react";
import User from "../../../../../utils/interfaces/user";
import GroupManageUserItem from "../group-manage-user-item/group-manage-user-item.component";

const UserToAddList: FC<{
  userList: Array<User>;
  selectedUsers: Array<User>;
  usersToAdd: User[];
  onAddSelectedUser: (user: User) => void;
  onDeleteSelectedUser: (user: User) => void;
  onAddUserInstantly: (user: User) => void;
  isUsersSettedUp: boolean;
}> = (props) => {
  return (
    <div className="flex flex-col gap-y-5 h-full overflow-y-auto w-full">
      {props.userList.map((user: User) => (
        <GroupManageUserItem
          key={user._id}
          user={user}
          onAddSelectedUser={props.onAddSelectedUser}
          onDeleteSelectedUser={props.onDeleteSelectedUser}
          onAddUserInstantly={props.onAddUserInstantly}
        />
      ))}
    </div>
  );
};
export default UserToAddList;
