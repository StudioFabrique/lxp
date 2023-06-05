import { FC, useState } from "react";
import User from "../../../utils/interfaces/user";

const GroupUserList: FC<{
  users: User[];
  AddSelectedUser: (userId: number) => void;
}> = (props) => {
  /* const [selectButton, setSelectButton] = useState<React.ReactElement>(
    <button onClick={}></button>
  ); */

  return (
    // map dans un autre composant
    <>
      {props.users.map((user, i) => (
        <div key={i} className="flex flex-row justify-between">
          <div>{user.firstname}</div>
          <div>{/* {selectButton} */}</div>
        </div>
      ))}
    </>
  );
};
export default GroupUserList;
