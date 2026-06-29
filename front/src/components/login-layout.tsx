import AndriaLogoLightMode from "../assets/images/login/logo.svg";
import AndriaLogoDarkMode from "../assets/images/new-logo-2.svg";
import LoginRightColumn from "./login/login-right-column";
import { PropsWithChildren, useContext, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Context } from "../store/context.store";

const LoginLayout = ({ children }: PropsWithChildren) => {
  const { theme, toggleTheme, initTheme } = useContext(Context);

  useEffect(() => initTheme(), [initTheme]);

  return (
    <div className="relative min-h-screen w-full font-inter bg-base-100 flex py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
        {/* Colonne Gauche */}
        <div className="flex flex-col items-center px-8 w-full h-full min-h-150 max-h-[85vh]">
          <div className="flex flex-col w-70 h-full mx-auto">
            <div className="flex flex-col items-center gap-2 mb-8">
              <img
                className="w-56 h-auto mt-20"
                src={
                  theme === "light" ? AndriaLogoLightMode : AndriaLogoDarkMode
                }
                alt="logo ANDRiA"
              />
              <span className="font-semibold text-black text-xs text-center max-w-xs">
                Apprentissage Numérique & Développement Renforcé par
                Intelligence Artificielle
              </span>
            </div>

            <div className="w-full flex-1 flex flex-col">{children}</div>
          </div>
          {/* Bouton de bascule de thème */}
          <button
            onClick={toggleTheme}
            className="btn btn-circle btn-ghost self-end"
            aria-label="Changer le thème"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-600" />
            ) : (
              <Sun className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Colonne Droite */}
        <LoginRightColumn />
      </div>
    </div>
  );
};

export default LoginLayout;
