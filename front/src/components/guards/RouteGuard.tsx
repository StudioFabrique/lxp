import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { AbilityContext } from "../../rbac/AbilityProvider";
import { useDemoMode } from "../../store/DemoContext";
import Loader from "../loaders/Loader";
import { Navigate, Outlet } from "react-router";

const RouteGuard = ({ layout }: { layout: "admin" | "student" }) => {
  const { isLoggedIn, isAppInitialized, user } = useContext(AuthContext);
  const ability = useContext(AbilityContext);
  const { demoMode, isConfigLoaded } = useDemoMode();

  // Rien ne doit se monter avant que la configuration d'exécution soit lue :
  // tant qu'elle manque, `demoMode` et `aiDisabled` valent faux, et une page de
  // l'instance de démonstration se comporterait comme une page ordinaire —
  // génération IA lancée, temps réel connecté, écritures tentées. `LoginGuard`
  // attend déjà cette même valeur.
  if (!isAppInitialized || !isConfigLoaded) return <Loader />;
  // Un visiteur de la démonstration n'a pas d'identifiants : quand sa session
  // expire, le renvoyer vers le formulaire de connexion serait une impasse.
  if (!isLoggedIn || !user) {
    return <Navigate replace to={demoMode ? "/demo" : "/login"} />;
  }
  if (!ability.can("layout", layout)) {
    return <Navigate replace to="/access-denied" />;
  }
  return <Outlet />;
};

export default RouteGuard;
