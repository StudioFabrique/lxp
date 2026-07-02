// src/components/guards/GuestGuard.tsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../../../store/AuthProvider";
import Loader from "../../../components/loaders/Loader";

const LoginGuard = () => {
  const { isLoggedIn, isAppInitialized, user } = useContext(AuthContext);

  // Attend que l'app sache si l'user est connecté ou non
  if (!isAppInitialized) return <Loader />;

  // Si connecté, on le redirige selon son rang
  if (isLoggedIn && user) {
    const rank = user.roles?.[0]?.rank;
    if (rank !== undefined) {
      return <Navigate replace to={rank < 3 ? "/admin" : "/student"} />;
    }
  }

  // S'il n'est pas connecté, on affiche la route publique (ex: Login)
  return <Outlet />;
};

export default LoginGuard;
