import { FC, useEffect, useState } from "react";
import User from "../../../../utils/interfaces/user";
import { SelectionButton } from "./buttons.component";
import { AvatarSmall } from "../../../UI/avatar/avatar.component";
import UserList from "../../user-list/user-list.component";

const UserToAddList: FC<{
  userList: Array<User>;
  selectedUsers: Array<User>;
  onAddSelectedUser: (user: User) => void;
  onDeleteSelectedUser: (userId: string) => void;
  isUsersSettedUp: boolean;
}> = (props) => {
  const [filteredUserList, setFilteredUserList] = useState<Array<User>>(
    props.userList
  );

  useEffect(() => {
    if (props.isUsersSettedUp) {
      setFilteredUserList(
        filteredUserList.filter((user) => !props.selectedUsers.includes(user))
      );
    }
  }, [filteredUserList, setFilteredUserList]);

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
              className="bg-secondary/10 hover:bg-secondary/20 hover:text-base-content"
            >
              <td className="bg-transparent rounded-l-xl p-5">
                <SelectionButton
                  currentUser={user}
                  users={props.selectedUsers}
                  onAddSelectedUser={props.onAddSelectedUser}
                  onDeleteSelectedUser={props.onDeleteSelectedUser}
                />
              </td>
              <td className="bg-transparent">
                <AvatarSmall url="https://www.leparisien.fr/resizer/fGXimQvLycC2XjTOb9nran3rDcU=/1248x782/filters:focal(1184x745:1194x755)/cloudfront-eu-central-1.images.arcpublishing.com/leparisien/NJE5TPKX7NDY3AL7MWIJJEXZOA.jpg" />
              </td>
              <td className="bg-transparent w-full">{user.firstname}</td>
              <td className="bg-transparent rounded-r-xl w-full p-5">
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
