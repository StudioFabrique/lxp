import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../store/AuthProvider";
import AuthIntroLoading from "../../features/auth/components/AuthIntroLoading";
import LoginLoadingSkeleton from "../../features/auth/components/LoginLoadingSkeleton";
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
  // Chemin pour lequel le statut d'installation a été lu : tant qu'aucun admin
  // n'existe, il est relu à chaque navigation (ex. activation du compte root
  // puis « Continuer » vers /login), sinon la valeur périmée renvoie vers /init.
  const [checkedPath, setCheckedPath] = useState(location.pathname);
  const hasAdminsRef = useRef(true);
  const statusReadRef = useRef(false);
  const isTokenRoute = ["/createRoot", "/confirm-email"].includes(
    location.pathname,
  );
  const isInstanceSetupRoute = location.pathname === "/instance-setup";
  const isStudentOnboardingRoute = location.pathname === "/student/onboarding";
  const isStaffOnboardingRoute = location.pathname === "/staff/onboarding";

  useEffect(() => {
    let active = true;

    if (isLoggedIn) {
      setSetupChecked(true);
      return;
    }

    // Un administrateur existe déjà : le statut ne changera plus, inutile de
    // le relire (et de démonter la page en cours) à chaque navigation.
    if (statusReadRef.current && hasAdminsRef.current) return;

    setSetupChecked(false);
    setCheckedPath(location.pathname);

    onboardingApi
      .getSetupStatus()
      .then((res) => {
        if (!active) return;
        statusReadRef.current = true;
        hasAdminsRef.current = res.hasAdmins;
        setHasAdmins(res.hasAdmins);
      })
      .catch(() => {
        if (!active) return;
        statusReadRef.current = true;
        hasAdminsRef.current = true;
        setHasAdmins(true);
      })
      .finally(() => {
        if (active) setSetupChecked(true);
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn, location.pathname]);

  const setupStale = !isLoggedIn && !hasAdmins && checkedPath !== location.pathname;

  if (!isAppInitialized || !isConfigLoaded || (!isLoggedIn && !setupChecked) || setupStale) {
    if (location.pathname === "/init" || isStudentOnboardingRoute || isStaffOnboardingRoute) return <AuthIntroLoading />;
    return <LoginLoadingSkeleton />;
  }

  if (isLoggedIn && user && isInstanceSetupRoute) {
    if (user.roles?.[0]?.rank === 0) return <Outlet />;
    return <Navigate replace to={getUserHomePath(user) ?? "/access-denied"} />;
  }

  if (isLoggedIn && user && isStudentOnboardingRoute) {
    if (demoMode) return <Navigate replace to="/student/dashboard" />;
    return hasRoleRank(user, [3]) ? (
      <Outlet />
    ) : (
      <Navigate replace to={getUserHomePath(user) ?? "/access-denied"} />
    );
  }

  if (isLoggedIn && user && isStaffOnboardingRoute) {
    return hasRoleRank(user, [1, 2]) ? (
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
        title={`Vous êtes déjà connectée avec ${user.email}`}
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


  if (!isLoggedIn && (isStudentOnboardingRoute || isStaffOnboardingRoute)) {
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
