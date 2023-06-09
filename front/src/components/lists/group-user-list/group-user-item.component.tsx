import { FC } from "react";
import User from "../../../utils/interfaces/user";
import { AvatarSmall } from "../../UI/avatar/avatar.component";

const GroupUserItem: FC<{ user: User }> = ({ user }) => {
  return (
    <tr className="bg-slate-200 hover:bg-blue-800 hover:text-white">
      <td className="bg-transparent rounded-l-xl">
        <input type="checkbox" className="checkbox checkbox-primary" />
      </td>
      <td className="bg-transparent">
        <AvatarSmall url="https://www.leparisien.fr/resizer/fGXimQvLycC2XjTOb9nran3rDcU=/1248x782/filters:focal(1184x745:1194x755)/cloudfront-eu-central-1.images.arcpublishing.com/leparisien/NJE5TPKX7NDY3AL7MWIJJEXZOA.jpg" />
      </td>
      <td className="bg-transparent">{user.firstname}</td>
      <td className="bg-transparent">{user.lastname}</td>
      <td className="bg-transparent">{user.email}</td>
      <td className="bg-transparent">CDA</td>
      <td className="bg-transparent">{user.isActive}</td>
      <td className="bg-transparent"></td>
      <td className="bg-transparent rounded-r-xl"></td>
    </tr>
  );
};
export default GroupUserItem;
