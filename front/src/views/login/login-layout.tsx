import AndriaLogo from "../../assets/images/login/logo.svg";
import LoginRightColumn from "../../components/login/login-right-column";
import { PropsWithChildren } from "react";

const LoginLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen w-full font-inter bg-white flex items-center py-12">
      <div className="grid grid-cols-1 xl:grid-cols-3 w-full">
        {/* Colonne Gauche */}
        <div className="flex flex-col px-8 lg:px-16 xl:px-24 w-full h-full min-h-[600px] max-h-[85vh] py-8">
          {/* Conteneur central pour le logo et le formulaire */}
          <div className="flex flex-col w-full h-full max-w-md mx-auto">
            <div className="flex flex-col items-center gap-2 mb-8">
              <img className="w-56 h-auto" src={AndriaLogo} alt="logo ANDRiA" />
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
