import { FC, useEffect, useState } from "react";
import User from "../../utils/interfaces/user";
import UserAddForm from "../../components/forms/user-form/user-add-form.component";
import useHttp from "../../hooks/use-http";
import { useLocation, useNavigate } from "react-router-dom";

const UserMultipleAdd: FC<{}> = ({}) => {
  /* 
    locationData contient { users, pathTodirect } 
    users : contient la liste des users à ajouter à la file d'attente d'ajout
    pathTodirect : la route indiquant le chemin de redirection afin de rediriger l'utilisateur après avoir créé tous les users
  */
  const locationData = useLocation().state;

  const navigate = useNavigate();

  const { sendRequest, error, isLoading } = useHttp();

  const [usersQueue, setUsersQueue] = useState<Array<any>>(locationData.users);

  const deleteFromQueue = () => {
    const filteredQueue = usersQueue.shift();
  };

  const handleSubmit = (user: any) => {};

  useEffect(() => {
    if (usersQueue.length <= 0)
      navigate({ pathname: locationData.pathToRedirect });
  });

  return (
    <div className="p-5">
      <UserAddForm
        onSubmitForm={handleSubmit}
        error={error}
        isLoading={isLoading}
        user={usersQueue[0]}
      />
    </div>
  );
};

export default UserMultipleAdd;
