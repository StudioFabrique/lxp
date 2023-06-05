import { FC, FormEventHandler, useState } from "react";
import UserListGroup from "./user-group-list.component";
import User from "../../../utils/interfaces/user";

const groupAddUserList: FC<{
  users: User[];
  AddUsersToGroup: (usersId: number[]) => void;
}> = (props) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const handleAddSelectedUser = (userId: number) => {
    setSelectedUsers((users) => [...users, userId]);
  };

  const handleClick: FormEventHandler = () => {
    if (selectedUsers.length > 0) props.AddUsersToGroup(selectedUsers);
  };

  return (
    <div>
      <UserListGroup
        users={props.users}
        AddSelectedUser={handleAddSelectedUser}
      />
      <button onClick={handleClick}>
        ajouter les utilisateurs selectionnés
      </button>
    </div>
  );
};

export default groupAddUserList;
