import { FC, useEffect, useState } from "react";
import User from "../../../../utils/interfaces/user";
import GroupManageUserItem from "./group-manage-user-item/group-manage-user-item.component";
import AddButton from "./buttons/add-button.component";

const UserToAddList: FC<{
  userList: Array<User>;
  selectedUsers: Array<User>;
  usersToAdd: User[];
  onAddSelectedUser: (user: User) => void;
  onDeleteSelectedUser: (user: User) => void;
  onAddUserInstantly: (user: User) => void;
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
    <div className="flex flex-col gap-y-5 h-full overflow-y-auto">
      {props.userList.map((user: User) => (
        <div key={user._id}>
          <GroupManageUserItem
            user={user}
            onAddSelectedUser={props.onAddSelectedUser}
            onDeleteSelectedUser={props.onDeleteSelectedUser}
            onAddUserInstantly={props.onAddUserInstantly}
          />
        </div>
      ))}
    </div>
  );
};
export default UserToAddList;
