/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import { Link } from "react-router-dom";

import Can from "../../UI/can/can.component";
import { AvatarSmall } from "../../UI/avatar/avatar.component";
import useHttp from "../../../hooks/use-http";
import UpdateUserStatus from "../../UI/update-user-status/update-user-status.component";
import ButtonDelete from "../../UI/button-delete/button-delete.component";
import { Edit2Icon, MoveUpRight } from "lucide-react";

const UserItem: FC<{
  userItem: any;
  onRowCheck: (id: string) => void;
  onDelete: (id: string) => void;
  isUserDeleteLoading: boolean;
  error?: string;
}> = ({ userItem, onRowCheck, /* onDelete, */ isUserDeleteLoading, error }) => {
  //const [isActive, setIsActive] = useState<boolean>(userItem.isActive);
  const { isLoading, sendRequest } = useHttp();

  const handleToggleStatus = () => {
    userItem.isActive = !userItem.isActive;
    updateStatus();
  };

  const updateStatus = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const applyData = (_data: any) => {
      console.log("Mise à jour réussie !");
    };
    sendRequest(
      {
        path: "/user/update-user-status",
        method: "put",
        body: { userId: userItem._id, value: userItem.isActive },
      },
      applyData,
    );
  };

  console.log(userItem._id);

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
        {userItem.avatar ? (
          <AvatarSmall url={`data:image/jpeg;base64,${userItem.avatar}`} />
        ) : (
          <p className="text-xs flex justify-center items-center p-4 w-6 h-6 rounded-full bg-accent text-base-200">
            {(userItem.firstname[0] + userItem.lastname[0])
              .trim()
              .toUpperCase()}
          </p>
        )}
      </td>
      <td className="bg-transparent capitalize">{userItem.firstname}</td>
      <td className="bg-transparent capitalize">{userItem.lastname}</td>
      <td className="bg-transparent">{userItem.email}</td>
      <td className="bg-transparent text-center capitalize">
        {userItem.formation ? userItem.formation : "-"}
      </td>
      <td className="bg-transparent text-center">
        {userItem.parcours ? userItem.parcours : "-"}
      </td>
      <td className="bg-transparent">{userItem.createdAt}</td>
      <td className="bg-transparent">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-bars text-primary loading-sm"></span>
          </div>
        ) : (
          <UpdateUserStatus
            isActive={userItem.isActive}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </td>
      <td className="bg-transparent font-bold text-xs rounded-r-xl">
        <div className="flex gap-x-4 text-primary">
          <Can action="read" object={"user"}>
            <Link
              className="tooltip tooltip-bottom"
              data-tip="Voir les informations de l'utilisateur"
              aria-label="visualier les informations de l'utilisateur"
              to={`/admin/teacher/student/${userItem._id}`}
            >
              <MoveUpRight className="w-4 h-4" />
            </Link>
          </Can>
          <Can action="update" object={userItem.roles[0].role}>
            <Link
              className="tooltip tooltip-bottom"
              data-tip="Mettre à jour les informations de l'utilisateur"
              aria-label="Mettre à jour les informations de l'utilisateur"
              to="../features"
            >
              <Edit2Icon className="w-4 h-4" />
            </Link>
          </Can>
          <Can action="delete" object={userItem.roles[0].role}>
            <Link
              className="tooltip tooltip-bottom"
              data-tip="Supprimer l'utilisateur"
              aria-label="Supprimer l'utilisateur"
              to={"../features"}
            >
              <ButtonDelete
                error={error}
                isLoading={isUserDeleteLoading}
                userItem={userItem}
                onDelete={() => {}}
              />
            </Link>
          </Can>
        </div>
      </td>
    </>
  );
};

export default UserItem;
