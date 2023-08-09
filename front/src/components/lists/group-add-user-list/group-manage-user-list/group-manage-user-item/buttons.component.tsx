import { ChangeEvent, FC, FormEventHandler } from "react";
import User from "../../../../../utils/interfaces/user";

export const AddUsersButton: FC<{
  onSetUsersToAdd: () => void;
  setUsersSettedState: (value: boolean) => void;
  isUserSettedUp: boolean;
}> = (props) => {
  const handleClick: FormEventHandler = () => {
    props.setUsersSettedState(true);
    props.onSetUsersToAdd();
  };

  if (!props.isUserSettedUp) {
    return (
      <button
        type="button"
        className="btn btn-sm btn-primary self-center"
        onClick={handleClick}
      >
        ajouter
      </button>
    );
  } else {
    return <></>;
  }
};

export const SelectionButton: FC<{
  currentUser: User;
  onAddSelectedUser: (user: User) => void;
  onDeleteSelectedUser: (user: User) => void;
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
