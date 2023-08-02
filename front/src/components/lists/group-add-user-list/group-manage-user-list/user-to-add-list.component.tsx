import { FC, useEffect, useState } from "react";
import User from "../../../../utils/interfaces/user";
import { SelectionButton } from "./group-manage-user-item/buttons.component";
import { AvatarSmall } from "../../../UI/avatar/avatar.component";

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
    // if (props.isUsersSettedUp) {
    //   setFilteredUserList(
    //     filteredUserList.filter((user) => !props.selectedUsers.includes(user))
    //   );
    // }
  }, [
    filteredUserList,
    setFilteredUserList,
    props.isUsersSettedUp,
    props.selectedUsers,
  ]);

  return (
    <div className="h-full overflow-y-auto">
      {props.userList.map((user: User) => (
        <tr
          key={user._id}
          className="bg-secondary/10 hover:bg-secondary/20 hover:text-base-content"
        >
          <SelectionButton
            currentUser={user}
            onAddSelectedUser={props.onAddSelectedUser}
            onDeleteSelectedUser={props.onDeleteSelectedUser}
          />
          <td className="bg-transparent">
            <AvatarSmall url="https://www.leparisien.fr/resizer/fGXimQvLycC2XjTOb9nran3rDcU=/1248x782/filters:focal(1184x745:1194x755)/cloudfront-eu-central-1.images.arcpublishing.com/leparisien/NJE5TPKX7NDY3AL7MWIJJEXZOA.jpg" />
          </td>
          <td className="bg-transparent w-full">{user.firstname}</td>
          <td className="bg-transparent rounded-r-xl w-full p-5">
            {user.lastname}
          </td>
        </tr>
      ))}
    </div>
  );
};
export default UserToAddList;
