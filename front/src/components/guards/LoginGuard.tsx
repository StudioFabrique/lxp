import { Navigate, Outlet, useLocation } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthProvider";
import Loader from "../loaders/Loader";
import { onboardingApi } from "../../features/auth/api/onboarding.api";
import { useDemoMode } from "../../store/DemoContext";
import { getUserHomePath } from "../../utils/helpers/user-role";

const LoginGuard = () => {
  const { isLoggedIn, isAppInitialized, user } = useContext(AuthContext);
  const { demoMode, isConfigLoaded } = useDemoMode();
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

  if (!isAppInitialized || !isConfigLoaded || (!isLoggedIn && !setupChecked))
    return <Loader />;

  if (isLoggedIn && user) {
    const homePath = getUserHomePath(user);
    if (homePath) return <Navigate replace to={homePath} />;
    return <Navigate replace to="/access-denied" />;
  }

  // Sur l'instance de démonstration, aucune des pages d'authentification n'a
  // de sens pour un visiteur : il n'a pas de compte, et le verrou lecture seule
  // refuse déjà `POST /auth/login` — `demoWriteAllowlist` ne l'autorise pas. Le
  // premier administrateur, lui, vient du jeu de démonstration restauré, donc
  // `/init` n'a pas lieu d'être non plus. Tout ramène à l'entrée publique.
  if (!isLoggedIn && demoMode) {
    return <Navigate replace to="/demo" />;
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
