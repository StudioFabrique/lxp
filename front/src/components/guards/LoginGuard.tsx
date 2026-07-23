import { Navigate, Outlet, useLocation } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthProvider";
import Loader from "../loaders/Loader";
import { onboardingApi } from "../../features/auth/api/onboarding.api";
import { AbilityContext } from "../../rbac/AbilityProvider";

const LoginGuard = () => {
  const { isLoggedIn, isAppInitialized, user } = useContext(AuthContext);
  const ability = useContext(AbilityContext);
  const location = useLocation();
  const [setupChecked, setSetupChecked] = useState(false);
  const [hasAdmins, setHasAdmins] = useState(true);

  useEffect(() => {
    let active = true;

    if (isLoggedIn) {
      setSetupChecked(true);
      return;
    }

    setSetupChecked(false);

    onboardingApi
      .getSetupStatus()
      .then((res) => {
        if (active) setHasAdmins(res.hasAdmins);
      })
      .catch(() => {
        if (active) setHasAdmins(true);
      })
      .finally(() => {
        if (active) setSetupChecked(true);
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn]);


  if (!isAppInitialized || (!isLoggedIn && !setupChecked)) return <Loader />;

  if (isLoggedIn && user) {
    if (ability.can("layout", "admin"))
      return <Navigate replace to="/admin" />;
    if (ability.can("layout", "student"))
      return <Navigate replace to="/student" />;
    return <Navigate replace to="/access-denied" />;
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
