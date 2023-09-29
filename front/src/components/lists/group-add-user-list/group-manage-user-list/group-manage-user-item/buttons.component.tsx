import {
  ChangeEvent,
  FC,
  FormEventHandler,
  Ref,
  useEffect,
  useRef,
} from "react";
import User from "../../../../../utils/interfaces/user";

export const AddUsersButton: FC<{
  isUserSettedUp: boolean;
  onSetUsersToAdd: () => void;
  setUsersSettedState: (value: boolean) => void;
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
  allUserSelected: boolean;
  onAddSelectedUser: (user: User) => void;
  onDeleteSelectedUser: (user: User) => void;
}> = (props) => {
  const checkboxRef: Ref<HTMLInputElement> = useRef(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (checkboxRef.current == null) return;
    if (checkboxRef.current.checked) {
      checkboxRef.current.checked = true;
      props.onAddSelectedUser(props.currentUser);
    } else {
      checkboxRef.current.checked = false;
      props.onDeleteSelectedUser(props.currentUser);
    }
  };

  useEffect(() => {
    if (checkboxRef.current != null)
      checkboxRef.current.checked = props.allUserSelected;
  }, [props.allUserSelected]);

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      checked={checkboxRef.current?.checked ?? false}
      onChange={handleChange}
      className="checkbox checkbox-sm rounded-md checkbox-primary"
    />
  );
};
