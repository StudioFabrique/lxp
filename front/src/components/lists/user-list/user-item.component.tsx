import { FC } from "react";
import { Link } from "react-router-dom";

import toTitleCase from "../../../utils/toTitleCase";
import Can from "../../UI/can/can.component";
import { AvatarSmall } from "../../UI/avatar/avatar.component";
import useHttp from "../../../hooks/use-http";
import FadeWrapper from "../../UI/fade-wrapper/fade-wrapper";
import UpdateUserStatus from "../../UI/update-user-status/update-user-status.component";
import ButtonDelete from "../../UI/button-delete/button-delete.component";

const UserItem: FC<{
  userItem: any;
  onRowCheck: (id: string) => void;
  onDelete: (id: string) => void;
  isUserDeleteLoading: boolean;
  error?: string;
}> = ({ userItem, onRowCheck, onDelete, isUserDeleteLoading, error }) => {
  //const [isActive, setIsActive] = useState<boolean>(userItem.isActive);
  const { isLoading, sendRequest } = useHttp();

  const handleToggleStatus = () => {
    userItem.isActive = !userItem.isActive;
    updateStatus();
  };

  const updateStatus = () => {
    const applyData = (data: any) => {
      console.log("Mise à jour réussie!");
    };
    sendRequest(
      {
        path: "/user/update-user-status",
        method: "put",
        body: userItem,
      },
      applyData
    );
  };

  return (
    <>
      <td className="bg-transparent rounded-l-xl">
        <input
          className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
          type="checkbox"
          checked={userItem.isSelected}
          onChange={() => onRowCheck(userItem._id)}
        />
      </td>
      <td className="bg-transparent">
        <AvatarSmall url={userItem.avatar} />
      </td>
      <td className="bg-transparent">{toTitleCase(userItem.firstname)}</td>
      <td className="bg-transparent">{toTitleCase(userItem.lastname)}</td>
      <td className="bg-transparent">{toTitleCase(userItem.email)}</td>
      <td className="bg-transparent text-center">
        {userItem.group.name ? userItem.group.name : "-"}
      </td>
      <td className="bg-transparent text-center">
        {userItem.group.name ? userItem.group.name : "-"}
      </td>
      <td className="bg-transparent">{userItem.createdAt}</td>
      <td className="bg-transparent">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-bars text-primary loading-sm"></span>
          </div>
        ) : (
          <FadeWrapper>
            <UpdateUserStatus
              isActive={userItem.isActive}
              onToggleStatus={handleToggleStatus}
            />
          </FadeWrapper>
        )}
      </td>
      <td className="bg-transparent font-bold text-xs rounded-r-xl">
        <div className="flex gap-x-2">
          <Can action="update" subject={userItem.roles[0].role}>
            <Link to="#">Editer</Link>
          </Can>
          <Can action="delete" subject={userItem.roles[0].role}>
            <ButtonDelete
              error={error}
              isLoading={isUserDeleteLoading}
              userItem={userItem}
              onDelete={() => {}}
            />
          </Can>
        </div>
      </td>
    </>
  );
};

export default UserItem;
