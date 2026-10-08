import { PropsWithChildren, ReactNode } from "react";
import { useIntroPresentation } from "../../features/intro-presentation/useIntroPresentation";
import { cn } from "../../utils/cn";

type Props = {
  sidebar: ReactNode;
  loader: ReactNode;
};

const AppWrapper = ({ children, sidebar }: PropsWithChildren<Props>) => {
  const { sidebarPhase } = useIntroPresentation();

  return (
    <div className="relative flex flex-col h-screen p-2 bg-base-100 box-border">
      <div className="flex gap-2 h-full overflow-hidden">
        {/* Sidebar */}
        {/* Pendant la présentation, la barre est une bande horizontale en haut à droite, posée sur le contenu ;
            en sortie, elle recule légèrement puis part d'un coup vers la droite, comme poussée. */}
        <aside
          className={cn(
            "z-20",
            sidebarPhase === "normal" ? "h-full" : "absolute right-2 top-2",
            sidebarPhase === "leaving" &&
              "translate-x-[130%] transition-transform duration-700 ease-[cubic-bezier(0.6,-0.28,0.735,0.045)] motion-reduce:transition-none",
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
