import { Dispatch, FC, SetStateAction } from "react";
import User from "../../../../../utils/interfaces/user";
import GroupUserItem from "../../group-manage-user-list/group-manage-user-item/group-manage-user-item.component";

interface IUserListConfirmation {
  usersFromCsv: Array<User>;
  onConfirmSubmit: () => void;
  setDrawerOpenState: Dispatch<SetStateAction<boolean>>;
  onAddSelectedUser: (user: User) => void;
  onDeleteSelectedUser: (user: User) => void;
  onAddUserInstantly: (user: User) => void;
  isLoading: boolean;
}

const CsvUserListConfirmation: FC<IUserListConfirmation> = (props) => {
  const handleConfirm = () => {
    props.onConfirmSubmit();
  };

  const handleCancel = () => {
    props.setDrawerOpenState(false);
  };

  if (props.usersFromCsv.length > 0) {
    return (
      <div className="flex flex-col justify-between items-center">
        <div className="flex flex-col gap-y-2 w-full ">
          {props.usersFromCsv.map((user) => (
            <GroupUserItem
              key={user.email}
              user={user}
              onAddSelectedUser={props.onAddSelectedUser}
              onDeleteSelectedUser={props.onDeleteSelectedUser}
              onAddUserInstantly={props.onAddUserInstantly}
            />
          ))}
        </div>
        <div className="flex">
          <button className="btn" onClick={handleCancel}>
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className={`btn ${props.isLoading && "loading"}`}
          >
            Confirmer
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <p>
        Aucun utilisateurs disponible pour être ajouté, vérifiez votre fichier
        d'importation
      </p>
    );
  }
};

export default CsvUserListConfirmation;
