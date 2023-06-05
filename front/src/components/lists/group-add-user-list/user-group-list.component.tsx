import { FC } from "react";
import User from "../../../utils/interfaces/user";

const UserGroupList: FC<{
  users: User[];
  AddSelectedUser: (userId: number) => void;
}> = (props) => {
  return <></>;
};

export default UserGroupList;
