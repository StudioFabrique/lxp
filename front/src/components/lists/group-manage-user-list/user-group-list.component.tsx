import { FC } from "react";
import User from "../../../utils/interfaces/user";
import SelectionButton from "./selection-button.component";

const GroupUserList: FC<{
  users: User[];
  ManageSelectedUser: (userId: string) => void;
  selectedUsers: string[];
  onClick: () => void;
}> = (props) => {
  const handleClick = () => {
    props.onClick();
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="btn btn-xs bg-red-600 text-white"
      >
        fermer
      </button>
      <div className="my-10" />
      <div>
        {props.users.map((user, i) => (
          <div key={i} className="flex flex-row justify-between">
            <div>{user.firstname}</div>
            <div>{user.lastname}</div>
            <SelectionButton
              key={i}
              selectedUsers={props.selectedUsers}
              currentUser={user._id}
              ManageSelectedUser={props.ManageSelectedUser}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default GroupUserList;
