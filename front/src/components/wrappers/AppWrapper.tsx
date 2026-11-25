import { PropsWithChildren, ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { useFormPageAutoFocus } from "../../hooks/useFormPageAutoFocus";
import { useIntroPresentation } from "../../features/intro-presentation/useIntroPresentation";
import { useVisualPreferences } from "../../store/VisualPreferences";
import { cn } from "../../utils/cn";
import { MobileHeaderActionsProvider } from "../../store/MobileHeaderActionsProvider";
import { StickyBarStackProvider } from "../headers/sticky-bar-stack";
import { SidebarRetractionContext } from "../../store/SidebarRetractionContext";

type Props = {
  sidebar: ReactNode;
  loader: ReactNode;
};

const AppWrapper = ({ children, sidebar }: PropsWithChildren<Props>) => {
  const { sidebarPhase } = useIntroPresentation();
  const { animations } = useVisualPreferences();
  const mainRef = useRef<HTMLElement>(null);
  useFormPageAutoFocus(mainRef);
  // Nombre de contenus plein écran demandant le recul de la barre latérale.
  const [retractions, setRetractions] = useState(0);
  const retain = useCallback(() => {
    setRetractions((count) => count + 1);
    return () => setRetractions((count) => count - 1);
  }, []);
  const retraction = useMemo(() => ({ retain }), [retain]);
  const isRetracted = retractions > 0;

  return (
    <SidebarRetractionContext.Provider value={retraction}>
    <MobileHeaderActionsProvider>
    {/* `dvh` et non `vh` : sur mobile, `100vh` dépasse la zone visible tant que la barre du navigateur est affichée,
        la page défilait alors en plus de `main` et la barre du haut partait avec elle. */}
    <div className="relative flex flex-col h-dvh overflow-hidden p-2 bg-base-100 box-border">
      <div className="flex flex-col md:flex-row gap-2 h-full overflow-hidden">
        {/* Sidebar */}
        {/* Sous `md`, la barre latérale devient une barre de navigation en haut de l'écran. */}
        {/* Pendant la présentation, la barre est une bande horizontale en haut à gauche, posée sur le contenu ;
            en sortie, elle recule légèrement puis part d'un coup vers la gauche, comme poussée. */}
        <aside
          // Barre reculée : hors du focus clavier et de la lecture d'écran tant que l'aperçu est ouvert.
          inert={isRetracted}
          className={cn(
            "md:transition-transform md:duration-500 md:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            isRetracted && "md:-translate-x-[130%]",
            // Au-dessus des éléments du contenu (calendrier, en-têtes sticky jusqu'à z-30) pour que
            // la bulle du questionnaire ne passe pas dessous ; sous les modales et tiroirs (z-50).
            "z-40",
            // Apparition en fondu à la connexion, au rechargement et au retour de la séquence (la barre masquée se réaffiche).
            animations && "animate-[app-fade-in_0.8s_ease-out]",
            sidebarPhase === "normal" ? "md:h-full" : "absolute left-2 top-2",
            sidebarPhase === "leaving" &&
              "-translate-x-[130%] transition-transform duration-700 ease-[cubic-bezier(0.6,-0.28,0.735,0.045)] motion-reduce:transition-none",
            sidebarPhase === "gone" && "hidden",
          )}
        >
          {sidebar}
        </aside>

        <main
          ref={mainRef}
          id="main-scroll-container"
          className="min-h-0 min-w-0 overflow-y-auto w-full h-full relative"
        >
          {/* Children */}

          <StickyBarStackProvider>
            <div className="flex min-w-0 justify-center">
              <div data-page-content className="min-w-0 mt-4 md:mt-[8vh] mb-[4vh] max-md:mb-24 xl:w-[80%] w-[90%]">
                {children}
              </div>
            </div>
          </StickyBarStackProvider>
        </main>
      </div>
    </div>
    </MobileHeaderActionsProvider>
    </SidebarRetractionContext.Provider>
  );
};

export default AppWrapper;
