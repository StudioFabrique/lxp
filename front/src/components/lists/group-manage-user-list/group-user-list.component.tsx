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
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Formation</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {props.users.map((user, i) => (
            <tr key={i}>
              <td>
                <SelectionButton
                  key={i}
                  selectedUsers={props.selectedUsers}
                  currentUser={user._id}
                  ManageSelectedUser={props.ManageSelectedUser}
                />
              </td>
              <td>
                <AvatarSmall url="https://www.leparisien.fr/resizer/fGXimQvLycC2XjTOb9nran3rDcU=/1248x782/filters:focal(1184x745:1194x755)/cloudfront-eu-central-1.images.arcpublishing.com/leparisien/NJE5TPKX7NDY3AL7MWIJJEXZOA.jpg" />
              </td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>CDA</td>
              <td>{user.isActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default GroupUserList;
