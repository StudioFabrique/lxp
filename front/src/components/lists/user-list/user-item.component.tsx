/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, FC } from "react";
import { Link } from "react-router-dom";

import Can from "../../UI/can/can.component";
import { AvatarSmall } from "../../UI/avatar/avatar.component";
import useHttp from "../../../hooks/use-http";
import UpdateUserStatus from "../../UI/update-user-status/update-user-status.component";
import { CheckCircle, Edit2Icon, ScrollText, Trash2Icon } from "lucide-react";
import { truncateText } from "../../../helpers/truncate-text";
import Role from "../../../utils/interfaces/role";

const UserItem: FC<{
  userItem: any;
  role: Role;
  onRowCheck: (id: string) => void;
  onDelete: Dispatch<React.SetStateAction<string | null>>;
  isUserDeleteLoading: boolean;
  error?: string;
  sendInvitation: (userId: string) => void;
  onToggleStatus: (id: string, value: boolean) => void;
}> = ({
  role,
  userItem,
  onRowCheck,
  onDelete,
  sendInvitation,
  onToggleStatus,
}) => {
  const { isLoading } = useHttp();

  const handleToggleStatus = () => {
    updateStatus();
  };

  const updateStatus = () => {
    onToggleStatus(userItem._id, userItem.isActive);
  };

  return (
    <>
      <td className="bg-transparent rounded-l-xl">
        <input
          className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
          type="checkbox"
          checked={userItem.isSelected}
          onChange={() => onRowCheck(userItem._id)}
          disabled={role.role === "everything"}
        />
      </td>
      <td className="bg-transparent">
        <AvatarSmall user={userItem} />
      </td>
      <td className="bg-transparent capitalize">{userItem.firstname}</td>
      <td className="bg-transparent capitalize">{userItem.lastname}</td>
      <td className="bg-transparent">
        <span className="tooltip tooltip-bottom" data-tip={userItem.email}>
          {truncateText(userItem.email, 20)}
        </span>
      </td>
      {role.role == "everything" || role.rank < 3 ? null : (
        <>
          <td className="bg-transparent text-center capitalize">
            <span
              className="tooltip tooltip-bottom"
              data-tip={userItem.formation}
            >
              {userItem.formation ? truncateText(userItem.formation, 20) : "ND"}
            </span>
          </td>
          <td className="bg-transparent text-center">
            <span
              className="tooltip tooltip-bottom"
              data-tip={userItem.parcours}
            >
              {userItem.formation ? truncateText(userItem.parcours, 20) : "ND"}
            </span>
          </td>
        </>
      )}

      <td>
        {userItem.roles
          .map((role: Role) =>
            !role.role.startsWith("interface") ? role.label : null
          )
          .join(!role.role.startsWith("everything") ? ", " : "")}
      </td>
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
      <td className="mx-auto">
        {!userItem.invitationSent ? (
          <button
            className="btn btn-accent btn-xs"
            onClick={() => sendInvitation(userItem._id)}
          >
            Inviter
          </button>
        ) : !userItem.emailVerified ? (
          <button className="btn btn-accent btn-xs whitespace-nowrap" disabled>
            En cours...
          </button>
        ) : (
          <CheckCircle className="text-success" />
        )}
      </td>
      <td className="bg-transparent font-bold text-xs rounded-r-xl">
        <div className="flex gap-x-4 text-primary">
          {userItem.roles[0].rank > 2 ? (
            <Can action="read" object={"user"}>
              <Link
                className="tooltip tooltip-bottom btn btn-circle btn-ghost"
                data-tip="Voir les informations de l'utilisateur"
                aria-label="visualiser les informations de l'utilisateur"
                to={`/admin/teacher/student/${userItem._id}`}
              >
                <ScrollText className="w-4 h-4" />
              </Link>
            </Can>
          ) : (
            <Can action="read" object={"user"}>
              <div
                className="tooltip tooltip-bottom btn btn-circle btn-ghost"
                data-tip="Voir les informations de l'utilisateur"
                aria-label="visualiser les informations de l'utilisateur"
              >
                <ScrollText className="w-4 h-4 text-primary/20" />
              </div>
            </Can>
          )}
          <Can action="update" object="user">
            {/* <Can action="update" object={userItem.roles[0].role}> */}
            <Link
              className="tooltip tooltip-bottom btn btn-circle btn-ghost"
              data-tip="Mettre à jour les informations de l'utilisateur"
              aria-label="Mettre à jour les informations de l'utilisateur"
              to={`edit/${userItem._id}`}
            >
              <Edit2Icon className="w-4 h-4" />
            </Link>
            {/* </Can> */}
          </Can>
          <Can action="delete" object="user">
            {/* <Can action="delete" object={userItem.roles[0].role}> */}
            <button
              className="btn btn-circle btn-ghost"
              disabled={isLoading}
              onClick={() => onDelete(userItem._id)}
            >
              <Trash2Icon className="w-4 h-4 text-error" />
            </button>
            {/* </Can> */}
          </Can>
        </div>
      </td>
    </>
  );
};

export default UserItem;
