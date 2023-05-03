import { Dispatch, FC, MouseEvent, SetStateAction, useState } from "react";
import UserForm from "../../../components/userForm/user-form.component";

const User: FC = () => {
  const [formAction, setFormAction]: [
    "add" | /* "edit" | */ "",
    Dispatch<SetStateAction<any>>
  ] = useState("");

  const handleClickAddUser = (e: MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.className);

    if (e.currentTarget.className === "add-user") setFormAction("add");
    // if (e.currentTarget.className === "edit-user") setFormAction("edit");
  };

  return (
    <div>
      <div>
        <button onClick={handleClickAddUser} className="add-user btn">
          ajouter un utilisateur
        </button>
        {/* réservé pour une autre task : <button className="edit-user btn">modifier un utilisateur</button> */}
      </div>
      {/* form below */}
      <div>
        {formAction.length > 0 ? <UserForm action={formAction} /> : undefined}
      </div>
    </div>
  );
};

export default User;
