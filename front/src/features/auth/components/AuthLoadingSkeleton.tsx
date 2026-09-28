import AndriaLogoLight from "../../../assets/andria-logo/logo-lightmode.svg";
import AndriaLogoDark from "../../../assets/andria-logo/logo-darkmode.svg";
import { useContext } from "react";
import { ThemeContext } from "../../../store/ThemeProvider";

/** Auth layout placeholder before its lazy route and session check finish. */
export default function AuthLoadingSkeleton() {
  const { theme } = useContext(ThemeContext);
  return (
    <div role="status" aria-label="Chargement de la connexion" className="grid min-h-dvh grid-cols-1 bg-base-100 py-12 lg:grid-cols-2">
      <span className="sr-only">Chargement de la connexion…</span>
      <div className="relative flex min-h-[calc(100vh-6rem)] flex-col items-center px-8">
        <div className="mx-auto flex h-full w-full max-w-100 flex-col items-center">
          <img src={theme === "dark" ? AndriaLogoDark : AndriaLogoLight} alt="ANDRIA" className="mt-20 w-56" />
          <p className="mt-4 max-w-xs text-center text-xs font-semibold">Apprentissage Numérique & Développement Renforcé par Intelligence Artificielle</p>
          <div className="mt-20 w-full">
            <div className="skeleton mx-auto mb-6 h-7 w-72 max-w-full" />
            <div className="space-y-4">
              <div className="skeleton h-12 w-full rounded-lg" />
              <div className="skeleton h-12 w-full rounded-lg" />
              <div className="skeleton mt-2 h-10 w-full rounded-lg" />
              <div className="skeleton mx-auto mt-6 h-4 w-36" />
            </div>
          </div>

        </div>
      </div>
      <div className="hidden min-h-[calc(100vh-6rem)] grid-cols-3 grid-rows-3 gap-2 overflow-hidden lg:grid">
        {Array.from({ length: 9 }, (_, index) => <div key={index} className="skeleton rounded-xl" />)}
      </div>
    </div>
  );
}
