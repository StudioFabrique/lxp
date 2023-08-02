import { Dispatch, FC, SetStateAction } from "react";
import User from "../../../../utils/interfaces/user";
import toTitleCase from "../../../../utils/toTitleCase";

interface IUserListConfirmation {
  usersFromCsv: Array<User>;
  onConfirmSubmit: () => void;
  setDrawerOpenState: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}

const UserListConfirmation: FC<IUserListConfirmation> = (props) => {
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
          {props.usersFromCsv.map((user, i) => (
            <span
              key={i}
              className="flex gap-x-2 p-2 pl-5 w-full bg-secondary-content rounded-lg"
            >
              <p>{toTitleCase(user.firstname)}</p>
              <p>{toTitleCase(user.lastname)}</p>
            </span>
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

export default UserListConfirmation;
