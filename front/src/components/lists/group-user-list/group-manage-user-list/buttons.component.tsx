import { FC, FormEventHandler, useEffect, useState } from "react";

export const AddUsersButton: FC<{
  onSetUsersToAdd: (usersId: string[]) => void;
  setUserSettedState: (value: boolean) => void;
  selectedUsers: string[];
  isUserSettedUp: boolean;
}> = (props) => {
  const handleClick: FormEventHandler = () => {
    if (props.selectedUsers.length > 0) {
      props.onSetUsersToAdd(props.selectedUsers);
      props.setUserSettedState(true);
    }
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
  ManageSelectedUsers: (userId: string) => void;
  setUserSettedState: (value: boolean) => void;
}> = (props) => {
  const [isChecked, setCheck] = useState(false);

  const handleChange = () => {
    props.ManageSelectedUsers(props.currentUser);
    props.setUserSettedState(false);
  };

  useEffect(() => {
    if (props.users.some((user) => user._id !== props.currentUser)) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }, [props.currentUser, props.users]);

  return (
    <input
      type="checkbox"
      onChange={handleChange}
      className="checkbox"
      defaultChecked={isChecked}
    />
  );
};
