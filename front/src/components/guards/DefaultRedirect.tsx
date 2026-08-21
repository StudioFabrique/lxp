import { Navigate } from "react-router";
import { useDemoMode } from "../../store/DemoContext";

/**
 * Destination par défaut, décidée à l'exécution.
 *
 * Sur l'instance de démonstration, le visiteur n'a pas de compte : `/login` lui
 * présente un formulaire qu'il ne peut pas remplir. Son entrée est `/demo`.
 *
 * Le choix ne peut pas être fait à la construction du bundle — l'image est la
 * même sur toutes les instances — et il attend `isConfigLoaded` : sans cela le
 * premier rendu partirait sur la valeur par défaut, `demoMode: false`, et la
 * redirection vers `/login` serait déjà consommée.
 */
export default function DefaultRedirect() {
  const { demoMode, isConfigLoaded } = useDemoMode();

  if (!isConfigLoaded) return null;

  return <Navigate replace to={demoMode ? "/demo" : "/login"} />;
}
