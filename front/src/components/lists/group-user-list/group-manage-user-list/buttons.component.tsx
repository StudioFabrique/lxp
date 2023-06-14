import { ChangeEvent, FC, FormEventHandler } from "react";

export const AddUsersButton: FC<{
  onSetUsersToAdd: () => void;
  setUserSettedState: (value: boolean) => void;
  isUserSettedUp: boolean;
}> = (props) => {
  const handleClick: FormEventHandler = () => {
    props.onSetUsersToAdd;
    props.setUserSettedState(true);
  };

  return props.isUserSettedUp ? (
    <button
      type="button"
      className="btn btn-disabled btn-sm bg-blue-500 text-white w-[70%] self-center"
      onClick={handleClick}
    >
      utilisateurs ajoutés
    </button>
  ) : (
    <button
      type="button"
      className="btn btn-sm bg-blue-500 text-white w-[70%] self-center"
      onClick={handleClick}
    >
      confirmer modifications
    </button>
  );
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

  return <input type="checkbox" onChange={handleChange} className="checkbox" />;
};
