import { FC } from "react";
import User from "../../../utils/interfaces/user";
import SelectionButton from "./selection-button.component";

const GroupUserList: FC<{
  users: User[];
  ManageSelectedUser: (userId: string) => void;
  selectedUsers: string[];
}> = (props) => {
  return (
    // map dans un autre composant
    <div>
      {props.users.map((user, i) => (
        <div key={i} className="flex flex-row justify-between">
          <div>{user.firstname}</div>
          <SelectionButton
            key={i}
            selectedUsers={props.selectedUsers}
            currentUser={user._id}
            ManageSelectedUser={props.ManageSelectedUser}
          />
        </div>
      ))}
    </div>
  );
};
export default GroupUserList;
