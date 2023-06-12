import { FC, useState } from "react";
import User from "../../../utils/interfaces/user";
import { AddUsersButton } from "./buttons.component";
import GroupUserList from "./group-user-list.component";

const GroupManageUserList: FC<{
  users: User[];
  onSetUsersToAdd: (usersId: string[]) => void;
  onClose: () => void;
}> = (props) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleManageSelectedUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers((users) => users.filter((value) => value !== userId));
    } else {
      setSelectedUsers((users) => [...users, userId]);
    }
  };

  const handleCleanup = () => {
    setSelectedUsers([]);
    props.onSetUsersToAdd([]);
    props.onClose();
  };

  return (
    <div className="fixed h-screen w-full top-0 right-0 flex justify-center items-center backdrop-blur-sm">
      <div className="w-[60%] h-[80%] bg-white p-10">
        <GroupUserList
          onCleanup={handleCleanup}
          users={props.users}
          selectedUsers={selectedUsers}
          ManageSelectedUser={handleManageSelectedUser}
        />
        <AddUsersButton
          onSetUsersToAdd={props.onSetUsersToAdd}
          selectedUsers={selectedUsers}
        />
      </div>
    </div>
  );
};

export default GroupManageUserList;
