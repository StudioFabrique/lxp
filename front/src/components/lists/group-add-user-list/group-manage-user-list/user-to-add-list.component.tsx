import { FC, useEffect, useState } from "react";
import User from "../../../../utils/interfaces/user";
import { SelectionButton } from "./group-manage-user-item/buttons.component";
import { AvatarSmall } from "../../../UI/avatar/avatar.component";
import GroupManageUserItem from "./group-manage-user-item/group-manage-user-item.component";

const UserToAddList: FC<{
  userList: Array<User>;
  selectedUsers: Array<User>;
  usersToAdd: User[];
  onAddSelectedUser: (user: User) => void;
  onDeleteSelectedUser: (userId: string) => void;
  isUsersSettedUp: boolean;
}> = (props) => {
  const [filteredUserList, setFilteredUserList] = useState<Array<User>>(
    props.userList
  );

  useEffect(() => {
    // if (props.isUsersSettedUp) {
    //   setFilteredUserList(
    //     filteredUserList.filter((user) => !props.selectedUsers.includes(user))
    //   );
    // }
  }, [
    filteredUserList,
    setFilteredUserList,
    props.isUsersSettedUp,
    props.selectedUsers,
  ]);

  return (
    <div className="h-full overflow-y-auto">
      {props.userList.map((user: User) => (
        <GroupManageUserItem
          key={user._id}
          user={user}
          usersToAdd={props.usersToAdd}
          onAddSelectedUser={props.onAddSelectedUser}
          onDeleteSelectedUser={props.onDeleteSelectedUser}
        />
      ))}
    </div>
  );
};
export default UserToAddList;
