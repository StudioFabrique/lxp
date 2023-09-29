import { useContext } from "react";

import { Context } from "../../store/context.store";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const { logout } = useContext(Context);

  const logoutHandler = () => {
    logout();
  };

  const navigateTo = useNavigate();

  return (
    <div className="w-full flex flex-col gap-4 items-center mt-8">
      <p className="w-fit">
        Bienvenue sur l'interface des apprenants, lieu où il fait bon
        apprendre...
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => navigateTo("parcours")}
      >
        Interface Parcours
      </button>
      <button
        className="w-fit btn btn-primary btn-outline"
        onClick={logoutHandler}
      >
        Déconnexion
      </button>
    </div>
  );
};

export default StudentHome;
