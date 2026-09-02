import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { AuthContext } from "../../store/AuthProvider";
import { useDemoMode } from "../../store/DemoContext";

export default function AccessDenied() {
  const { logout } = useContext(AuthContext);
  const { demoMode } = useDemoMode();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate(demoMode ? "/demo" : "/login", { replace: true });
  };

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="max-w-lg text-center space-y-4">
        <h1 className="text-3xl font-semibold">Accès refusé</h1>
        <p className="text-base-content/70">
          Votre rôle actuel ne permet pas d’accéder à cette page.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link className="btn btn-primary" to="/">
            Revenir à l’accueil
          </Link>
          <button
            type="button"
            className="btn btn-outline btn-primary"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Déconnexion…" : "Se déconnecter"}
          </button>
        </div>
      </div>
    </main>
  );
}
