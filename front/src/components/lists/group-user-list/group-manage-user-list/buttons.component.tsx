import { ChangeEvent, FC, FormEventHandler } from "react";

export const AddUsersButton: FC<{
  onSetUsersToAdd: () => void;
  setUserSettedState: (value: boolean) => void;
  isUserSettedUp: boolean;
}> = (props) => {
  const handleClick: FormEventHandler = () => {
    props.setUserSettedState(true);
  };

  if (!props.isUserSettedUp) {
    return (
      <button
        type="button"
        className="btn btn-sm btn-primary self-center"
        onClick={handleClick}
      >
        ajouter les utilisateurs
      </button>
    );
  } else {
    return <></>;
  }
};

export const SelectionButton: FC<{
  currentUser: string;
  users: any[];
  onAddSelectedUser: (userId: string) => void;
  onDeleteSelectedUser: (userId: string) => void;
}> = (props) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.currentTarget.checked
      ? props.onAddSelectedUser(props.currentUser)
      : props.onDeleteSelectedUser(props.currentUser);
  };

  return (
    <input
      type="checkbox"
      onChange={handleChange}
      className="checkbox checkbox-sm rounded-md checkbox-primary"
    />
  );
};
