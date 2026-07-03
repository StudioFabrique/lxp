import { Navigate, Outlet } from "react-router";
import { ROLES_RANKS } from "../../utils/roles-rank";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import Loader from "../loaders/Loader";

const LoginGuard = () => {
  const { isLoggedIn, isAppInitialized, user } = useContext(AuthContext);

  // Attend que l'app sache si l'user est connecté ou non
  if (!isAppInitialized) return <Loader />;

  // Si connecté, le redirige selon son rang
  if (isLoggedIn && user) {
    const rank = user.roles?.[0]?.rank;
    if (rank !== undefined) {
      return (
        <Navigate
          replace
          to={
            [ROLES_RANKS.SUPER_ADMIN, ROLES_RANKS.ADMIN].includes(rank)
              ? "/admin"
              : "/student"
          }
        />
      );
    }
  }

  // S'il n'est pas connecté, affiche la route publique
  return <Outlet />;
};

export default LoginGuard;
