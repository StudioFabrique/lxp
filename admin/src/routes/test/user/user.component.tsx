import { FC } from "react";
import { Link } from "react-router-dom";

const User: FC = () => {

  return (
    <div className="h-screen w-full p-5 flex flex-col justify-between items-center">
      <Link to="créer" className="btn">
        Créer un utilisateur
      </Link>
    </div>
  );
};

export default User;
