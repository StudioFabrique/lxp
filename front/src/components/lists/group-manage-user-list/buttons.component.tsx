import { FC, FormEventHandler } from "react";

export const AddUsersButton: FC<{
  onSetUsersToAdd: (usersId: string[]) => void;
  selectedUsers: string[];
}> = (props) => {
  const handleClick: FormEventHandler = () => {
    if (props.selectedUsers.length > 0)
      props.onSetUsersToAdd(props.selectedUsers);
  };

  return (
    <button
      type="button"
      className="btn btn-sm bg-blue-500 text-white"
      onClick={handleClick}
    >
      ajouter les utilisateurs selectionnés
    </button>
  );
};

export const SelectionButton: FC<{
  selectedUsers: string[];
  currentUser: string;
  ManageSelectedUser: (userId: string) => void;
}> = (props) => {
  const handleChange = () => {
    props.ManageSelectedUser(props.currentUser);
  };

  return <input type="checkbox" onChange={handleChange} className="checkbox" />;
};

export const CancelButton: FC<{ onCleanup: () => void }> = ({ onCleanup }) => {
  const handleClick = () => {
    onCleanup();
  };

  return (
    <button
      type="submit"
      onClick={handleClick}
      className="btn btn-xs bg-red-600 text-white"
    >
      Annuler
    </button>
  );
};
