import AndriaLogoLightMode from "../assets/logo-lightmode.svg";
import AndriaLogoDarkMode from "../assets/logo-darkmode.svg";
import { PropsWithChildren, ReactNode, useContext, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "../../../store/ThemeProvider";

type Props = {
  loginRighColumn: ReactNode;
};

const AuthLayout = ({
  loginRighColumn,
  children,
}: PropsWithChildren<Props>) => {
  const { theme, toggleTheme, initTheme } = useContext(ThemeContext);

  useEffect(() => initTheme(), [initTheme]);

  return (
    <div className="relative min-h-screen w-full font-inter bg-base-100 flex py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
        <div className="relative flex flex-col items-center px-8 w-full h-full min-h-150 max-h-[85vh]">
          <button
            onClick={toggleTheme}
            className="absolute top-0 right-4 lg:right-8 btn btn-circle btn-ghost text-base-content/70 hover:text-base-content transition-colors"
            aria-label="Changer le thème"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <div className="flex flex-col w-70 h-full mx-auto">
            <div className="flex flex-col items-center gap-2 mb-8">
              <img
                className="w-56 h-auto mt-20"
                src={
                  theme === "light" ? AndriaLogoLightMode : AndriaLogoDarkMode
                }
                alt="logo ANDRiA"
              />
              <span className="font-semibold text-base-content text-xs text-center max-w-xs mt-2">
                Apprentissage Numérique & Développement Renforcé par
                Intelligence Artificielle
              </span>
            </div>

            <div className="w-full flex-1 flex flex-col">{children}</div>
          </div>
        </div>

        {/* Colonne Droite */}
        {loginRighColumn}
      </div>
    </div>
  );
};

export default AuthLayout;
