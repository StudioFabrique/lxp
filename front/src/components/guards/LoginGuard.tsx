import { Navigate, Outlet, useLocation } from "react-router";
import { ROLES_RANKS } from "../../utils/helpers/roles-rank";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthProvider";
import Loader from "../loaders/Loader";
import { onboardingApi } from "../../features/auth/api/onboarding.api";

const LoginGuard = () => {
  const { isLoggedIn, isAppInitialized, user } = useContext(AuthContext);
  const location = useLocation();
  const [setupChecked, setSetupChecked] = useState(false);
  const [hasAdmins, setHasAdmins] = useState(true);

  useEffect(() => {
    if (isAppInitialized && !isLoggedIn) {
      onboardingApi
        .getSetupStatus()
        .then((res) => setHasAdmins(res.hasAdmins))
        .catch(() => setHasAdmins(true))
        .finally(() => setSetupChecked(true));
    } else {
      setSetupChecked(true);
    }
  }, [isAppInitialized, isLoggedIn]);

  if (!isAppInitialized || (!isLoggedIn && !setupChecked)) return <Loader />;

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

  if (!isLoggedIn && !hasAdmins && location.pathname !== "/init") {
    return <Navigate replace to="/init" />;
  }

  if (!isLoggedIn && hasAdmins && location.pathname === "/init") {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
};

export default LoginGuard;
