import type { ReactNode } from "react";
import SidebarBottom from "./SidebarBottom";
import { useInstanceBranding } from "../../hooks/useInstanceBranding";
import { useDemoMode } from "../../store/DemoContext";
import DemoModeIndicator from "../../features/demo/components/DemoModeIndicator";
import { useVisualPreferences } from "../../store/VisualPreferences";
import { cn } from "../../utils/cn";
import { sidebarTransitionClassName } from "./sidebar-styles";

const SidebarWrapper = ({
  children,
  interfaceType,
}: {
  children: ReactNode;
  interfaceType: string;
}) => {
  const { demoMode } = useDemoMode();
  const { animations } = useVisualPreferences();

  const { logoUrl, backgroundColor } = useInstanceBranding();

  return (
    // Largeur explicite dans les deux modes (compact : un contrôle de 2rem + padding + bordure)
    // pour que le passage de l'un à l'autre soit interpolé par le navigateur.
    <nav
      data-animated={animations}
      className={cn(
        "group/sidebar h-full w-[calc(4rem+2px)] 2xl:w-[20rem] flex flex-col justify-between gap-4 p-4 rounded-xl border bg-(--sidebar-bg) text-(--sidebar-content) border-(--sidebar-border) shadow-sm transition-colors duration-200",
        animations &&
          cn("transition-[width,background-color,border-color]", sidebarTransitionClassName),
      )}
    >
      <div>
        {logoUrl && (
          <img
            className={cn(
              "self-start 2xl:h-12.5 2xl:w-12.5 h-8 w-8 rounded-full border object-contain p-1 mb-3 bg-white border-(--sidebar-border)",
              animations &&
                cn("transition-[width,height]", sidebarTransitionClassName),
            )}
            src={logoUrl}
            style={{ backgroundColor }}
            alt="Logo de l’organisme"
          />
        )}
        {demoMode && <DemoModeIndicator />}
        {children}
      </div>
      <SidebarBottom interfaceType={interfaceType} />
    </nav>
  );
};

export default SidebarWrapper;
