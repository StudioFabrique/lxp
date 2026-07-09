import { useContext, useState } from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { ThemeContext } from "../../../store/ThemeProvider";
import { Copy, Check, AlertTriangle } from "lucide-react";

import AndriaLogoLightMode from "../../../assets/andria-logo/logo-lightmode.svg";
import AndriaLogoDarkMode from "../../../assets/andria-logo/logo-darkmode.svg";

const RouterErrorBoundary = () => {
  const error = useRouteError();
  const { theme } = useContext(ThemeContext);
  const [isCopied, setIsCopied] = useState(false);

  console.error("Erreur de routage capturée :", error);

  let statusCode = "";
  let title = "Une erreur inattendue est survenue";
  let message =
    "Nous sommes désolés, mais un problème technique empêche l'affichage de cette page.";

  if (isRouteErrorResponse(error)) {
    statusCode = error.status.toString();
    if (error.status === 404) {
      title = "Page introuvable";
      message =
        "La ressource que vous recherchez n'existe pas ou a été déplacée.";
    } else if (error.status === 401 || error.status === 403) {
      title = "Accès non autorisé";
      message =
        "Vous ne disposez pas des droits nécessaires pour consulter cette ressource.";
    } else if (error.status === 500) {
      title = "Erreur serveur";
      message = "Une erreur interne s'est produite sur le serveur.";
    } else if (error.status === 503) {
      title = "Service indisponible";
      message =
        "Le service est temporairement indisponible. Veuillez réessayer ultérieurement.";
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Préparation de la chaîne de caractères technique pour l'affichage et la copie
  const errorDetails = isRouteErrorResponse(error)
    ? `[${error.status}] ${error.statusText}\n${JSON.stringify(error.data, null, 2)}`
    : error instanceof Error
      ? error.stack || error.message
      : JSON.stringify(error, null, 2);

  // Fonction de copie dans le presse-papiers
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(errorDetails);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Échec de la copie :", err);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 font-inter flex flex-col items-center justify-center p-4">
      {/* En-tête : Logo ANDRiA et Sous-titre */}
      <div className="flex flex-col items-center gap-2 mb-10">
        <img
          className="w-56 h-auto"
          src={theme === "light" ? AndriaLogoLightMode : AndriaLogoDarkMode}
          alt="logo ANDRiA"
        />
        <span className="font-semibold text-base-content text-xs text-center max-w-xs mt-2">
          Apprentissage Numérique & Développement Renforcé par Intelligence
          Artificielle
        </span>
      </div>

      <div className="card w-full max-w-lg bg-base-200 shadow-sm border border-base-300">
        <div className="card-body p-8 text-center items-center">
          {/* Icône sobre et Code Statut */}
          <div className="text-error/80 mb-4 flex flex-col items-center">
            <AlertTriangle className="h-12 w-12 mb-2 stroke-[1.5]" />
            {statusCode && (
              <span className="text-3xl font-light tracking-widest text-base-content/80">
                {statusCode}
              </span>
            )}
          </div>

          {/* Textes explicatifs */}
          <div className="space-y-3 mb-6">
            <h1 className="text-2xl font-semibold text-base-content">
              {title}
            </h1>
            <p className="text-base-content/70 text-sm max-w-sm mx-auto leading-relaxed">
              {message}
            </p>
          </div>

          {/* Accordéon technique avec bouton Copier */}
          <div className="collapse collapse-arrow bg-base-100 border border-base-300 text-left w-full mb-6 rounded-md">
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-xs font-medium text-base-content/60 peer-checked:text-base-content py-3 min-h-0">
              Afficher les détails techniques
            </div>

            <div className="collapse-content">
              <div className="relative">
                {/* Bouton Copier */}
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 btn btn-xs btn-square btn-ghost text-base-content/50 hover:text-base-content hover:bg-base-300 transition-colors"
                  aria-label="Copier l'erreur"
                  title="Copier les détails"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <pre className="text-xs font-mono bg-base-300/30 text-base-content/80 p-3 pt-10 rounded border border-base-300 overflow-x-auto max-h-48 whitespace-pre-wrap">
                  {errorDetails}
                </pre>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline btn-neutral btn-sm h-10 w-full sm:w-auto sm:px-6"
            >
              Actualiser la page
            </button>
            <Link
              to="/"
              className="btn btn-primary btn-sm h-10 w-full sm:w-auto sm:px-6"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouterErrorBoundary;
