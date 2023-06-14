import { FC } from "react";
import User from "../../../../utils/interfaces/user";
import { SelectionButton } from "./buttons.component";
import { AvatarSmall } from "../../../UI/avatar/avatar.component";

const UserToAddList: FC<{
  userList: Array<any>;
  selectedUsers: string[];
  onAddSelectedUser: (userId: string) => void;
  onDeleteSelectedUser: (userId: string) => void;
}> = (props) => {
  return (
    <div className="h-full overflow-y-auto overflow-x-auto">
      <table className="table-auto tab-sm border-separate border-spacing-y-4 text-center">
        <thead>
          <tr>
            <th className="bg-transparent"></th>
            <th className="bg-transparent"></th>
            <th className="bg-transparent">Prénom</th>
            <th className="bg-transparent">Nom</th>
          </tr>
        </thead>
        <tbody>
          {props.userList.map((user: User) => (
            <tr
              key={user._id}
              className="bg-secondary/10 hover:bg-blue-800 hover:text-white"
            >
              <td className="bg-transparent rounded-l-xl">
                <SelectionButton
                  currentUser={user._id}
                  users={props.selectedUsers}
                  onAddSelectedUser={props.onAddSelectedUser}
                  onDeleteSelectedUser={props.onDeleteSelectedUser}
                />
              </td>
              <td className="bg-transparent">
                <AvatarSmall url="https://www.leparisien.fr/resizer/fGXimQvLycC2XjTOb9nran3rDcU=/1248x782/filters:focal(1184x745:1194x755)/cloudfront-eu-central-1.images.arcpublishing.com/leparisien/NJE5TPKX7NDY3AL7MWIJJEXZOA.jpg" />
              </td>
              <td className="bg-transparent w-full">{user.firstname}</td>
              <td className="bg-transparent rounded-r-xl w-full">
                {user.lastname}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default UserToAddList;
