import { FC } from "react";
import User from "../../../utils/interfaces/user";

const GroupUserList: FC<{
  users: User[];
  AddSelectedUser: (userId: number) => void;
}> = (props) => {
  return (
    <>
      {props.users.map((user, i) => (
        <div key={i} className="flex flex-row justify-between">
          <div>{user.firstname}</div>
          <div></div>
        </div>
      ))}
    </>
  );
};
export default GroupUserList;
