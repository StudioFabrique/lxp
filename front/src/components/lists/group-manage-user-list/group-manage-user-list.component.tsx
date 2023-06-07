import { FC, FormEventHandler, useState } from "react";
import UserListGroup from "./user-group-list.component";
import User from "../../../utils/interfaces/user";

const GroupManageUserList: FC<{
  users: User[];
  addUsersToGroup: (usersId: string[]) => void;
  onClick: () => void;
}> = (props) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleManageSelectedUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers((users) => users.filter((value) => value !== userId));
    } else {
      setSelectedUsers((users) => [...users, userId]);
    }
  };

  const handleClick: FormEventHandler = () => {
    if (selectedUsers.length > 0) props.addUsersToGroup(selectedUsers);
  };

  return (
    <div className="fixed h-screen w-full top-0 right-0 flex justify-center items-center backdrop-blur-sm">
      <div className="w-[60%] h-[60%] bg-white p-10">
        <UserListGroup
          onClick={props.onClick}
          users={props.users}
          selectedUsers={selectedUsers}
          ManageSelectedUser={handleManageSelectedUser}
        />
        <button
          className="btn btn-sm bg-blue-500 text-white"
          onClick={handleClick}
        >
          ajouter les utilisateurs selectionnés
        </button>
      </div>
    </div>
  );
};

export default GroupManageUserList;
