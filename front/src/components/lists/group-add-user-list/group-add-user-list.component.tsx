import { FC, FormEventHandler, useState } from "react";
import UserListGroup from "./user-group-list.component";
import User from "../../../utils/interfaces/user";

const GroupAddUserList: FC<{
  users: User[];
  AddUsersToGroup: (usersId: string[]) => void;
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
    if (selectedUsers.length > 0) props.AddUsersToGroup(selectedUsers);
  };

  return (
    <div>
      <UserListGroup
        users={props.users}
        selectedUsers={selectedUsers}
        ManageSelectedUser={handleManageSelectedUser}
      />
      <button onClick={handleClick}>
        ajouter les utilisateurs selectionnés
      </button>
    </div>
  );
};

export default GroupAddUserList;
