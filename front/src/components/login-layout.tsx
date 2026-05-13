import AndriaLogo from "../assets/images/login/logo.svg";
import LoginRightColumn from "./login/login-right-column";
import { PropsWithChildren } from "react";

const LoginLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen w-full font-inter bg-white flex py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
        {/* Colonne Gauche */}
        <div className="flex flex-col items-center px-8 w-full h-full min-h-150 max-h-[85vh]">
          {/* Conteneur central pour le logo et le formulaire */}
          <div className="flex flex-col w-70 h-full mx-auto">
            <div className="flex flex-col items-center gap-2 mb-8">
              <img
                className="w-56 h-auto mt-20"
                src={AndriaLogo}
                alt="logo ANDRiA"
              />
              <span className="font-semibold text-black text-xs text-center max-w-xs">
                Apprentissage Numérique & Développement Renforcé par
                Intelligence Artificielle
              </span>
            </div>

            {/* Formulaire */}
            <div className="w-full flex-1 flex flex-col">{children}</div>
          </div>
        </div>

        {/* Colonne Droite */}
        <LoginRightColumn />
      </div>
    </div>
  );
};

export default LoginLayout;
