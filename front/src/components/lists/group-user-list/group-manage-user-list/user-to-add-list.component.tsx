import { FC } from "react";
import User from "../../../../utils/interfaces/user";
import { SelectionButton } from "./buttons.component";
import { AvatarSmall } from "../../../UI/avatar/avatar.component";
import Wrapper from "../../../UI/wrapper/wrapper.component";

const UserToAddList: FC<{
  userList: Array<any>;
  selectedUsers: string[];
  ManageSelectedUsers: (userId: string) => void;
  setUserSettedState: (value: boolean) => void;
}> = (props) => {
  return (
    <Wrapper>
      <table className="table-auto tab-sm border-separate border-spacing-y-4 text-center">
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
          {props.userList.map((user: User) => (
            <tr
              key={user._id}
              className="bg-secondary/10 hover:bg-blue-800 hover:text-white"
            >
              <td className="bg-transparent rounded-l-xl p-5">
                <SelectionButton
                  currentUser={user._id}
                  users={props.selectedUsers}
                  ManageSelectedUsers={props.ManageSelectedUsers}
                  setUserSettedState={props.setUserSettedState}
                />
              </td>
              <td className="bg-transparent">
                <AvatarSmall url="https://www.leparisien.fr/resizer/fGXimQvLycC2XjTOb9nran3rDcU=/1248x782/filters:focal(1184x745:1194x755)/cloudfront-eu-central-1.images.arcpublishing.com/leparisien/NJE5TPKX7NDY3AL7MWIJJEXZOA.jpg" />
              </td>
              <td className="bg-transparent">{user.firstname}</td>
              <td className="bg-transparent">{user.lastname}</td>
              <td className="bg-transparent">{user.email}</td>
              <td className="bg-transparent">CDA</td>
              <td className="bg-transparent rounded-r-xl">{user.isActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
};
export default UserToAddList;
