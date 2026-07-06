import { useContext } from "react";
import { ROLES_RANKS } from "../../utils/roles-rank";
import { AuthContext } from "../../store/AuthProvider";
import Loader from "../loaders/Loader";
import { Navigate, Outlet } from "react-router";

interface Props {
  allowedRanks: ROLES_RANKS[]; // ex: [1, 2] pour Admin, [3] pour Étudiant
}

const RouteGuard = ({ allowedRanks }: Props) => {
  const { isLoggedIn, isAppInitialized, user } = useContext(AuthContext);

  if (!isAppInitialized) return <Loader />;

  if (!isLoggedIn || !user) {
    return <Navigate replace to="/login" />;
  }

  // Dans RouteGuard.tsx
  const userRank = user.roles?.[0]?.rank;

  if (userRank === undefined) {
    return <Navigate replace to="/login" />;
  }

  // Vérification standard des droits
  if (!allowedRanks.includes(userRank)) {
    return <Navigate replace to={userRank < 3 ? "/admin" : "/student"} />;
  }

  return <Outlet />;
};

export default RouteGuard;
