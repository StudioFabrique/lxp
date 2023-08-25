import { useContext } from "react";

import { Context } from "../../store/context.store";

const StudentHome = () => {
  const { logout } = useContext(Context);

  const logoutHandler = () => {
    logout();
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center mt-8">
      <p className="w-fit">
        Bienvenue sur l'interface des apprenants, lieu où il fait bon
        apprendre...
      </p>
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
