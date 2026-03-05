import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import User from "../../../../../utils/interfaces/user";
import GroupUserItem from "../../group-manage-user-list/group-manage-user-item/group-manage-user-item.component";

interface IUserListConfirmation {
  usersFromCsv: Array<User>;
  usersToAdd: Array<User>;
  onConfirmSubmit: () => void;
  setDrawerOpenState: Dispatch<SetStateAction<boolean>>;
  onAddSelectedUser: (user: User) => void;
  onDeleteSelectedUser: (user: User) => void;
  isLoading: boolean;
  onSelectAllUsers: () => void;
  onDeselectAllUsers: () => void;
}

const CsvUserListConfirmation: FC<IUserListConfirmation> = (props) => {
  const [allSelected, setAllSelected] = useState(false);

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAllSelected(checked);
    if (checked) {
      props.onSelectAllUsers();
    } else {
      props.onDeselectAllUsers();
    }
  };
  const handleConfirm = () => {
    props.onConfirmSubmit();
  };

  const handleCancel = () => {
    props.setDrawerOpenState(false);
  };

  // Keep allSelected in sync with props.usersToAdd length
  useEffect(() => {
    setAllSelected(
      props.usersFromCsv.length > 0 &&
        props.usersFromCsv.every((user) =>
          props.usersToAdd.some((u) => u.email === user.email),
        ),
    );
  }, [props.usersFromCsv, props.usersToAdd]);

  // Par défaut, les étudiants sont tous selectionnés
  useEffect(() => {
    setAllSelected(true);
  }, []);

  if (props.usersFromCsv.length > 0) {
    return (
      <div className="flex flex-col justify-between h-full items-center">
        <div className="flex flex-col w-full">
          <div className="pl-5 w-full flex gap-2 items-center mb-2">
            <input
              type="checkbox"
              id="select-all"
              checked={allSelected}
              onChange={handleSelectAllChange}
              className="checkbox checkbox-sm rounded-md checkbox-primary border-2"
            />
            <label htmlFor="select-all">Tout sélectionner</label>
          </div>
          <div className="flex flex-col gap-2">
            {props.usersFromCsv.map((user) => (
              <GroupUserItem
                usersToAdd={props.usersToAdd}
                verificationAttribute="email"
                allUserSelected={allSelected}
                key={user.email}
                user={user}
                onAddSelectedUser={props.onAddSelectedUser}
                onDeleteSelectedUser={props.onDeleteSelectedUser}
                forceEnableCheckbox={true}
              />
            ))}
          </div>
        </div>
        <div className="mt-10 flex justify-between w-full items-center pb-4">
          <button className="btn btn-outline" onClick={handleCancel}>
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className={`btn btn-primary text-base-100 ${
              props.isLoading && "loading"
            }`}
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
