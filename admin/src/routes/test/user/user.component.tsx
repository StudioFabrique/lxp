import { Dispatch, FC, MouseEvent, SetStateAction, useState } from "react";
import UserForm from "../../../components/userForm/user-form.component";
import useHttp from "../../../hooks/use-http";
// import * as IUser from "../../../utils/interfaces/user";

const User: FC = () => {
  const { error, isLoading, sendRequest } = useHttp();

  const [formAction, setFormAction]: [
    "add" | /* "edit" | */ "",
    Dispatch<SetStateAction<any>>
  ] = useState("");

  const handleSubmit = (user: HTMLFormControlsCollection) => {
    if (formAction === "add")
      sendRequest({ method: "post", path: "", body: user }, (data: any) => "");
  };

  const handleClickAddUser = (e: MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.className.split(" "));

    if (e.currentTarget.className.split(" ").includes("add-user"))
      setFormAction("add");
    if (e.currentTarget.className.split(" ").includes("close"))
      setFormAction("");
    // if (e.currentTarget.className === "edit-user") setFormAction("edit");
    console.log(formAction);
  };

  return (
    <div className="h-screen w-full p-5 flex flex-col justify-between items-center">
      <div className="h-full">
        <button onClick={handleClickAddUser} className="add-user btn">
          ajouter un utilisateur
        </button>
        {/* réservé pour une autre task : <button className="edit-user btn">modifier un utilisateur</button> */}
      </div>
      {/* form below */}
      <div className="h-full">
        {formAction.length > 0 ? (
          <>
            <button
              onClick={handleClickAddUser}
              className="close btn btn-sm mb-10"
            >
              fermer
            </button>
            <UserForm onSubmit={handleSubmit} action={formAction} />
          </>
        ) : (
          "aucun formulaire"
        )}
      </div>
    </div>
  );
};

export default User;
