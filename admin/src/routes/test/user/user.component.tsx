import { Dispatch, FC, MouseEvent, SetStateAction, useState } from "react";
import UserForm from "../../../components/userForm/user-form.component";

const User: FC = () => {
  const [formAction, setFormAction]: [
    "add" | /* "edit" | */ "",
    Dispatch<SetStateAction<any>>
  ] = useState("");

  const handleClickAddUser = (e: MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.className.split(" "));

    if (e.currentTarget.className.split(" ").includes("add-user"))
      setFormAction("add");
    // if (e.currentTarget.className === "edit-user") setFormAction("edit");
    console.log(formAction);
  };

  return (
    <div className="h-screen w-full flex flex-col justify-between items-center">
      <div className="h-full">
        <button onClick={handleClickAddUser} className="add-user btn">
          ajouter un utilisateur
        </button>
        {/* réservé pour une autre task : <button className="edit-user btn">modifier un utilisateur</button> */}
      </div>
      {/* form below */}
      <div className="h-full">
        {formAction.length > 0 ? (
          <UserForm action={formAction} />
        ) : (
          "aucun formulaire"
        )}
      </div>
    </div>
  );
};

export default User;
