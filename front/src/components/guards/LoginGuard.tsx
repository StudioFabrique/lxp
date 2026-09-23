import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthProvider";
import Loader from "../loaders/Loader";
import { onboardingApi } from "../../features/auth/api/onboarding.api";
import { useDemoMode } from "../../store/DemoContext";
import { getUserHomePath, hasRoleRank } from "../../utils/helpers/user-role";
import Modal from "../UI/modal/modal";

const LoginGuard = () => {
  const { isLoggedIn, isAppInitialized, user, logout } = useContext(AuthContext);
  const { demoMode, isConfigLoaded } = useDemoMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [setupChecked, setSetupChecked] = useState(false);
  const [hasAdmins, setHasAdmins] = useState(true);
  const isTokenRoute = ["/createRoot", "/confirm-email"].includes(
    location.pathname,
  );
  const isInstanceSetupRoute = location.pathname === "/instance-setup";
  const isStudentOnboardingRoute = location.pathname === "/student/onboarding";

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

  if (!isAppInitialized || !isConfigLoaded || (!isLoggedIn && !setupChecked)) {
    return location.pathname === "/init" ? (
      <Loader
        variant="rows"
        label="Vérification de l'instance"
        className="my-10"
      />
    ) : (
      <Loader />
    );
  }

  if (isLoggedIn && user && isInstanceSetupRoute) {
    if (user.roles?.[0]?.rank === 0) return <Outlet />;
    return <Navigate replace to={getUserHomePath(user) ?? "/access-denied"} />;
  }

  if (isLoggedIn && user && isStudentOnboardingRoute) {
    return hasRoleRank(user, [3]) ? (
      <Outlet />
    ) : (
      <Navigate replace to={getUserHomePath(user) ?? "/access-denied"} />
    );
  }

  if (isLoggedIn && user && location.pathname === "/register" &&
      new URLSearchParams(location.search).has("id")) {
    const homePath = getUserHomePath(user) ?? "/access-denied";
    return (
      <Modal
        title="Vous êtes déjà connectée"
        leftLabel="Annuler"
        rightLabel="Confirmer la déconnexion"
        onLeftClick={() => navigate(homePath, { replace: true })}
        onRightClick={async () => {
          setIsDisconnecting(true);
          await logout();
          setIsDisconnecting(false);
        }}
        isSubmitting={isDisconnecting}
        rightClassName="btn-primary"
      >
        <p className="mt-4">
          Déconnectez-vous pour activer le compte associé à ce lien.
        </p>
      </Modal>
    );
  }

  if (isLoggedIn && user && !isTokenRoute) {
    const homePath = getUserHomePath(user);
    if (homePath) return <Navigate replace to={homePath} />;
    return <Navigate replace to="/access-denied" />;
  }


  if (!isLoggedIn && isStudentOnboardingRoute) {
    return <Navigate replace to="/login" />;
  }

  // Sur l'instance de démonstration, aucune des pages d'authentification n'a
  // de sens pour un visiteur : il n'a pas de compte, et le verrou lecture seule
  // refuse déjà `POST /auth/login` — `demoWriteAllowlist` ne l'autorise pas. Le
  // premier administrateur, lui, vient du jeu de démonstration restauré, donc
  // `/init` n'a pas lieu d'être non plus. Tout ramène à l'entrée publique.
  if (!isLoggedIn && demoMode) {
    return <Navigate replace to="/demo" />;
  }

  if (
    !isLoggedIn &&
    !hasAdmins &&
    location.pathname !== "/init" &&
    location.pathname !== "/confirm-email"
  ) {
    return <Navigate replace to="/init" />;
  }

  if (!isLoggedIn && hasAdmins && location.pathname === "/init") {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
};

export default LoginGuard;
