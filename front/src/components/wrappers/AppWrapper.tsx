import { PropsWithChildren, ReactNode } from "react";
import { useIntroPresentation } from "../../features/intro-presentation/useIntroPresentation";
import { useVisualPreferences } from "../../store/VisualPreferences";
import { cn } from "../../utils/cn";

type Props = {
  sidebar: ReactNode;
  loader: ReactNode;
};

const AppWrapper = ({ children, sidebar }: PropsWithChildren<Props>) => {
  const { sidebarPhase } = useIntroPresentation();
  const { animations } = useVisualPreferences();

  return (
    <div className="relative flex flex-col h-screen p-2 bg-base-100 box-border">
      <div className="flex gap-2 h-full overflow-hidden">
        {/* Sidebar */}
        {/* Pendant la présentation, la barre est une bande horizontale en haut à gauche, posée sur le contenu ;
            en sortie, elle recule légèrement puis part d'un coup vers la gauche, comme poussée. */}
        <aside
          className={cn(
            // Au-dessus des éléments du contenu (calendrier, en-têtes sticky jusqu'à z-30) pour que
            // la bulle du questionnaire ne passe pas dessous ; sous les modales et tiroirs (z-50).
            "z-40",
            // Apparition en fondu à la connexion, au rechargement et au retour de la séquence (la barre masquée se réaffiche).
            animations && "animate-[app-fade-in_0.8s_ease-out]",
            sidebarPhase === "normal" ? "h-full" : "absolute left-2 top-2",
            sidebarPhase === "leaving" &&
              "-translate-x-[130%] transition-transform duration-700 ease-[cubic-bezier(0.6,-0.28,0.735,0.045)] motion-reduce:transition-none",
            sidebarPhase === "gone" && "hidden",
          )}
        >
          {sidebar}
        </aside>

        <main
          id="main-scroll-container"
          className="min-w-0 overflow-y-auto w-full h-full relative"
        >
          {/* Children */}

          <div className="flex min-w-0 justify-center">
            <div className="min-w-0 mt-[8vh] mb-[4vh] xl:w-[80%] w-[90%]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppWrapper;
