import { FC } from "react";
import User from "../../../../utils/interfaces/user";

interface IUserListConfirmation {
  usersFromCsv: Array<User>;
  onConfirmSubmit: () => void;
}

const UserListConfirmation: FC<IUserListConfirmation> = (props) => {
  const handleClick = () => {
    props.onConfirmSubmit();
  };

  if (props.usersFromCsv.length > 0) {
    return (
      <div className="flex flex-col items-center">
        {props.usersFromCsv.map((user, i) => (
          <p>{user.firstname}</p>
        ))}
        <span className=""></span>
        <button onClick={handleClick}>
          Confirmer la création des étudiants importés
        </button>
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
