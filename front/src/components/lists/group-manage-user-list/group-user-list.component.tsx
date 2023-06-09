import { FC } from "react";
import User from "../../../utils/interfaces/user";
import { CancelButton, SelectionButton } from "./buttons.component";
import { AvatarSmall } from "../../UI/avatar/avatar.component";

const GroupUserList: FC<{
  users: User[];
  ManageSelectedUser: (userId: string) => void;
  selectedUsers: string[];
  onCleanup: () => void;
}> = (props) => {
  return (
    <div>
      <CancelButton onCleanup={props.onCleanup} />
      <div className="my-10" />
      <table className="table tab-sm w-full">
        <thead>
          <tr>
            <th className="bg-transparent"></th>
            <th className="bg-transparent"></th>
            <th className="bg-transparent">Prénom</th>
            <th className="bg-transparent">Nom</th>
            <th className="bg-transparent">Email</th>
            <th className="bg-transparent">Formation</th>
            <th className="bg-transparent">Status</th>
          </tr>
        </thead>
        <tbody>
          {props.users.map((user, i) => (
            <tr
              key={i}
              className="bg-slate-200 hover:bg-blue-800 hover:text-white"
            >
              <td className="bg-transparent">
                <SelectionButton
                  key={i}
                  selectedUsers={props.selectedUsers}
                  currentUser={user._id}
                  ManageSelectedUser={props.ManageSelectedUser}
                />
              </td>
              <td className="bg-transparent">
                <AvatarSmall url="https://www.leparisien.fr/resizer/fGXimQvLycC2XjTOb9nran3rDcU=/1248x782/filters:focal(1184x745:1194x755)/cloudfront-eu-central-1.images.arcpublishing.com/leparisien/NJE5TPKX7NDY3AL7MWIJJEXZOA.jpg" />
              </td>
              <td className="bg-transparent">{user.firstname}</td>
              <td className="bg-transparent">{user.lastname}</td>
              <td className="bg-transparent">{user.email}</td>
              <td className="bg-transparent">CDA</td>
              <td className="bg-transparent">{user.isActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default GroupUserList;
