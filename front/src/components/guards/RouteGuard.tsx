import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { AbilityContext } from "../../rbac/AbilityProvider";
import Loader from "../loaders/Loader";
import { Navigate, Outlet } from "react-router";

const RouteGuard = ({ layout }: { layout: "admin" | "student" }) => {
  const { isLoggedIn, isAppInitialized, user } = useContext(AuthContext);
  const ability = useContext(AbilityContext);

  if (!isAppInitialized) return <Loader />;
  if (!isLoggedIn || !user) return <Navigate replace to="/login" />;
  if (!ability.can("layout", layout)) {
    return <Navigate replace to="/access-denied" />;
  }
  return <Outlet />;
};

export default RouteGuard;
