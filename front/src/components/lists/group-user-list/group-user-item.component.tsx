import { FC } from "react";
import User from "../../../utils/interfaces/user";

const GroupUserItem: FC<{ user: User }> = ({ user }) => {
  return (
    <tr className="">
      <td className="bg-slate-200">
        <input type="checkbox" className="checkbox checkbox-primary" />
      </td>
      <td className="bg-slate-200">
        <div className="avatar">
          <div className="w-10 rounded-full">
            <img
              src="https://www.leparisien.fr/resizer/fGXimQvLycC2XjTOb9nran3rDcU=/1248x782/filters:focal(1184x745:1194x755)/cloudfront-eu-central-1.images.arcpublishing.com/leparisien/NJE5TPKX7NDY3AL7MWIJJEXZOA.jpg"
              alt="image de chat"
            />
          </div>
        </div>
      </td>
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
