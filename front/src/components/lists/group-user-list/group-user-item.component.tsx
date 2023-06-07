import { FC } from "react";
import User from "../../../utils/interfaces/user";

const GroupUserItem: FC<{ user: User }> = ({ user }) => {
  return (
    <tr className="">
      <td className="bg-slate-200"></td>
      <td className="bg-slate-200"></td>
      <td className="bg-slate-200">{user.firstname}</td>
      <td className="bg-slate-200">{user.lastname}</td>
      <td className="bg-slate-200">{user.email}</td>
      <td className="bg-slate-200">CDA</td>
      <td className="bg-slate-200">{user.isActive}</td>
      <td className="bg-slate-200"></td>
      <td className="bg-slate-200"></td>
    </tr>
  );
};
export default GroupUserItem;
