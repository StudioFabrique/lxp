import { FC, useEffect, useState } from "react";

const SelectionButton: FC<{
  selectedUsers: string[];
  currentUser: string;
  ManageSelectedUser: (userId: string) => void;
}> = (props) => {
  const [component, setComponent] = useState<React.ReactElement>(
    <button>Sélectionner</button>
  );

  useEffect(() => {
    function handleClick() {
      props.ManageSelectedUser(props.currentUser);
    }

    props.selectedUsers.includes(props.currentUser)
      ? setComponent(
          <button onClick={handleClick} className="bg-red-500">
            Déselectionner
          </button>
        )
      : setComponent(
          <button onClick={handleClick} className="bg-green-500">
            Sélectionner
          </button>
        );
  }, [props]);

  return <div>{component}</div>;
};

export default SelectionButton;
