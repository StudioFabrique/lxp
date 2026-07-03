import { Suspense, useContext } from "react";
import Loader from "../components/loaders/Loader";
import { AuthContext } from "../store/AuthProvider";
import { Navigate, Outlet } from "react-router";

// Permet d'enrober n'importe quel composant lazy-loadé proprement
// exemple : const Login = lazy(() => import("./views/Login"));
//           { path: "/login", element: withSuspense(Login) },
const withSuspense = (Component: React.ElementType) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

const LoginGuard = () => {
  const { isLoggedIn, isAppInitialized, user } = useContext(AuthContext);

  // Attend que l'app sache si l'user est connecté ou non
  if (!isAppInitialized) return <Loader />;

  // Si connecté, le redirige selon son rang
  if (isLoggedIn && user) {
    const rank = user.roles?.[0]?.rank;
    if (rank !== undefined) {
      return <Navigate replace to={rank < 3 ? "/admin" : "/student"} />;
    }
  }

  // S'il n'est pas connecté, affiche la route publique
  return <Outlet />;
};

export default LoginGuard;

interface RoleGuardProps {
  allowedRanks: number[]; // ex: [1, 2] pour Admin, [3] pour Étudiant
}

const RoleGuard = ({ allowedRanks }: RoleGuardProps) => {
  const { isLoggedIn, isAppInitialized, user } = useContext(AuthContext);

  if (!isAppInitialized) return <Loader />;

  if (!isLoggedIn || !user) {
    return <Navigate replace to="/login" />;
  }

  const userRank = user.roles?.[0]?.rank;

  // Si l'utilisateur n'a pas le bon rang pour cette route
  if (userRank === undefined || !allowedRanks.includes(userRank)) {
    return (
      <Navigate
        replace
        to={userRank !== undefined && userRank < 3 ? "/admin" : "/student"}
      />
    );
  }

  // S'il a le droit, affiche la route layout enfant
  return <Outlet />;
};

export { withSuspense, LoginGuard, RoleGuard };
